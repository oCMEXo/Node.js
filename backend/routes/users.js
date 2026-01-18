const router=require("express").Router();
const User=require("../models/User");
const {requireAuth,requireRole}=require("../middleware/auth");

router.get("/",requireAuth,requireRole("admin"),async(req,res)=>{
  res.json(await User.findAll({attributes:["id","email","role"]}));
});

router.patch("/:id/role",requireAuth,requireRole("admin"),async(req,res)=>{
  const user=await User.findByPk(req.params.id);
  if(!user) return res.sendStatus(404);
  user.role=req.body.role;
  await user.save();
  res.json(user);
});
module.exports=router;