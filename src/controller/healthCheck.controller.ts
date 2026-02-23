import os from 'os';
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
const DEGRADED_HEAP_THRESHOLD = 0.85;
function deriveOverallStatus(
  checks: Record<string, ServiceCheck>,
  heapPercent: number,
): HealthStatus {
  if (Object.values(checks).some((c) => c.status === 'unhealthy')) return 'unhealthy';
  if (
    Object.values(checks).some((c) => c.status === 'degraded') ||
    heapPercent >= DEGRADED_HEAP_THRESHOLD
  )
    return 'degraded';
  return 'healthy';
}

export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const mem = process.memoryUsage();
  const totalHeap = mem.heapTotal;
  const usedHeap = mem.heapUsed;
  const heapPercent = totalHeap > 0 ? usedHeap / totalHeap : 0;
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
    if(!result) return console.log("could not find results")
    services[name] =
      result.status === 'fulfilled'
        ? result.value
        : { status: 'unhealthy', error: (result.reason as Error)?.message ?? 'Unknown error' };
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
        heapTotal: Math.round(totalHeap / 1024 / 1024),
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
    statusCode: httpStatus[overallStatus],
    message: `Server is ${overallStatus}`,
    data: payload,
  });

  res.status(response.statusCode).json(response);
});