import express from "express";
import bodyParser from "body-parser";
import Mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dataserv from "./config.js";
import User from "./models/User.js";
import Todos from "./models/Todos.js";

const app = express();
const db = dataserv;

Mongoose.connect(db, err => {
    if (err) {
        console.error('error ' + err);
    } else {
        console.log('MongoDB ok');
    }
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(express.static('./assets'));
app.listen(8080, () => {
    console.log('Le serveur marche');
})

app.get('/', async (req, res) => {
    res.render('login.twig')
})

app.post('/', async (req, res) => {
    if(req.body.name != ''){
        const search = await User.findOne({name: req.body.name});
        if (search != null) {
            res.cookie('user', search._id, { maxAge: oneDay })
            res.redirect('/main')
        } else {
            const user = await new User(req.body);
            await user.save();
            res.render('login.twig', {
                message : "<div class='alert alert-success text-center alertos' role='alert'>Inscription enregistrée !</div>"
            });
        }
    }else {
        res.redirect('/');
    }

})

app.get('/main', async (req, res) => {
    const user = await User.findOne({ _id: req.cookies.user })
    const userTodos = user.todos
    res.render('main.twig',{
        user : user.name,
        todos : userTodos
    })
})

app.post('/main', async (req, res) => {
    const todo = await new Todos(req.body);
    const user = await User.findOneAndUpdate(
        {_id: req.cookies.user},
        { $push : {todos : todo}})
    await user.save();
    res.redirect('/main');
    
})

app.get('/deleteTodo/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id : req.cookies.user })
    const todos = user.todos
    for(const element in todos){
        if(todos[element]._id == id){
            todos.splice(element, 1)
            break;
        };
    }
    await user.save();
    res.redirect('/main');
}) 

app.get('/logout',(req,res) => {
    res.cookie('user', '',  {maxAge: 0});
    res.redirect('/');
});
