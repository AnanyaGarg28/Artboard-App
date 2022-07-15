import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnectionToDB } from '../db';

export const signIn = {
    path: '/api/signin',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;
        const db = getConnectionToDB('auth-db');
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.sendStatus(401);
        }
        const { _id: userIndex, passwordHash, userInfo } = user;
        const isCorrect = await bcrypt.compare(password, passwordHash);
        if(isCorrect){
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
        else res.sendStatus(401);
    }
}
