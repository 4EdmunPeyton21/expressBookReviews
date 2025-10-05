const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Login for registered users
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({message: "Username and password are required."});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username // Using username in the token payload
    }, 'your_jwt_secret', { expiresIn: '1h' });

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(401).json({message: "Invalid credentials."});
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.session.authorization.username;

  if (!reviewText) {
    return res.status(400).json({message: "Review text cannot be empty."});
  }
  if (books[isbn]) {
      books[isbn].reviews[username] = reviewText;
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  }
  return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).send(`Review for the book with ISBN ${isbn} posted by you has been deleted.`);
    }
    return res.status(404).json({message: "Review not found or you are not authorized to delete it."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;