const pool = require('./pool');

const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    find : function(user = null, callback)
    {

        if(user) {
            var field = Number.isInteger(user) ? "id": 'Email';
        }

        let sql = `SELECT * FROM accounts WHERE ${field} = ?`;

        pool.query(sql, user, function(err, result) {
            if(err) throw err
            callback(result);
        });
    },
    findPostID : function(user = null, callback)
    {

        if(user) {
            var field = 'UserID';
        }
        let sql = `SELECT * FROM posts WHERE ${field}  = ?`;
        pool.query(sql, user, function(err, result) {
            if(err) console.log("fffffgggg")
            callback(result);
        });
    },

    login : function(username, password, callback)
    {
        //Find the user in the database
        this.find(username, function(result){

            //Make sure we found something
            if(result != null && result.length > 0) {

                // Convert the JSON to a string and back to a JSON
                // Is it inefficient? Yes. Does it work without it? No.
                result = JSON.stringify(result[0]);
                result= JSON.parse(result);

                //If passwords match, log them in
                if(bcrypt.compareSync(password, result['Passwd'])) {
                    callback(result);
                    return;
                }
            }
            callback(null);
        })
    }

}

module.exports = User;