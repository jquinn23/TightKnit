const express = require('express');
const User = require('../core/user');
const router = express.Router();
const con = require('../core/pool');
const hash = require('bcrypt');


const user = new User();

// Index Page
router.get('/', function(req, res){
    let user = req.session.user;
    if (user) {
        console.log(req.session.user)
        res.redirect('/home');
        return;
    }
    res.render('index', {title:"My application"});
});
 
// Get home page
router.get('/home', (req, res, next)=>{
    let user = req.session.user;

    if(user){
        res.render('home', {opp:req.session.op, name:user.fullname});
        return;
    }
    res.redirect('/');
});

// Post Login Data
router.post('/login', (req, res, next)=> {
    user.login(req.body.username, req.body.password, function(result){
        if(result) {

            req.session.user = result;
            req.session.opp = 1;

            req.flash('Logged in as :'+result.username);
            res.redirect('/home');

            
        } else {
            req.flash('Username/Password is incorrect!');
            res.redirect('/');
        }
    })
});

// Log Out Button
router.get('/logout', (req, res, next) => {
    if(req.session.user) {
        req.session.destroy(function(){
            res.redirect('/');
        });
    }
});

//Registration
router.post("/register", (req, res) => {
    console.log(req.body);
    var first_name = req.body.register_first_name;
    var last_name = req.body.register_last_name;
    //Username is actually email. Long story.
    var email = req.body.username;
    var password = hash.hashSync(req.body.password, 10);

    //Make sure they filled in all the fields
    if(first_name == null || email == null || password == null || last_name == null)
    {
        req.flash("Not all fields provided");
        req.redirect('/');
    }

    //Ensure nobody has used this email before
    let sql = "SELECT * from accounts WHERE Email = ?";
    let data = [email];

    //using a flag to not put a connection within a connection
    let proceed_flag = false;

    con.query(sql, data, (err, result) => {
        if(err) throw err;

        //If the email has been used before, don't proceed
        if(result.length > 0)
        {
            req.flash("Email has already been used");
            res.redirect('/');
        }
        else
        {
            //Insert the user into the database
            sql = "INSERT INTO accounts (FirstName, LastName, Email, Passwd) VALUES (?, ?, ?, ?)";
            data = [first_name, last_name, email, password];

            con.query(sql, data, (err, result) => {
                if(err) throw err;

                //REGISTRATION SUCCESSFUL
                res.redirect(307, "login");
            })
        }
    

    })    
})

//profile
router.get("/profile", (req, res) => {
    con.query(`select * from accounts where UserID=${req.session.user.UserID}`, (err,result) => {
        if(err) throw err;
        res.render('profile', {firstName : result[0].FirstName, lastName : result[0].LastName,
         email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture} );
    })
    })

//edit profile page
router.get("/editprofile", (req, res) => {
    con.query(`select * from accounts where UserID=${req.session.user.UserID}`, (err,result) => {
        if(err) throw err;
        res.render('editprofile', {firstName : result[0].FirstName, lastName : result[0].LastName,
            email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture} );
    })
})

//update profile
router.post("/updateprofile", (req, res) => {

    /*prepared sql statement
    gets data from parser and saves it for sql statement in variable data
    executes prepared sql statement*/
    let sql = `update accounts set FirstName = ?, LastName=?, Email=?, Bio=? where UserID=${req.session.user.UserID};`
    let data = [req.body.fName, req.body.lName, req.body.email, req.body.bio]
    con.query(sql, data, (err,result) => {
        if(err) throw err;
        res.redirect('/profile');
    })
})


//settings
router.get("/settings", (req, res) => {
        res.render('settings')
    })

//account deleted
router.get("/deletedaccount", (req, res) => {
    con.query(`delete from accounts where UserID=${req.session.user.UserID}`, (err,result) => {
        if(err) throw err;
        res.render('index');
    })
})

//admin page
router.get("/adminpage", (req, res) => {
    res.render('adminpage')
    })


//stuff for profile pictures
const multer = require('multer')
router.use(express.static('./public'))
const path = require('path')

const storage = multer.diskStorage({
    //renames the images and stores them in the public folder
    destination: './public',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
}).single('img');

//new pfp
router.post("/newpfp", (req, res) => {
    upload(req, res, (err)=>{
        //sql to change the pfp
        let sql = `update accounts set ProfilePicture = ? where UserID=${req.session.user.UserID};`
        let data = [req.file.filename]
        con.query(sql, data, (err,result) => {
        if(err) throw err;

        //redirects to profile page
        res.redirect('/profile');
    })
    })
    })

module.exports = router;
