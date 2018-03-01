var db_controller = require('./dbhelper.js');


exports.login = function (req, res) {
    // Login User API
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Please Provide email and password"
        });
        console.log("ERROR");
    } else {
        let email = "\"" + req.body.email + "\"";
        let password = "\"" + req.body.password + "\"";

        db_controller.getConnection(function (err, connection) {
            // Use the connection
            let sqlQuery = 'select * from user where email='+email;
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                console.log(results);
                
                if(results.length>=1){
                    console.log('check password');
                    if(results[1].password == password){
                        res.json("Successful");
                        return;
                }else{
                    console.log('passn not match');
                    res.json("Username password does not match");
                    return;
                }
            
            }
                else{
                    console.log('Username not found');
                    res.json('Username not found');
                    return;
                }
                
        
                
            });
        });
       

    }

};



exports.signup = function (req, res) {
    // SignUp User API

    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Please Provide name,userid and password"
        });
        console.log("ERROR");
    } else {

        let name = "\"" + req.body.name + "\"";
        let email = "\"" + req.body.email + "\"";
        let password = "\"" + req.body.password + "\"";

        db_controller.getConnection(function (err, connection) {
            // Use the connection
            let sqlQuery = 'insert into user(name,email,password) values(' + name + ',' + email + ',' + password + ')';
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) throw error;                
                res.json("Sign Up Successful");
                return;
              
            });
        });
     

    }

};