import { Router } from 'express';
import { authRoutes } from '../modules/Auth/auth.routes';




const router = Router();

type TModuleRoute = {
    path: string;
    route: Router;
};

const moduleRoutes: TModuleRoute[] = [
    {
        path: '/auth',
        route: authRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
