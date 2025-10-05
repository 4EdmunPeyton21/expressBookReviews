const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login."});
    } else {
      return res.status(409).json({message: "Username already exists!"});    
    }
  } 
  return res.status(400).json({message: "Unable to register user. Please provide both username and password."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const booksByAuthor = [];
  for (const bookId in books) {
    if (books[bookId].author === authorName) {
      booksByAuthor.push(books[bookId]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title;
  const booksByTitle = [];
  for (const bookId in books) {
    if (books[bookId].title === bookTitle) {
      booksByTitle.push(books[bookId]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});


// ================================================================= //
// ASYNCHRONOUS ROUTES FOR TASKS 10-13
// ================================================================= //

const API_BASE_URL = "http://localhost:5000";

// Task 10: Get the list of books using async-await with Axios
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching book list"});
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/async-isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`${API_BASE_URL}/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(error.response ? error.response.status : 500).json({message: "Error fetching book details"});
    });
});

// Task 12: Get book details based on Author using async-await with Axios
public_users.get('/async-author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${API_BASE_URL}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json({message: "Error fetching books by author"});
  }
});

// Task 13: Get book details based on Title using async-await with Axios
public_users.get('/async-title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${API_BASE_URL}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json({message: "Error fetching books by title"});
  }
});


module.exports.general = public_users;