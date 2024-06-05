import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import handleError from '../error.js';
import { neo4jDriver } from '../db.js';

// Signup function
const signup = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ error: 'Missing information' });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(400).json({ error: 'User already exists, please login.' });
    }

    const saltRounds = 10; // Salt rounds for bcrypt
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
        const newUser = new User({ firstname, lastname, username, email, password: passwordHash });
        const savedUser = await newUser.save();

        const session = neo4jDriver.session();
        try {
            await session.run(
                'CREATE (u:User {id: $id, firstname: $firstname, lastname: $lastname, username: $username, email: $email})',
                { id: savedUser._id.toString(), firstname, lastname, username, email }
            );
        } finally {
            await session.close();
        }

        const token = jwt.sign(
            { id: savedUser._id, username: savedUser.username },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        );

        const { password, ...info } = savedUser._doc;

        return res
            .cookie('token', token, { httpOnly: true })
            .status(200)
            .json({ ...info, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to save user.' });
    }
};

// Login function
const login = async (req, res, next) => {
    const { email, userPassword } = req.body;

    if (!email || !userPassword) {
        return res.status(400).json({ error: 'Missing information' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found!' });
        }

        const match = await bcrypt.compare(userPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Wrong credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        );

        const { password, ...info } = user._doc;

        return res.cookie('token', token, { httpOnly: true })
            .status(200)
            .json({ ...info, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to login.' });
    }
};

export { signup, login };
