//import mysql
const mysql = require('mysql');

const fs = require('fs');

//import express library
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

//allows for images to be used (could not get local images to load without it)
app.use(express.static('images'));

//import body parser
const bodyParser = require('body-parser');
var urlparser = bodyParser.urlencoded({extended : false})

//create database connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tightknit'
})

//connection test for database (throws err if connection fails)
con.connect(function(err){
    if(err) throw err;
    console.log('connected to database');
});

//query to database for user information and renders the profile page
app.get("/profile", (req, res) => {
    con.query('select * from accounts where UserID=1', (err,result) => {
        if(err) throw err;
        console.log(result)
        res.render('profile', {firstName : result[0].FirstName, lastName : result[0].LastName,
         email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture} );
    })
    })

//edit profile action
app.get("/editprofile", (req, res) => {
    con.query('select * from accounts where UserID=1', (err,result) => {
        if(err) throw err;
        res.render('editprofile', {firstName : result[0].FirstName, lastName : result[0].LastName,
            email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture} );
    })
})

//update profile (urlparser saves the post data)
app.post("/updateprofile", urlparser, (req, res) => {

    /*prepared sql statement
    gets data from parser and saves it for sql statement in variable data
    executes prepared sql statement*/
    let sql = 'update accounts set FirstName = ?, LastName=?, Email=?, Bio=? where UserID=1;'
    let data = [req.body.fName, req.body.lName, req.body.email, req.body.bio]
    con.query(sql, data, (err,result) => {
        if(err) throw err;
    })
    
    con.query('select * from accounts where UserID=1', (err,result) => {
        if(err) throw err;
        res.render('profile', {firstName : result[0].FirstName, lastName : result[0].LastName,
            email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture});
    })
})

//new profile picture
app.post("/newpfp", urlparser, (req, res) => {
        console.log(req.body.img)
        
        let sql = 'update accounts set ProfilePicture = ? where UserID=1;'
        let data = [req.body.img]
        con.query(sql, data, (err,result) => {
        if(err) throw err;
    })

        con.query('select * from accounts where UserID=1', (err,result) => {
            if(err) throw err;
            res.render('editprofile', {firstName : result[0].FirstName, lastName : result[0].LastName,
                email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture} );
    })
})



app.listen(8000, () => {
    console.log('server is up and listening');
});

