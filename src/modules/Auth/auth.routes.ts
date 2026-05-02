import { Router } from 'express';
import { authController } from './auth.controller';
import { auth } from './auth.middleware';
import { authValidation } from './auth.validation';
import validateRequest from '../../utils/validateRequest';


const router = Router();

// Register user
router.post(
  '/register',
  validateRequest(authValidation.registerValidationSchema),
  authController.register
);

// Login user
router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authController.login
);

// Refresh token
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken
);

// Change password (protected)
router.post(
  '/change-password',
  auth('ADMIN', 'CREATOR', 'CONTESTANT'),
  validateRequest(authValidation.changePasswordValidationSchema),
  authController.changePassword
);

// Logout
router.post('/logout', authController.logout);

export const authRoutes = router;