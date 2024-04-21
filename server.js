const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv'); //to secure my senstitive credentials and limit hardcoding
const URL = 'mongodb://localhost:27017/BlogApp';
const userRouter = require('./Routes/userroute');
const bodyparser = require('body-parser');
const axios = require('axios');

const app = express();

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8000

mongoose.connect(URL,{useNewUrlParser: true}); //Function to connect to a database
const con = mongoose.connection;

con.on('open',()=>{
    console.log('Connection to the database successful!')
})


app.use(morgan('tiny'));
app.use(express.json()) //we are telling the application that we want to make use of the json format
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname + '/Views'));
app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.render('login',{title:"Login"})
})

app.get('/signup',(req,res)=>{
    res.render('signup',{title:"Login"})
})

app.get('/viewblog',(req,res)=>{
    res.render('viewblog',{title:"ViewBlog"})
})

app.get('/newblog',(req,res)=>{
    res.render('newblog',{title:"NewBlog"})
})

app.get('/editblog',(req,res)=>{
    axios.get('http://localhost:4000/api/blogs',{params: {id: req.query.id}})
    .then(function(blogdata){
        res.render('editblog',{blog: blogdata.data})
    })
    .catch(err  =>{
        res.send(err);
    })
})

app.get('/readblog',(req,res)=>{
     //Make get request to blog api
     axios.get('http://localhost:4000/api/blogs')
     .then(function(response){
        res.render('blogreadonly', { blog: response.data });
     })  
     .catch(err  =>{
         res.send(err);
     })
   
})


app.get('/allblog',(req,res)=>{
    //Make get request to blog api
    axios.get('http://localhost:4000/api/blogs')
    .then(function(response){
       res.render('home', { blog: response.data });
    })  
    .catch(err  =>{
        res.send(err);
    })
})


console.log(path.resolve(__dirname + '/Views'))

//------------->> connect to my router
app.use('/',userRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})



