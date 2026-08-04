import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ message: 'session หมดอายุ กรุณาเข้าสู่ระบบใหม่' })
  }
}