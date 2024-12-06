const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt")
const path = require("path")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post("/signup",(req,res)=>{
    let users = [];
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        let data = fs.readFileSync(path.join(__dirname, "user.json"),"utf-8")
        if(data.trim().length > 0){
            users = JSON.parse(data);
        }
        users.push(req.body);
        fs.writeFileSync(path.join(__dirname, "user.json"), JSON.stringify(users,null,2),"utf-8")
        res.status(200).json({message:"successfully registered"});
    }
    catch (err){
        res.status(500).json({error:"registration failed"});
    }
})

app.post("/login",(req,res)=>{
    try{
        let data = fs.readFileSync(path.join(__dirname, "user.json"),"utf-8")
        const users = JSON.parse(data);

        let user = users.find((user) => user.email === req.body.email)

        if(user){
            let dcrypt = bcrypt.compareSync(req.body.password,user.password)
            if(dcrypt){
                res.status(200).json({message:"Login Successfull"});
            }
            else{
                res.status(401).json({message:"Invalid Password"});
            }
        }
        else{
            res.status(401).json({message:"Invalid Email"});
        }
    }
    catch(err){
        res.status(500).json({message:"login failed"});
    }
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})


