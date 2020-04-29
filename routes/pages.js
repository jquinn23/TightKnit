const express = require('express');
const User = require('../core/user');
const router = express.Router();
const con = require('../core/pool');
const hash = require('bcrypt');


const user = new User();
//*********************************************Nguyen section**************************************************//
router.post('/do-comment',(req,res)=>{
    console.log("in post comment")
    if(req.session &&req.session.user.UserID){
        var UserID = req.session.user.UserID
        var CommentContent = req.body.addComment
        var TimeOfComment= new Date()
        var PostID = req.body.PostID
        sql = 'INSERT INTO comments (UserID, PostID, CommentContent, TimeOfComment) VALUES ( ?, ?, ?, ?)';
        data = [UserID, PostID, CommentContent, TimeOfComment];
    
         con.query(sql, data, (err, result) => {
             if(err) throw err;
             //SUccess
             res.redirect('/comment/'+PostID)
         })
    }else{
        res.redirect("/");
    }

    //req.session.user.UserID
})
router.get('/GroupPost/:id',(req,res)=>{
    console.log("inside GroupPost")
    var UserID = req.session.user;
    if(req.session && req.session.user){
        console.log(req.session.user.GroupID)
        if(req.session.user.GroupID == req.params.id){
            user.getPosts(req.params.id,(result)=>{
                //console.log(result
                //console.log(dataArray)
                if(result.length>0)
                {
                    console.log("up")
                    result.reverse()
                    res.render("home-form", { posts: result ,  user: UserID})
                }
                else{
                    let sql = 'select*from groupp inner join accounts on groupp.GroupID = accounts.GroupID where groupp.GroupID = ?'
                    con.query(sql, req.params.id, function (error, results, fields) {
                        if (error) throw error;
                        console.log("donwn")
                        console.log(results)
                        result.reverse()
                        res.render("home-form", { posts: result ,  user: UserID})
                })
            }
                
            })
            console.log("out")
        }
        else{
            res.redirect('/group');
        }
    }else
    {
        res.redirect('/');
    }
    console.log("End GroupPost")
})
// display comment
router.get('/comment/:id',(req,res)=>{
    let sql = 'select *from posts inner join comments on posts.PostID = comments.PostID where posts.PostID = ?'
    con.query(sql, req.params.id, function (error, results, fields) {
         if (error) throw error;
         if(results.length>0){
             res.render("partials/comment",{posts:results})
        }
        else{
             let sql = 'select *from posts where PostID=?'
             con.query(sql, req.params.id, function (error, results, fields) {
             if (error) throw error;
             res.render("partials/comment",{posts:results})
            })
        }
       
    })
    
});
router.post('/submitpost',(req,res)=>{
    console.log("in submit post")
    if(req.session && req.session.user.UserID){
        var UserID = req.session.user.UserID
        var GroupID = req.session.user.GroupID
        var PostContent = req.body.addComment
        var TimeOfComment= new Date()
        var FullName = req.session.user.FirstName +' '+ req.session.user.LastName
        sql = "INSERT INTO posts (UserID, PostContent,FullName, TimeOffPost) VALUES ( ?, ?, ?,?)";
        data = [UserID, PostContent,FullName,TimeOfComment];
         con.query(sql, data, (err, result) => {
             if(err) throw err;
    
             //SUccess
             
             res.redirect("/GroupPost/"+GroupID);
         })
    }else{
        res.redirect("/");
    }

    console.log("end submit Post")
})
router.get("/group",(req,res)=>{
    res.send("You dont have on that group")
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
            res.redirect('/');

            
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
