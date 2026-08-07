import { Router } from 'express'
import { requireAuth } from '../middleware/auth';
import { getProfile, updateProfile, changePassword } from '../controllers/Profilecontroller'

const router = Router()

router.use(requireAuth);

router.get('/', getProfile)
router.patch('/', updateProfile)
router.post('/change-password', changePassword)

export default router