const express = require('express');
const User = require('../core/user');
const router = express.Router();
const con = require('../core/pool');
const hash = require('bcrypt');


const user = new User();
//*********************************************Nguyen section**************************************************//
router.post('/do-comment',(req,res)=>{
    console.log("in do-comment")
    // PostID =req.body.postID
    // UserID = req.body.UserID
    // CommentContent = req.body.comment
    // TimeOfComment = new Date()
    // console.log("in do-comment")
    // sql = "INSERT INTO comments (UserID, PostID,CommentContent, TimeOfComment) VALUES ( ?, ?, ?,?)";
    // data = [UserID,PostID ,CommentContent,TimeOfComment];
    // console.log("in do-comment")
    // con.query(sql, data, (err, result) => {
    //     if(err) throw err;
    //          //SUccess
    //     console.log("success")
    //     res.redirect('groupnew')
    //  })
})
router.get('/GroupPost',(req,res)=>{
    console.log("inside GroupPost")
    if(req.session && req.session.user){
        user.getPosts((result)=>{
            //console.log(result)
            result.reverse()
            res.render('home-form',{posts:result})
        })
    }else
    {
        res.redirect('/');
    }
    console.log("End GroupPost")
})
// go table comment
router.get('/comment',(req,res)=>{
    res.send("Still work")
    // console.log('in comment')
    // if(req.session && req.session.user){
    //     console.log(req.body)
    //     user.find(req.session.user.Email,(result)=>{
    //         if(result){
    //             res.render('partials/comment-form');
    //             return;
    //         }
    //         res.redirect('/');
    //     })
    // }else
    // {
    //     res.redirect('/');
    // }
});
//get create Post
router.get('/createpost',(req,res)=>{
    console.log('in table create post')
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
    console.log("End table create post")
})
router.post('/submitpost',(req,res)=>{
    console.log("in submit post")
    if(req.session.user.UserID){
        var UserID = req.session.user.UserID
        var PostContent = req.body.addComment
        var TimeOfComment= new Date()
        var FullName = req.session.user.FirstName +' '+ req.session.user.LastName
       // console.log(UserID+" "+PostContent+"time:"+TimeOfComment)
        //Insert the user into the database
        sql = "INSERT INTO posts (UserID, PostContent,FullName, TimeOffPost) VALUES ( ?, ?, ?,?)";
        data = [UserID, PostContent,FullName,TimeOfComment];
    
         con.query(sql, data, (err, result) => {
             if(err) throw err;
    
             //SUccess
             
             res.redirect("/GroupPost");
         })
    }else{
        res.redirect("/");
    }

    console.log("end submit Post")
})
//*****************************************************End Nguyen section ************/
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
    console.log(req.body.username)
    user.login(req.body.username, req.body.password, function(result){
        if(result) {
            console.log("result",result)
            req.session.user = result;
            req.session.opp = 1;

            req.flash('Logged in as :'+result.username);
            res.redirect('/GroupPost');

            
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
