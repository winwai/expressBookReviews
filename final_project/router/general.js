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
  //res.send(JSON.stringify(books,null,4));
  //return res.status(200).json({message: "Book list returned."});
  new Promise((resolve, reject) => {
    // In a real scenario, this would be a database call or API fetch
    if (books) { // Assuming 'books' is always available in this context
        resolve(books);
    } else {
        reject("Books data not found.");
    }
})
.then(data => {
    // Success callback
    res.status(200).json({ books: data, message: "Book list returned." });
})
.catch(error => {
    // Error callback
    res.status(500).json({ message: "Failed to retrieve book list.", error: error });
});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //res.send(books[isbn]);
  //return res.status(200).json({message: "book returned."});
  // Simulate an asynchronous lookup for the book by ISBN
  new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate a small delay for asynchronous behavior
        if (books[isbn]) {
            resolve(books[isbn]); // Resolve with the book data
        } else {
            reject("Book not found for the given ISBN."); // Reject if book not found
        }
    }, 50); // 50ms delay
})
.then(book => {
    // If the promise resolves (book found)
    res.status(200).json({ book: book, message: "Book details returned successfully." });
})
.catch(error => {
    // If the promise rejects (book not found)
    res.status(404).json({ message: error }); // Send 404 with the error message
});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author;

  new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate async operation
          const matchingBooks = [];
          const bookKeys = Object.keys(books);

          for (let i = 0; i < bookKeys.length; i++) {
              const bookKey = bookKeys[i];
              const book = books[bookKey];

              if (book.author.toLowerCase() === requestedAuthor.toLowerCase()) {
                  matchingBooks.push(book);
              }
          }

          if (matchingBooks.length > 0) {
              resolve(matchingBooks); // Resolve with the list of matching books
          } else {
              reject("No books found for this author."); // Reject if no books match
          }
      }, 50); // Simulate a small delay
  })
  .then(booksbyauthor => {
      // If the promise resolves (books found)
      res.status(200).json({ booksbyauthor: booksbyauthor, message: "Books by author returned successfully." });
  })
  .catch(error => {
      // If the promise rejects (no books found for author)
      res.status(404).json({ message: error }); // Send 404 with the error message
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title;

  new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate async operation
          const matchingBooks = [];
          const bookKeys = Object.keys(books);

          for (let i = 0; i < bookKeys.length; i++) {
              const bookKey = bookKeys[i];
              const book = books[bookKey];

              if (book.title.toLowerCase() === requestedTitle.toLowerCase()) {
                  matchingBooks.push(book);
              }
          }

          if (matchingBooks.length > 0) {
              resolve(matchingBooks); // Resolve with the list of matching books
          } else {
              reject("No books found for this title."); // Reject if no books match
          }
      }, 50); // Simulate a small delay
  })
  .then(booksbytitle => {
      // If the promise resolves (books found)
      res.status(200).json({ booksbytitle: booksbytitle, message: "Books by title returned successfully." });
  })
  .catch(error => {
      // If the promise rejects (no books found for title)
      res.status(404).json({ message: error }); // Send 404 with the error message
  });
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
