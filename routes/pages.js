const express = require('express');
const User = require('../core/user');
const router = express.Router();
const con = require('../core/pool');
const hash = require('bcrypt');


const user = new User();
<<<<<<< HEAD

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
=======
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
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a
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
<<<<<<< HEAD
            res.redirect('/GroupPost');
        })
=======
                
            })
            console.log("out")
        }
        else{
            res.redirect('/group');
        }
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a
    }else
    {
        res.redirect('/');
    }
<<<<<<< HEAD
    console.log("End table create post")
})
=======
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
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a
router.post('/submitpost',(req,res)=>{
    console.log("in submit post")
    if(req.session && req.session.user.UserID){
        var UserID = req.session.user.UserID
        var GroupID = req.session.user.GroupID
        var PostContent = req.body.addComment
        var TimeOfComment= new Date()
        var FullName = req.session.user.FirstName +' '+ req.session.user.LastName
<<<<<<< HEAD
       // console.log(UserID+" "+PostContent+"time:"+TimeOfComment)
        //Insert the user into the database
        sql = "INSERT INTO posts (UserID, PostContent, FullName, TimeOffPost) VALUES ( ?, ?, ?, ?)";
        data = [UserID, PostContent, FullName,TimeOfComment];
    
=======
        sql = "INSERT INTO posts (UserID, PostContent,FullName, TimeOffPost) VALUES ( ?, ?, ?,?)";
        data = [UserID, PostContent,FullName,TimeOfComment];
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a
         con.query(sql, data, (err, result) => {
             if(err) throw err;
    
             //SUccess
             
<<<<<<< HEAD
             res.redirect("/GroupPost");
=======
             res.redirect("/GroupPost/"+GroupID);
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a
         })
    }else{
        res.redirect("/");
    }

    console.log("end submit Post")
<<<<<<< HEAD
})

=======
})
router.get("/group",(req,res)=>{
    res.send("You dont have on that group")
})
//*****************************************************End Nguyen section ************/
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a
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
    console.log(req.body.username)
    user.login(req.body.username, req.body.password, function(result){
        if(result) {
            console.log("result",result)
            req.session.user = result;
            req.session.opp = 1;

<<<<<<< HEAD
            if(req.session.user.AdministratorFlag != null){
                res.redirect('/adminpage')
            }
            else if(req.session.user.GroupID == null)
            {
                res.redirect('/regroup');
            }
            else{
                req.flash('Logged in as :'+result.username);
                res.redirect('/home');
            }
=======
            req.flash('Logged in as :'+result.username);
            res.redirect('/');
>>>>>>> 08918f9fd58455548f38d2201196694098fb958a

            
        } else {
            req.flash('Username/Password is incorrect!');
            res.redirect('/');
        }
    })
});

// Joins the user to a different group
router.get('/regroup', (req, res, next) => {

    //If there is no user redirect them
    if(req.session.user == null) {
        res.redirect('/');
    }
    //If they have a group, redirect them
    else if(req.session.user.GroupID != null){
        res.redirect('/');
    }
    //Otherwise, render the group page
    else {
        res.render('add_group');
    }
    
});

