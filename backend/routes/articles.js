const router=require("express").Router();
const Article=require("../models/Article");
const {requireAuth}=require("../middleware/auth");

router.put("/:id",requireAuth,async(req,res)=>{
  const article=await Article.findByPk(req.params.id);
  if(!article) return res.sendStatus(404);
  if(article.createdBy!==req.user.id && req.user.role!=="admin")
    return res.sendStatus(403);
  Object.assign(article,req.body);
  await article.save();
  res.json(article);
});
module.exports=router;