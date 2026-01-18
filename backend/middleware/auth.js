const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.requireAuth = async (req,res,next)=>{
  try{
    const token=req.headers.authorization?.split(" ")[1];
    const payload=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findByPk(payload.sub);
    if(!req.user) return res.sendStatus(401);
    next();
  }catch{res.sendStatus(401)}
};

exports.requireRole = role => (req,res,next)=>{
  if(req.user.role!==role) return res.sendStatus(403);
  next();
};