import { Request, Response } from 'express';
import User from '../models/User';

interface UpdateProfileBody {
    name: string;
}

interface ChangePasswordBody {
    currentPassword: string;
    newPassword: string;
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'ไม่พบผู้ใช้งาน',
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ',
        });
    }
};

export const updateProfile = async (req: Request<{}, {}, UpdateProfileBody>, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: 'กรุณากรอกชื่อ',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name: name.trim() },
            { new: true },
        );

        if (!user) {
            return res.status(404).json({
                message: 'ไม่พบผู้ใช้งาน',
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'แก้ไขชื่อไม่สำเร็จ',
        });
    }
};

export const changePassword = async (req: Request<{}, {}, ChangePasswordBody>, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'กรุณากรอกรหัสผ่านให้ครบ',
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'รหัสผ่านใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร',
            });
        }

        const user = await User.findById(req.userId).select('+password');

        if (!user) {
            return res.status(404).json({
                message: 'ไม่พบผู้ใช้งาน',
            });
        }

        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                message: 'รหัสผ่านเดิมไม่ถูกต้อง',
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            message: 'เปลี่ยนรหัสผ่านสำเร็จ',
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
        });
    }
};
