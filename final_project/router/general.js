const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).send("User successfully registered. Now you can login");
        } else {
            return res.status(404).send("User already exists!");
        }
    }
    return res.status(404).send("Unable to register user.");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    if(Object.keys(books).includes(isbn)){
        return res.status(200).send(books[isbn]);
    }else{
        return res.status(404).send("Book do not exist in our database");
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;
    const requestedDetails=Object.values(books).filter((book)=>book.author.includes(author));
    if(requestedDetails.length>0){
        return res.status(200).send(requestedDetails);
    }else{
        return res.status(404).send(`Books by the author ${author} do not exist in our database`);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    const requestedDetails=Object.values(books).filter((book)=>book.title.includes(title));
    if(requestedDetails.length>0){
        return res.status(200).send(requestedDetails);
    }else{
        return res.status(404).send(`Books by the title ${title} do not exist in our database`);
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
