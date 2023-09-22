const express = require('express');
const fsServices = require('./fs.services');
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5001;
app.listen(PORT, ()=>{
    console.log(`Server has successfully started on PORT ${PORT}`);
})

app.get('/users', async (req, res)=>{
    const users = await fsServices.reader();
    res.json({
        data: users,
    });
})
app.get('/users/:id', async (req, res)=>  {
    try {
        const {id} = req.params;
        const users = await fsServices.reader();
        const user = users.find((user) => user.id === Number(id));
        if (!user) {
            throw new Error('User not found');
        }
        res.json(user);
    } catch (e) {
        res.status(404).json(e.message);
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const users = await fsServices.reader();
        const index = users.findIndex((user) => user.id === Number(id));
        if (index === -1) {
            throw new Error('User not found');
        }
        users.splice(index, 1);

        await fsServices.writer(users);

        res.sendStatus(204);
    } catch (e) {
        res.status(404).json(e.message);
    }
});


;
app.post('/users', async (req, res)=>{
    try{
        const {name, age, email} = req.body;
        if (!name || name.length < 2) {
            throw new Error('Wrong name');
        }
        if (!email || !email.includes('@')) {
            throw new Error('Wrong email');
        }
        const users =  await fsServices.reader();
        const lastId = users[users.length - 1].id;
        const newUser = {id: lastId +1, name, age, email}
        users.push(newUser);
        await fsServices.writer(users);
        res.status(201).json(newUser);
    }catch (e){
        res.status(400).json(e.message)
    }

})
app.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name, age, email} = req.body;
        if (!name || name.length < 2) {
            throw new Error('Wrong name');
        }
        if (!email || !email.includes('@')) {
            throw new Error('Wrong email');
        }
        if (!age || age<=0 || age > 110) {
            throw new Error('Wrong age');
        }
        const users = await fsServices.reader()
        const user = users.find((user) => user.id === Number(id));
        if (!user){
            throw new Error('User not found')
        }
        user.email = email;
        user.name = name;
        user.age = age;
        await fsServices.writer(users);
        res.status(201).json(user);
    } catch (e) {
        res.status(404).json(e.message)
    }
});
