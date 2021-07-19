const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


var mongoDB = 'mongodb://localhost:27017/wikiDB';
mongoose.connect(mongoDB, { useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false });

var Schema = mongoose.Schema;
var articleSchema = new Schema({
        title: String,
         content : String
});
// Compile model from schema
var Article = mongoose.model('Article', articleSchema );

/////////////request to all articles//////////
app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            }else{
                res.send(err);
            }
        });
    })
    .post(function(req, res){
        console.log(req.body.title);
        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added an article");
            }else{
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully deleted all articles");
            }else{
                res.send(err);
            }
        });
    });

/////////////request to a specific article//////////
app.route("/articles/:title")
    .get(function(req, res){
        Article.findOne({title : req.params.title}, function(err, article){
            if(!err){
                res.send(article);
            }else{
                res.send(err);
            }
        })
    })
    .put(function(req, res){
        Article.updateOne(
            {title : req.params.title},
            {title : req.body.title, content : req.body.content},
         
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                }else{
                    res.send(err);
                }
            }
        );
    })
    .patch(function(req, res){
        Article.updateOne(
            {title : req.params.title},
            {$set : req.body},
            function(err){
                if(!err){
                    res.send("Successfully edited article")
                }else{
                    res.send(err);
                }
            }
        );
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title : req.params.title},
            function(err){
                if(!err){
                    res.send("Article deleted");
                }else{
                    res.send(err);
                }
            }
        );
    });

app.listen('3000',function(){
    console.log("Server is running on port 3000");
});