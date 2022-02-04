import express from "express";
import bodyParser from "body-parser";
import Mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dataserv from "./config.js";


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
app.use(express.static('./assets'));
app.listen(8080, () => {
    console.log('Le serveur marche');
})


app.get('/', async (req, res) => {
    res.render('login.twig')
})

app.post('/', async (req, res) => {
    res.redirect('/main')
})

app.get('/main', async (req, res) => {
    res.render('main.twig')
})