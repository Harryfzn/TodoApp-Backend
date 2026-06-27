import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

const router = express.Router()


// register a new user endpoint 
router.post('/register', async (req, res) => {
    {
        const { username, password } = req.body

        //encrypt the password
        const hashedPassword = bcrypt.hashSync(password, 0)

        // save the new user and pass
        try {
            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword
                }
            })
            // now that we have a user, i want to add their first todo for them
            const defaultTodo = 'hello :) add your first todo'
            await prisma.todo.create({
                data: {
                    task: defaultTodo,
                    userId: user.id
                }
            })
            // create a token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
            res.json({ token })
        } catch (err) {
            console.log(err.message)
            res.sendStatus(501)
        }



    }
})

router.post('/login', async (req, res) => {
    // we get the email and look up the pass email in the database 
    // pass cannot reecnrypted cuz one way encrypted
    // so what we can do?

    const { username, password } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // if user tidak ada return not found
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        // if pass salah return not found
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).send({ message: "invalid password" })
        }
        console.log(user);


        // then we have a succesfull auth
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24H" })
        res.json({ token })
    } catch (error) {
        console.log(err.message)
        res.sendStatus(503)

    }



})

export default router