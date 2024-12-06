const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post("/signup",(req,res)=>{
    let users = [];
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        let data = fs.readFileSync("day14/user.json","utf-8")
        if(data.trim().length > 0){
            users = JSON.parse(data);
        }
        users.push(req.body);
        fs.writeFileSync("day14/user.json",JSON.stringify(users,null,2),"utf-8")
        res.status(200).json({message:"successfully registered"});
    }
    catch (err){
        res.json({error:"registration failed"}).status(500);
    }
})

app.post("/login",(req,res)=>{
    try{
        let data = fs.readFileSync("day14/user.json","utf-8")
        const users = JSON.parse(data);

        let user = users.find((user) => user.email === req.body.email)

        if(user){
            let dcrypt = bcrypt.compareSync(req.body.password,user.password)
            if(dcrypt){
                res.status(200).json({message:"Login Successfull"});
            }
            else{
                res.json({message:"Invalid Password"}).status(401);
            }
        }
        else{
            res.json({message:"Invalid Email"}).status(401);
        }
    }
    catch(err){
        res.json({message:"login failed"}).status(500);
    }
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})


