import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

function signToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });
}

function toPublicUser(user: IUser) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
    };
}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร",
            });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });

        if (existing) {
            return res.status(409).json({
                message: "อีเมลนี้ถูกใช้งานแล้ว",
            });
        }

        const user = await User.create({ name, email, password });
        const token = signToken(user._id.toString());

        res.status(201).json({
            token,
            user: toPublicUser(user),
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "สมัครสมาชิกไม่สำเร็จ",
        });
    }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "กรุณากรอกอีเมลและรหัสผ่าน",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
            });
        }

        const token = signToken(user._id.toString());

        res.status(200).json({
            token,
            user: toPublicUser(user),
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เข้าสู่ระบบไม่สำเร็จ",
        });
    }
};