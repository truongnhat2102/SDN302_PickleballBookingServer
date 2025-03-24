import { Router } from 'express';
const router = Router();
import { login, register } from '../controllers/authController.js';
import passport from 'passport';

router.post("/login", login);
router.post("/register", register);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/login-success' // bạn có thể redirect về FE hoặc tạo token
    })
);

export default router;