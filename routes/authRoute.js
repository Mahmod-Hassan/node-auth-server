const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const router = express.Router();
const userSchema = require('../schemas/userSchema');
const verifyToken = require('../middlewares/verifyToken');
const User = new mongoose.model("User", userSchema);


router.post('/signup', async (req, res, next) => {
    const {userName, email, password} = req.body;
    try {
        const oldUser = await User.findOne({email})
        if(oldUser){
            console.log('old user')
            return next('user already exist please login')
        }
        const hashPassword = await bcrypt.hash(password, 10);
        // console.log(typeof(hashPassword));
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        })
        const data = await newUser.save();
        // console.log(data);
        // token generate
        const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.send({accessToken:token, data});
    }
    catch (err) {
        // console.log(err);
        res.status(401).send({message: 'authentication failed'})
    }
})


router.post('/login', async (req, res, next) => {
    const {email, password} = req.body;
   try {
    const user = await User.findOne({email});
    // if user exist then run this code
    if(user) {
       const isValidPassword = await bcrypt.compare(password, user.password);
       if(isValidPassword){
         // token generate
         const token = jwt.sign({email}, process.env.JWT_SECRET);
         return res.send({ accessToken: token });
       }else{
           return next('password is not valid')
       }
    }
    else {
        return next('user not found please sing up')
    }
   
   } catch (err) {
      console.log(err)
      res.status(403).send({ error : 'authentication failed'})
   }
})

router.post('/getUser', verifyToken, async (req,res) => {
    try {
       const {email} = req.decoded;
       const user = await User.findOne({email});
       res.send(user);
    } catch (err) {
       next(err)
       res.send({message: 'user not logged yet'})
    }
})

module.exports = router;