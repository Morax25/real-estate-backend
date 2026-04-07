import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { User } from '../models/user.model.js';
import { DomainError } from '../utils/domainError.js';

//Gerenate access and refresh tokens
export const generateAccessAndRefreshTokens = async (user: {
  _id: string;
  role: string;
}) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
    }
  );
  const refreshToken = crypto.randomBytes(64).toString('hex');
  await User.findByIdAndUpdate(user._id, {
    refreshToken: hashToken(refreshToken),
  });
  return { accessToken, refreshToken };
};

//Hash token before storing in DB
const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const refreshTokens = async (refreshToken: string) => {
  const hashedToken = hashToken(refreshToken);
  const user = await User.findOne({ refreshToken: hashedToken });
  if (!user) throw new DomainError('UNAUTHORIZED', 'Invalid refresh token');
  return await generateAccessAndRefreshTokens({
    _id: user._id.toString(),
    role: user.role,
  });
};
