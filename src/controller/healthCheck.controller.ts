import os from 'os';
import v8 from 'v8';
import type { Request, Response } from 'express';
import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';

type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

interface ServiceCheck {
  status: HealthStatus;
  responseTimeMs?: number;
  error?: string;
}

interface HealthCheckResult {
  status: HealthStatus;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  system: {
    memoryUsageMB: {
      heapUsed: number;
      heapTotal: number;
      heapLimit: number;
      rss: number;
      external: number;
    };
    memoryUsagePercent: number;
    cpuLoadAvg: number[];
    platform: string;
    nodeVersion: string;
    pid: number;
  };
  services: Record<string, ServiceCheck>;
}

const serviceChecks: Record<string, () => Promise<ServiceCheck>> = {};

// now based on REAL heap pressure
const DEGRADED_HEAP_THRESHOLD = 0.85;

function deriveOverallStatus(
  checks: Record<string, ServiceCheck>,
  heapPercent: number,
): HealthStatus {
  if (Object.values(checks).some((c) => c.status === 'unhealthy')) return 'unhealthy';

  if (
    Object.values(checks).some((c) => c.status === 'degraded') ||
    heapPercent >= DEGRADED_HEAP_THRESHOLD
  ) {
    return 'degraded';
  }

  return 'healthy';
}

export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const mem = process.memoryUsage();

  // 🔥 FIX: use V8 heap limit instead of heapTotal
  const heapStats = v8.getHeapStatistics();
  const heapLimit = heapStats.heap_size_limit;

  const usedHeap = mem.heapUsed;
  const heapPercent = heapLimit > 0 ? usedHeap / heapLimit : 0;

  const checkEntries = Object.entries(serviceChecks);

  const settledChecks = await Promise.allSettled(
    checkEntries.map(([, fn]) =>
      Promise.race([
        fn(),
        new Promise<ServiceCheck>((resolve) =>
          setTimeout(
            () => resolve({ status: 'unhealthy', error: 'Check timed out' }),
            5_000,
          ),
        ),
      ]),
    ),
  );

  const services: Record<string, ServiceCheck> = {};

  checkEntries.forEach(([name], idx) => {
    const result = settledChecks[idx];
    if (!result) {
      console.log('could not find results');
      return;
    }

    services[name] =
      result.status === 'fulfilled'
        ? result.value
        : {
            status: 'unhealthy',
            error: (result.reason as Error)?.message ?? 'Unknown error',
          };
  });

  const overallStatus = deriveOverallStatus(services, heapPercent);

  const payload: HealthCheckResult = {
    status: overallStatus,
    version: process.env.npm_package_version ?? '0.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    system: {
      memoryUsageMB: {
        heapUsed: Math.round(usedHeap / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
        heapLimit: Math.round(heapLimit / 1024 / 1024),
        rss: Math.round(mem.rss / 1024 / 1024),
        external: Math.round(mem.external / 1024 / 1024),
      },
      memoryUsagePercent: Math.round(heapPercent * 100),
      cpuLoadAvg: os.loadavg().map((v) => Math.round(v * 100) / 100),
      platform: `${os.platform()}/${os.arch()}`,
      nodeVersion: process.version,
      pid: process.pid,
    },
    services,
  };

  const httpStatus: Record<HealthStatus, number> = {
    healthy: 200,
    degraded: 200,
    unhealthy: 503,
  };

  const response = new ApiResponse({
    message: `Server is ${overallStatus}`,
    data: payload,
  });

  res.status(httpStatus[overallStatus]).json(response);
});