//Attempting to join a group in a category
router.post('/regroup', (req, res, next) => {
     //If there is no user redirect them
     if(req.session.user == null) {
        res.redirect('/');
    }
    //If they have a group, redirect them
    else if(req.session.user.GroupID != null || req.session.user.UserID == null){
        res.redirect('/');
    }
    
    
    //Yes, there are several better ways to do this, but I'm in a rush.
    //Make sure the submission matches a legitimate category
    let Category = JSON.stringify(req.body.group);
    Category = Category.substring(1, Category.length - 1)

    if(Category.valueOf() === "Xbox" || Category.valueOf() === "Nintendo" || Category.valueOf() === "Playstation" ||
    Category.valueOf() === "PC Gaming" || Category.valueOf() === "Reading" || Category.valueOf() === "Movies" 
    || Category.valueOf() === "Chemistry" || Category.valueOf() === "Motorsports" || Category.valueOf() === "Golf" 
    || Category.valueOf() === "Golf" || Category.valueOf() === "Football" || Category.valueOf() === "Soccer" 
    || Category.valueOf() === "Baseball" || Category.valueOf() === "Cooking" || Category.valueOf() === "Camping"
    || Category.valueOf() === "Fitness" || Category.valueOf() === "Uncategorized")
    {
        let GroupType = req.body.group;
        let UserID = req.session.user.UserID

        //Find if there are already any groups of this category
        let sql = "SELECT * from Groupp WHERE GroupCategory = ? AND NumberOfPeopleInGroup < 10";
        let data = [GroupType];


        con.query(sql, data, (err, result) => {
                if(err) throw err;
                //If there is no such group, create one
                if(result.length == 0)
                {
                    sql = "INSERT INTO Groupp (GroupCategory, NumberOfPeopleInGroup) VALUES (?,?)"
                    let data = [GroupType, 1];

                    con.query(sql, data, (err, result) => {
                        if(err) throw err;

                        //Now, get the new GroupID
                        result = null;
                        sql = "SELECT GroupID from Groupp WHERE GroupCategory = ? AND NumberOfPeopleInGroup < 10";
                        data = [GroupType];
                        con.query(sql, data, (err, result)=>
                        {
                            if(err) throw err;
                            
                            //If we can't find the group now, we really blew it
                            if(result.length == 0) throw "Something has gone very wrong";
                            

                            //Doesn't work without it. Reasons unknown
                            result = JSON.stringify(result[0]);
                            result = JSON.parse(result);

                            let new_group_id = result.GroupID;
                            

                            //Now, put the user in the new group
                            sql = "UPDATE accounts SET GroupID = ? WHERE UserID = ?";
                            data = [new_group_id, UserID];
                            con.query(sql, data, (err, result)=>
                            {
                                if(err) throw err;

                                //Send them to their new group
                                res.redirect('/home');
                            })
                        })
                    })
                }
                //Add them to one of the groups
                else
                {
                    //Pick out a random group from among the available ones
                    NewGroup = Math.floor(Math.random() * result.length);
                    
                    //Doesn't work without it. Reasons unknown
                    result = JSON.stringify(result[NewGroup]);
                    result = JSON.parse(result);

                    NewGroupID = result['GroupID'];
                    sql = "UPDATE accounts SET GroupID = ? WHERE UserID = ?";
                    data = [NewGroupID, UserID];
                    
                    con.query(sql, data, (err, result) =>
                    {
                        if(err) throw err;
                        sql = "UPDATE Groupp SET NumberOfPeopleInGroup = NumberOfPeopleInGroup + 1 WHERE GroupId = ?";
                        data = [NewGroupID];
                        con.query(sql, data, (err, result) => {
                            if(err) throw err;

                            //This means we have successfully been added to the group
                            res.redirect('/home');
                        })
                    })
                }
            })
        }
    else{
        console.log(`Error: ${req.body.group} is not a valid category`);
        res.redirect('/');
    }
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


    con.query(sql, data, (err, result) => {
        if(err) throw err;

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
    if(req.session && req.session.user){
        console.log('profile')
        con.query(`select * from accounts where UserID=${req.session.user.UserID}`, (err,result) => {
        if(err) throw err;
        res.render('profile', {r : result, boo:true} );
    })
    }else
    {
        res.redirect('/');
    }
    })

//other profile
router.get("/user/:userID", (req, res) => {
    if(req.session && req.session.user){
        con.query(`select * from accounts where UserID=3`, (err,result) => {
            if(err) throw err;
            console.log(result[0])
            res.render('profile', {r : result,boo:false} );
        })
    }else
    {
        res.redirect('/');
    }
})


//edit profile page
router.get("/editprofile", (req, res) => {
    if(req.session && req.session.user){
        con.query(`select * from accounts where UserID=${req.session.user.UserID}`, (err,result) => {
            if(err) throw err;
            res.render('editprofile', {firstName : result[0].FirstName, lastName : result[0].LastName,
                email : result[0].Email, bio : result[0].Bio, pfp : result[0].ProfilePicture} );
        })
    }else
    {
        res.redirect('/');
    }
})

//update profile
router.post("/updateprofile", (req, res) => {

    if(req.session && req.session.user){
        let sql = `update accounts set FirstName = ?, LastName=?, Email=?, Bio=? where UserID=${req.session.user.UserID};`
        let data = [req.body.fName, req.body.lName, req.body.email, req.body.bio]
        con.query(sql, data, (err,result) => {
        if(err) throw err;
            res.redirect('/profile');
        })
        }else
        {
        res.redirect('/');
        }
})


//settings
router.get("/settings", (req, res) => {
    if(req.session && req.session.user){
        res.render('settings')
    }else
    {
        res.redirect('/');
    }
    })

//account deleted
router.get("/deletedaccount", (req, res) => {
    if(req.session && req.session.user){
        con.query(`delete from accounts where UserID=${req.session.user.UserID}`, (err,result) => {
            if(err) throw err;
            res.render('index');
        })
    }else
    {
        res.redirect('/');
    }
})

//Change/Leave Group
router.get('/changegroup', (req, res) => {
    let id = req.session.user.UserID;
    con.query('UPDATE groupp set NumberOfPeopleInGroup = NumberOfPeopleInGroup - 1 where GroupID = (SELECT GroupID FROM accounts WHERE UserID = ?)', id, (err, result) => {
        if (err) throw err;
        con.query('UPDATE accounts set GroupID = Null WHERE UserID = ?', id, (err, result) => {
            if (err) throw err;
            res.redirect("/regroup");          
        });
    });
});

//Delete Post with comments
router.get('/deletepost/:eventID', (req, res) => {
    console.log(req.params.eventID); console.log(req.session.user.UserID);
    let sql = 'DELETE FROM comments where PostID = ?';
    let data = [req.params.eventID];
    con.query(sql, data, (err, result) => {
        if (err) throw err;
        sql = 'DELETE FROM posts where PostID = ? and UserID = ?';
        data = [req.params.eventID, req.session.user.UserID];
        con.query(sql, data, (err, result) => {
            if (err) console.log(err)
            console.log(result)
        })
    })
})



//admin page
router.get("/adminpage", (req, res) => {
    if(req.session && req.session.user){
            sql = `select distinct GroupID, GroupCategory from Groupp where GroupID is not null`;
            con.query(sql, (err, result)=>{
            console.log(result)
            res.render('adminpage', {group: result})
            })
    }else
    {
        res.redirect('/');
    }
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
    if(req.session && req.session.user){
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
    }else
    {
        res.redirect('/');
    }
    })


router.get('/group',(req,res)=>{
    if(req.session && req.session.user){
        sql = `SELECT GroupID from accounts WHERE UserID = ${req.session.user.UserID}`;
        con.query(sql, (err, result)=>{
            if(err) throw err;
            console.log(result)
    
            sql = `SELECT FirstName, LastName, Bio, ProfilePicture, UserID from accounts WHERE GroupID = ${result[0].GroupID} and UserID <> ${req.session.user.UserID}`;
            con.query(sql, (err, result2)=>{
            console.log(result2)
            res.render('group', {users: result2, numMembers: result2.length})
    
            })
        
            })}else{
                res.redirect('/');
            }
})

router.get('/admingroup/:groupID',(req,res)=>{
    if(req.session && req.session.user){ 
        sql = `SELECT FirstName, LastName, Bio, ProfilePicture, UserID from accounts WHERE GroupID = ${req.params.groupID} and UserID <> ${req.session.user.UserID}`;
            con.query(sql, (err, result2)=>{
            console.log(`users in the group(admin):${result2}`)
            res.render('group', {users: result2, numMembers: result2.length})
                
            })
                    
    }else{
        res.redirect('/');
    }
})
    
module.exports = router;
