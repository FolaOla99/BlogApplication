const UserDB = require('../Models/users');
const Blog = require('../Models/blog');
const bcrypt = require('bcrypt');
const axios = require('axios');
const express = require('express');
const app = express();




//...................................NEW USERS (SIGN UP)

//Create and save new user
exports.create = async (req,res)=>{
    //Validate the data
    if (!req.body) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }

    const user = new UserDB(
    {
        first_name: req.body.fname,
        last_name: req.body.lname,
        email: req.body.email,
        password: req.body.password 
    })

    //check if user already exists
    const existingUser = await UserDB.findOne({email: user.email})

    if(existingUser){
        res.send("This e-mail address already exists.")
    }else {
         // Save the data in the db
        try {
           
            const newUser = await user.save();
            //res.send(newUser);
            res.send("Welcome " + `${newUser.first_name + ' ' + newUser.last_name}`);
    
        } catch(err){
            res.status(500).send({
                message: err.message || "Some error occured while inserting the data"
            });
        }
    }

   
}


// //retrieve and return all users/ retrieve and return a single user

// exports.find = async(req,res)=>{
//     const allUsers = await UserDB.find(); // find the records in user
//     res.json(allUsers)
// }

// //update a user by userid
// exports.update = (req,res)=>{
    
// }

// //delete a user by userid
// exports.delete = (req,res)=>{
    
// }

//...................................LOGIN USERS (SIGN IN)

exports.login = async (req,res) => {
    try {
        const check = await UserDB.findOne({ email: req.body.email });

        if (!check) {
            res.status(404).send("e-mail address not found");
            return;
        }

        if (req.body.password === check.password) {
            axios.get('http://localhost:4000/api/blogs')
            .then(function(response){
                res.render('home', { blog: response.data });
            })  
            .catch(err  =>{
                res.send(err);
            })
        } else {
            res.status(401).send("Incorrect password");
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while logging in"
        });
    }
}





//......................................BLOG

//Create and save new blog
exports.createBlog = async (req,res)=>{
    //Validate the data
    if (!req.body) {
        res.status(400).send({message: "Content cannot be empty"});
        return;
    }

    const blogN = new Blog(
    {
        title: req.body.title,
        description: req.body.Description,
        author: req.body.author,
        body: req.body.body,
        read_count: 0
    })

    // Save the data in the db
    try {
       const newBlog = await blogN.save();
       axios.get('http://localhost:4000/api/blogs')
       .then(function(response){
           res.render('home', { blog: response.data });
       })  
       .catch(err  =>{
           res.send(err);
       })

    } catch(err){
        res.status(500).send({
            message: err.message || "Some error occured while inserting the data"
        });
    }
}

//retrieve and return all blogs/ retrieve and return a single blog

exports.findblog = async(req,res)=>{

    if (req.query.id){
        const id = req.query.id;
        Blog.findById(id)
        .then(data =>{
            if(!data){
                res.status(404).send({message: `Blog with ID: ${id} not found.`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({message: "Could not find record! "})
        })
    }else{
        const allBlogs = await Blog.find(); // find the records in blog
        res.json(allBlogs)
    }
   
}

//update blog
exports.updateBlog = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data cannot be empty" });
    }

    // const id = req.params.id;
    const id = req.query.id;
    
    // Extract fields that may be updated from the request body
    const updatedFields = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        body: req.body.body
    };

    // Update the record in the database with the updated values
    Blog.findByIdAndUpdate(id, updatedFields, { new: true, useFindAndModify: false })
        .then(updatedBlog => {
            if (!updatedBlog) {
                return res.status(404).send({ message: `Cannot update blog with ID: ${id}. Blog not found.` });
            }
            res.send(updatedBlog);
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating blog information: " + err.message });
        });
}

// exports.updateBlog = (req,res)=>{
//     if (!req.body){
//         return res
//             .status(400)
//             .send({message: "Data cannot be empty"})
//     }

//     const id = req.params.id;
//     Blog.findByIdAndUpdate(id,req.body, {useFindAndModify:true})
//     .then(data =>{
//         if(!data){
//             res.status(404).send({message: `Cannot update user with ID: ${id}.`})
//         }else{
//             res.send(data)
//         }
//     })
//     .catch(err =>{
//         res.status(500).send({message: "Error updating blog information! "})
//     })
// }

//delete a blog

exports.delete = (req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(data =>{
        if(!data){
            res.status(404).send({message: `Cannot delete blog with ID: ${id}.`})
        }else{
            res.send('Blog deleted successfully.')
        }
    })
    .catch(err =>{
        res.status(500).send({message: "Error deleting blog record! "})
    })
}

module.exports = exports;