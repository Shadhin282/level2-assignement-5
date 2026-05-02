import { Request, Response } from 'express';
import { authService } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authService.refreshToken(refreshToken);

  // Set new refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { oldPassword, newPassword } = req.body;

  await authService.changePassword(userId, oldPassword, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully',
    data: {},
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
    data: {},
  });
});

export const authController = {
  register,
  login,
  refreshToken,
  changePassword,
  logout,
};