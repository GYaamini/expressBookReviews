const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validUsername = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (validUsername.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).send("Error logging in");
    }
    if (authenticatedUser(username, password)) {
        let access_Token = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 * 60});
        // Store access token and username in session
        req.session.authorization = {access_Token, username}
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(206).send("Incorrect Username or Password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username=req.session.authorization.username;
    const isbn=req.params.isbn;
    const review=req.query.review
    if (books[isbn]) {
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        if (books[isbn].reviews[username]) {
            books[isbn].reviews[username] = review;
            return res.status(200).send("Review updated successfully");
        } else {
            books[isbn].reviews[username] = review;
            return res.status(200).send("Review added successfully");
        }
    } else {
        return res.status(404).send("No book found in our database");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username=req.session.authorization.username;
    const isbn=req.params.isbn;
    if (books[isbn]) {
        if (!books[isbn].reviews) {
            return res.status(404).send("No Reviews");
        }
        if (!books[isbn].reviews[username]) {
            return res.status(404).send(`No review by the user $(username)`);
        } else {
            delete books[isbn].reviews[username];
            return res.status(200).send("Review deleted successfully");
        }
    } else {
        return res.status(404).send("No book found in our database");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
