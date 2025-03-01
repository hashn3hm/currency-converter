import { Router } from 'express';
import { changePassword, forgotPassword, getProfile, login, resendOTP, resetPassword, signup, verifyOtp } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', (req, res) => {
    console.log('User route hit');
    res.send('Hello from user route');
});


router.post('/register', signup);
router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);


export default router;
