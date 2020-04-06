const express = require('express');
const User = require('../core/user');
const router = express.Router();
const con = require('../core/pool');
const hash = require('bcrypt');


const user = new User();
//groupPost
router.get('/group',(req,res)=>{
    if(req.session && req.session.user){
        //console.log(req.session.user)
        user.find(req.session.user.Email,(result)=>{
            if(result){
                res.render('home-form')
                return;
            }
            res.redirect('/');
        })
    }else
    {
        res.redirect('/');
    }
    
})
// comment
router.get('/comment',(req,res)=>{
    console.log('in comment')
    if(req.session && req.session.user){
        console.log(req.session.user)
        user.find(req.session.user.Email,(result)=>{
            if(result){
                res.render('partials/comment-form');
                return;
            }
            res.redirect('/');
        })
    }else
    {
        res.redirect('/');
    }
});
router.post('/submitcomment',(req,res)=>{
    console.log('in submit comment')
    if(req.session.user){
        //console.log(req.session.user.UserID)
        user.findPostID(req.session.user.UserID,(result)=>{
            result = JSON.stringify(result[0]);
            result= JSON.parse(result);
            //data
            UserID = req.session.user.UserID
            PostID = result.PostID
            CommentContent = req.body.addComment
            TimeOfComment = new Date()
             //Insert the user into the database
            sql = "INSERT INTO comments (UserID, PostID, CommentContent, TimeOfComment) VALUES (?, ?, ?, ?)";
            data = [UserID, PostID, CommentContent, TimeOfComment];

            con.query(sql, data, (err, result) => {
                if(err) throw err;

                //REGISTRATION SUCCESSFUL
                res.redirect("/group");
            })
        })
    }else{
        res.redirect('/')
    }

})
router.get('/createpost',(req,res)=>{
    console.log('in post')
    if(req.session && req.session.user){
        //console.log(req.session.user)
        user.find(req.session.user.Email,(result)=>{
            if(result){
                res.render('partials/post-form')
                return;
            }
            res.redirect('/');
        })
    }else
    {
        res.redirect('/');
    }
})
//get create Post
router.post('/submitpost',(req,res)=>{
    console.log("in submit post")
    if(req.session.user.UserID){
        var UserID = req.session.user.UserID
        var PostContent = req.body.addComment
        var TimeOfComment= new Date()
       // console.log(UserID+" "+PostContent+"time:"+TimeOfComment)
        //Insert the user into the database
        sql = "INSERT INTO posts (UserID, PostContent, TimeOffPost) VALUES ( ?, ?, ?)";
        data = [UserID, PostContent,TimeOfComment];
    
         con.query(sql, data, (err, result) => {
             if(err) throw err;
    
             //SUccess
             console.log("success")
             res.redirect("/group");
         })
    }else{
        res.redirect("/");
    }

    
})
// Index Page
router.get('/', function(req, res){
    let user = req.session.user;
    if (user) {
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
           // console.log("result",result)
            req.session.user = result;
            req.session.opp = 1;

            req.flash('Logged in as :'+result.username);
            res.redirect('/group');

            
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




module.exports = router;
