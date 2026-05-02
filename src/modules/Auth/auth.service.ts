import { prisma } from '../../lib/prisma';
import { jwtHelpers } from './jwtHelpers';
import config from '../../config';
import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import { TAuthResponse, TLoginUser, TRegisterUser } from './auth.interface';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const registerUser = async (payload: TRegisterUser): Promise<TAuthResponse> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  // Generate tokens
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expire as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expire as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser): Promise<TAuthResponse> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if password is correct
  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  // Generate tokens
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expire as string
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expire as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<TAuthResponse> => {
  // Verify refresh token
  const verified = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as string);

  const { userId, email, role } = verified;

  // Check if user still exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate new tokens
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expire as string
  );

  const newRefreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expire as string
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check old password
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
};