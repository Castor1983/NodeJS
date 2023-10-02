import express, {Request, Response} from 'express';
import * as mongoose from 'mongoose';
import {configs} from './configs/config'

import {User} from './models/User.model';
import {IUser} from './types/user.type'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 5001;
app.listen(PORT, async () => {
    await mongoose.connect(configs.DB_URI);
    console.log(`Server has successfully started on PORT ${PORT}`);
})
app.get('/users', async (req: Request, res: Response): Promise<Response<IUser[]>> => {
    const users = await User.find();

    return res.json(users);
})
app.get('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id)
        return res.json(user);
    } catch (e) {
        res.status(404).json(e.message);
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).json("user deleted");
    } catch (e) {
        res.status(404).json(e.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const createUser = await User.create({...req.body});
        res.status(201).json(createUser);
    } catch (e) {
        res.status(400).json(e.message)
    }

})
app.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        await res.status(201).json(user);
        ;
    } catch (e) {
        res.status(404).json(e.message)
    }
});