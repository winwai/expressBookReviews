const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(200).json({message: "Book list returned."});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(200).json({message: "book returned."});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const requestedAuthor = req.params.author;
    const matchingBooks = [];

    // Hint 1: Obtain all the keys for the ‘books’ object.
    const bookKeys = Object.keys(books);

    // Hint 2: Iterate through the ‘books’ array & check the author matches
    // the one provided in the request parameters.
    for (let i = 0; i < bookKeys.length; i++) {
        const bookKey = bookKeys[i];
        const book = books[bookKey];

        // Case-insensitive comparison for author names
        if (book.author.toLowerCase() === requestedAuthor.toLowerCase()) {
            matchingBooks.push(book);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json({ booksbyauthor: matchingBooks });
    } else {
        return res.status(404).json({ message: "No books found for this author." });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const requestedTitle = req.params.title;
    const matchingBooks = [];

    // Hint 1: Obtain all the keys for the ‘books’ object.
    const bookKeys = Object.keys(books);

    // Hint 2: Iterate through the ‘books’ array & check the title matches
    // the one provided in the request parameters.
    for (let i = 0; i < bookKeys.length; i++) {
        const bookKey = bookKeys[i];
        const book = books[bookKey];

        // Case-insensitive comparison for author names
        if (book.title.toLowerCase() === requestedTitle.toLowerCase()) {
            matchingBooks.push(book);
        }
    }

    if (matchingBooks.length > 0) {
        return res.status(200).json({ booksbytitle: matchingBooks });
    } else {
        return res.status(404).json({ message: "No books found for this title." });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookReview = books[isbn].reviews
    if (Object.keys(bookReview).length > 0) {
        return res.status(200).json({ reviews: bookReview });
    } else {
        return res.status(404).json({ message: "No reviews found for this ISBN." });
    }
  //res.send(bookReview);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
