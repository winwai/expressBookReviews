const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
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

regd_users.use("/auth/review", function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        //console.log("DEBUG: Token retrieved from session:", token); // Debug 1
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                //console.log("DEBUG: Successfully verified JWT. Decoded payload (req.user):", req.user); // Debug 2
                //console.log("DEBUG: Username extracted from req.user:", req.user.username); // Debug 3
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            username: username
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const reviewText = req.query.reviews; // Review text from query parameter

    // IMPORTANT: In a real application, you'd verify if the user is logged in
    const username = req.user.username; // Get username from session

    if (!username) {
       return res.status(403).json({ message: "You must be logged in to post a review." });
    }
    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Check if the book exists
    if (books[isbn]) {
        // Initialize reviews object if it doesn't exist for this book
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Check if the user has already reviewed this book
        if (books[isbn].reviews[username]) {
            // Modify existing review
            books[isbn].reviews[username] = reviewText;
            return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} modified successfully.`, review: reviewText });
        } else {
            // Add new review for the user
            books[isbn].reviews[username] = reviewText;
            return res.status(201).json({ message: `Review for ISBN ${isbn} by ${username} added successfully.`, review: reviewText });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Get username from the authenticated user's JWT payload

    // 1. Check if username is available (should be set by auth middleware)
    if (!username) {
        return res.status(403).json({ message: "Authentication required. Username not found." });
    }

    // 2. Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    const bookReviews = books[isbn].reviews;

    // 3. Check if the book has any reviews
    if (!bookReviews || Object.keys(bookReviews).length === 0) {
        return res.status(404).json({ message: `No reviews found for ISBN ${isbn}.` });
    }

    // 4. Check if the authenticated user has a review for this book
    if (bookReviews[username]) {
        // 5. Delete the user's specific review
        delete bookReviews[username];
        return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} deleted successfully.` });
    } else {
        // User does not have a review for this book
        return res.status(404).json({ message: `No review found for ISBN ${isbn} by user ${username}.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
