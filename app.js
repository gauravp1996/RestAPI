const express=require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);
////////////////////////////////////////////////////////REQUEEEST TARGET ALL ARTICLE
app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
        if(err){
            res.send(err);
        }else{
          res.send(foundArticles);
        }
      
    });
  })

  .post((req,res)=>{
   const newArticle= new Article({
  title:req.body.title,
  content:req.body.content
    });
  newArticle.save((err)=>{
      if(err){
          console.log(err);
      }else{
          console.log("Success Bitch");
          console.log(newArticle);
      }
  });
 })

 .delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Success");
        }
    });
    });
  
//////////////////////////// REQUEST TARGETTING ALL ARTICLES

app.route("/articles/:articleTitle")
.get((req,res)=>{
Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
if(!err){
    res.send(foundArticle)
}else{
    res.send("NO ARTICLES FOUND");
}
})
})
.put((req,res)=>{
Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    (err)=>{
        if(!err){
            res.send("Succesfull updated articles");
        }
    }
    );
})
.patch((req,res)=>{
Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},(err)=>{
        if(!err){
            res.send("Successsssss");        
    }else{
        res.send(err);
    }

    }
);
})
.delete((req,res)=>{
Article.deleteOne(
    {title:req.params.articleTitle,
},(err)=>{
    if(err){
        res.send(err);
    }else{
res.send("Succesfully Deleted One");
    }
}

)
});





app.listen(3000,()=>{
console.log("SERVER RUNNING");
});
