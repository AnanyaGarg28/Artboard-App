import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getConnectionToDB } from '../db';

export const update = {
    path: '/api/update/:userid',
    method: 'put',
    handler: async (req, res) => {
        const { userid } = req.params;
        const { authorization } = req.headers;
        const { name, age, dob } = req.body;
        
        if(!authorization) return res.status(401).json({ message: 'Authorization header not found!' });

        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded)=>{
            if(err) return res.status(401).json({ message: 'Unable to verify!' });
            const { userIndex:id } = decoded;
            if( id!==userid ) return res.status(403).json({ message: 'Not Authorised to update!' });
            const db = getConnectionToDB('auth-db');
            const { email, userInfo: updatedInfo } = await db.collection('users').findOne({'_id': ObjectId(id)});
            if(name) updatedInfo.name = name;
            if(age) updatedInfo.age = age;
            if(dob) updatedInfo.dob = dob;
            await db.collection('users').updateOne({'_id': ObjectId(id)},{$set:{userInfo:updatedInfo}});
            jwt.sign({
                userIndex:id,
                email,
                userInfo:updatedInfo,
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
        }); 
    }
}