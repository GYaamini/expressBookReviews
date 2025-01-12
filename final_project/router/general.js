const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const url = "https://gowriyaamini-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).send("Customer successfully registered. Now you can login");
        } else {
            return res.status(404).send("Customer already exists!");
        }
    }
    return res.status(404).send("Unable to register Customer.");
});

// Get the book list available in the shop
// with Promise
public_users.get('/',function (req, res) {
    new Promise((resolve,reject)=>{
        resolve(books) 
    }).then((books)=>{
        res.status(200).send(books);
    }).catch((error)=>{
        res.status(404).send(error.message);
    })
});

// with Async-Await using axios
public_users.get('/async',async (req, res)  => {
    try{
        let response=await axios.get(`${url}/`);
        res.status(200).send(response.data);
    }catch(error){
        res.status(404).send(error.message);
    }
});

// Get book details based on ISBN
// with Promise
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    new Promise((resolve,reject)=>{
        if(Object.keys(books).includes(isbn)){
            resolve(books);
        }else{
            reject("Book do not exist") ;
        }
    }).then((books)=>{
        res.status(200).send(books[isbn]);
    }).catch((error)=>{
        res.status(404).json({message:"Book do not exist in our database",error:error.message});
    })
});

// with Async-Await using axios
public_users.get('/async/isbn/:isbn',async (req, res) => {
    const isbn=req.params.isbn;
    try{
        const response=await axios.get(`${url}/isbn/${isbn}`);
        if(Object.keys(books).includes(isbn)){
            res.status(200).send(response.data);
        }else{
            res.status(404).send("Book do not exist in our database");
        }
    }catch(error){
        res.status(404).json({message:"Book do not exist in our database",error:error.message});
    }
});
  
// Get book details based on author
// with Promise
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;
    new Promise((resolve,reject)=>{
        const requestedDetails=Object.values(books).filter((book)=>book.author.includes(author));
        if(requestedDetails.length>0){
            resolve(requestedDetails); 
        }else{
            reject(`Books by the author ${author} do not exist in our database`);
        }
    }).then((requestedDetails)=>{
        res.status(200).send(requestedDetails);
    }).catch((error)=>{
        return res.status(404).send({message:`Books by the author ${author} do not exist in our database`,error:error.message});
    })
});

// with Async-Await using axios
public_users.get('/async/author/:author',async (req, res) => {
    const author=req.params.author;
    try{
        const requestedDetails=Object.values(books).filter((book)=>book.author.includes(author));
        const response=await axios.get(`${url}/author/${author}`);
        if(requestedDetails.length>0){
            res.status(200).send(response.data);
        }else{
            throw new Error(`Books by the author ${author} do not exist in our database`)
        }
    }catch(error){
        res.status(404).json({error:error.message});
    }
});

// Get all books based on title
// with Promise
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    new Promise((resolve,reject)=>{
        const requestedDetails=Object.values(books).filter((book)=>book.title.includes(title));
        if(requestedDetails.length>0){
            resolve(requestedDetails); 
        }else{
            reject(`Books by the title ${title} do not exist in our database`);
        }
    }).then((requestedDetails)=>{
        res.status(200).send(requestedDetails);
    }).catch((error)=>{
        return res.status(404).send({message:`Books by the title ${title} do not exist in our database`,error:error.message});
    })
});

// with Async-Await using axios
public_users.get('/async/title/:title',async (req, res) => {
    const title=req.params.title;
    try{
        const requestedDetails=Object.values(books).filter((book)=>book.title.includes(title));
        const response=await axios.get(`${url}/title/${title}`);
        if(requestedDetails.length>0){
            res.status(200).send(response.data);
        }else{
            throw new Error(`Books by the title ${title} do not exist in our database`)
        }
    }catch(error){
        res.status(404).json({error:error.message});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    const book=books[isbn];
    if(book){
        return res.status(200).send(book.reviews);
    }else{
        return res.status(404).send(`Book with ISBN : ${isbn} do not exist in our database`);
    }
});

module.exports.general = public_users;
