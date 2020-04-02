create database tightknit;

use tightknit;

create table posts (
	UserID char(10),
    PostID char(10),
    PostContent char(200),
    TimeOffPost datetime  
    );
    
create table comments (
	UserID char(10),
    PostID char(10),
    CommentContent char(200),
    TimeOfComment datetime  
    );

create table accounts (
	UserID char(10),
	AdministratorFlag boolean,
	FirstName Char(25),
    LastName Char(25),
    Bio Char(200),
    Email char(40),
    Passwd char(25),
    Group_ID char(10),
    ProfilePicture BLOB NOT NULL,
    NumVotes int
	);

create table Groupp (
	GroupID char(10),
    GroupCategory char(20),
    NumberOfPeopleInGroup int
);

insert into accounts (UserID, AdministratorFlag, FirstName, LastName, Bio, Email, Passwd, Group_ID, ProfilePicture, NumVotes)
values (1, false, 'miles', 'foret', 'i like this site', 'mforet@uncc.edu', 'password', 1, '/Users/milesforet/tightknit/images/pic.jpg', 0 );