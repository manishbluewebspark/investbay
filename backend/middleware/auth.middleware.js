import jwt from 'jsonwebtoken';
import { pool } from "../db.js";

export const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 Auth Middleware Started');
        
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ No Bearer token');
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided or invalid format' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        console.log('✅ Token received');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token is missing' 
            });
        }
        
        // 🔥 FIX: Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded:', decoded);
        
        // 🔥 IMPORTANT: Token me field check karo - 'userId' hai, 'id' nahi
        const userId = decoded.userId || decoded.id;
        
        if (!userId) {
            console.log('❌ No user ID in token');
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token structure' 
            });
        }
        
        console.log('🔍 Looking for user with ID:', userId);
        
        // Database se user find karo
        const userResult = await pool.query(
            'SELECT id, email, name, role FROM users WHERE id = $1', 
            [userId]
        );
        
        if (userResult.rows.length === 0) {
            console.log('❌ User not found in database');
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // ✅ Set req.user
        req.user = userResult.rows[0];
        console.log('✅ User authenticated:', req.user);
        
        next();
        
    } catch (error) {
        console.error('❌ Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Authentication failed' 
        });
    }
};