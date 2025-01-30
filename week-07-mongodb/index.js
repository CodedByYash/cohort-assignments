const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config()
const { UserModel, TodoModel } = require("./db");
const {middleware} = require("./auth");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(express.json());


const saltRounds = 5;


app.post("/signup",async function(req,res){
    const { email, password, name } = req.body;

    try{
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    await UserModel.create({
        email,password:hash,name
    })
    res.json({"message":"user created successfully"});
    }
    catch(e){
        console.log(e);
        res.status(500).json({"message":"error while creating user"})
    }

})

app.post("/signin",async function(req,res){
    const { email, password } = req.body;

    try{
    const user = await UserModel.findOne({email});

    if (!user) {
        return res.status(403).json({ "message": "user not found" });
    }

    if(bcrypt.compareSync(password,user.password)){
        const token = jwt.sign({email,userId:user._id},process.env.JWT_SECRET);
        return  res.json({"token":token});
    }}
    catch(e){
        console.log(e);
        return res.status(403).json({"message":"error occured during signin"});
    }
    res.status(403).json({"message": "something went wrong"});
})

app.post("/todo",middleware,async function(req,res){
    const { title, isDone } = req.body;
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ "message": "unauthorized" });
    }

    try{
    await TodoModel.create({
        title,isDone,userId
    })
    res.json({
        "message":"todo created successfully"
    })}
    catch(e){
        console.log(e);
        res.status(500).json({"message":"error occured during creating todo"})
    }
})

app.get("/todos", middleware, async function(req,res){
    try {
        const todos = await TodoModel.find({ userId:req.userId });
        res.json({todos });
    } catch (e) {
        console.error(e);
        res.status(500).json({ "message": "error occurred while fetching todos" });
    }
})

app.listen(3000);