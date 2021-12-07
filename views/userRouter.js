const express =require("express");
const router =express.Router();
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema=require("../model/userModeal");
const { body, validationResult } = require('express-validator');

router.post("/register" , 
body('email').isEmail(), (req,res) =>{
    const {password,confirmPassword,name,email,isAdmin}=req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }else if(password!==confirmPassword){
        return res.status(406).json({ errors: "password Not Matched"});
    }

    var hashedPassword = bcrypt.hashSync(password, 10);
    const user = new userSchema({ name, email, isAdmin, password: hashedPassword });
    user.save(  (err,user) => {
        if(err){
            res.json(err)
        }else{
            res.status(201).json({message:"user Register sucessfuly"})
        }
    }  )
}  )


router.post("/login",async(req,res)=>{
    const{password,email}=req.body;
    if(!email||!password){
        if(!email){
            res.send("email required")
        }
        else if(!password){
            res.send("password required")
        }
    }
    const user =  await userSchema.findOne( { email : email  } )
   if(user == null ){
      return res.status(404).json({ error : "no user is registered with this email " })
   }
   const result = bcrypt.compareSync(password  , user.password )
   if(result == true){
       const token =  jwt.sign( { email : user.email , isAdmin : user.isAdmin } , "shhh"  );
        res.json(token);
   }else{
    return res.status(417).send("incorrect password")
   }
});


router.get("/users",(req,res)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.send("login required")
    }
    try{
   const decoded =  jwt.verify(token,"shhh");
   if(decoded.isAdmin == false){
      return res.send("you are not an admin")
   }else{
      userSchema.find( {} , (err,users) => {
          if(err){
              res.json(err)
          }else{
              res.json(users)
          }
      } )
   }
   
    }catch(err){
        res.send("invalid token")
    }
})



module.exports = router

