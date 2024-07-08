const express = require('express');
const authRouter = express.Router(); //--> use only in this file 
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
//Sign Up
authRouter.post("/api/signup", async (req , res)=>
 {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }
    const hashedPassword = await  bcryptjs.hash(password , 8);

       let user = new User({
      email,
      password :hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//sign in
authRouter.post("/api/signin", async(req, res)=>{
  try{
    const { 
      email,
      password,
    }=req.body;
    const user = await User.findOne({email});
    // verify if the user exist(email)
    if(!user){
      return res.status(400).json({msg: "User with this email does not exist !"});
    }


    // verify if the password is correct
    const isMatch = bcryptjs.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({msg: "Incorrect password "});
    }
   const token = jwt.sign({id : user._id},"passwordKey");
   res.json({token , ...user._doc});

  }catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//mouch private wallet
module.exports = authRouter;
