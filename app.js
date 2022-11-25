var express = require('express');
var mongoose = require('mongoose')
var app = express();
var axios = require('axios').default;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/static', express.static("public"));

app.set("view engine", "ejs");
const Todo = require('./models/todo.model');
const mongoDB = 'mongodb+srv://rajkotak:raj1234@cluster0.x87cxkd.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db=mongoose.connection;

db.on('error', console.error.bind(console, "MongoDb connection error:"))

app.get('/', function(req, res){
    axios.get('https://xkcd.com/info.0.json').then(function(response){
        Todo.find(function(err,todo){
            if(err){
                res.json({"Error:":err})
            }else{
                res.render('todo.ejs', {todoList:todo, comicData: comicData});
            }
        })
    }).catch(function(error){
        res.json({"error:":error})
    })
})
//creates item in db
app.post('/create', (req, res) =>{
    let newTodo = new Todo({
        todo: req.body.content,
        done: false
    })
    newTodo.save(function(err, todo){
        if(err){
            res.json({"Error:":err})
        }else{
            res.redirect('/');
            //res.json({"Status:":"sucessful", "ObjectId":todo.id})
        }
    })
})
//modifies item in db
app.put('/done',(req, res) => {
   let id = req.body.id;
   let err=null
   console.log(id)
   if(typeof id === "string"){
    Todo.updateOne({_id: id}, {done:true},function(error){
        if(error){
            err = error
        }
    })
} else if (typeof id === "object"){
    id.forEach(ID => {
        Todo.updateOne({_id: id}, {done:true},function(error){
            if(error){
                err = error
            }
        })
    })
}
   if(err){
        res.json({"Error:": err}) 
   } else{
        res.redirect('/');
   }
})
app.delete('/delete/:id',(req, res) => {
    let id = req.params.id;
    let err;
    if(typeof id === "string"){
         Todo.deleteOne({_id: id}, function(error){
            if(error){
                err = error
            }
         })
    }else if (typeof id === "object"){
        id.forEach(ID => {
            Todo.deleteOne({_id: id}, function(error){
                if(error){
                    err = error
                }
            })
        })
   }
    if(err){
        res.json({"Error:": err}) 
    }else{
        res.redirect('/');
   }
})

app.listen(3000,function(){
    console.log('app listening on port')
})