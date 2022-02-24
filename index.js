// const express =require("express")
const express = require('express'); 
const mongoose = require("mongoose");
const { usersSchema } = require("./models/user.schema");
const bodyParser = require("body-parser")
const port = 2500;
const app = express();
const bcrypt = require('bcrypt')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('index.html'))
app.listen(port,()=>{
    console.log("running...");
})
// dbconnection
// const URL= "mongodb+srv://Brainiacs_user:jPxVoB5sOM4UdVq1@cluster0.wmwkp.mongodb.net/test"
// const URL="mongodb+srv://Brainiacs_user:jPxVoB5sOM4UdVq1@cluster0.wmwkp.mongodb.net/test"
// const URL = "mongodb+srv://mireille:yfunk9awEC8VV4V@cluster0.glct8.mongodb.net/users?retryWrites=true&w=majority"
const URL = "mongodb+srv://Alice:mireill2006@cluster0.glct8.mongodb.net/form"
const dbconnection=()=>{
    mongoose.connect(URL,()=>{

    
    console.log("dbrunning.....");
})

}
dbconnection();
 
const user = new (usersSchema)

app.get('/', (Req,res)=>{
    res.sendFile(__dirname + "/login.html");
})
  
//  app.get("/users",(req,res)=>{
//      return res.send("welcome to databases")
//  })

  app.post("/user",async(req,res)=>{
      try{
        //   console.log(req,body);
    const hashedpassword= await bcrypt.hash(req.body.password,10)
    const user=new usersSchema({
    fname:req.body.firstname,
    lname:req.body.lastname,
    password:hashedpassword,
    email:req.body.Email,
})
   await user.save();
   if (!user) {
    return res.status(400).send("Account not created")
}
return res.status(201).send("Account created") 
      }catch (error){
        console.log(error);
    }
})
      //getting all users
app.get("/user",async(req,res)=>{
    const users=await usersSchema.find();
    if (users.length==0) {
        return res.send("no users found");
    }
    return res.status(200).json({
        count:users.length,
        data:users
    })
})
// get users by id
app.get("/user/:id",async(req,res)=>{
    console.log(req.params.id);
    const users=await usersSchema.findById(req.params.id)
    return res.status(200).json({
        data:users
    })
})
// updating user 
app.put("/user/:id",async(req,res)=>{
    console.log(req.params.id);
    const user=await usersSchema.findByIdAndUpdate(req.params.id,{
        fname:req.body.fname
    })
    await user.save();
    if (!user) {
        return res.status(400).send("Unable to update user")
    }
    return res.status(200).send("User updated")
})
// delete user

app.delete("/user/:id",async(req,res)=>{
    try{
    console.log(req.params.id);
    const user=await usersSchema.findByIdAndDelete(req.params.id)
    return res.status(200).send("User deleted")
}
catch(error){
    console.log(error);
}
});

