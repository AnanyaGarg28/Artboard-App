import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnectionToDB } from '../db';

export const signUp = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;
        const db = getConnectionToDB('auth-db');
        const user = await db.collection('users').findOne({ email });
        if (user) {
            return res.sendStatus(409);
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const userInfo={
            name:"",
            age:null,
            dob:""
        }
        const result = await db.collection('users').insertOne({
            email,
            passwordHash,
            userInfo,
        });
        const userIndex = result.insertedId;
        jwt.sign({
            userIndex,
            email,
            userInfo,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        },
        (err, token) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json({ token });
        });
    }
}