var db_controller = require('./dbhelper.js');
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');
let fs = require('fs');

exports.uploadImage = function (req, res) {
    // Login User API
    console.log('Image Upload API Called');
    console.log(req.file);

        console.log('ELSE');
        let form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            console.log(files);
            let { path: tempPath, originalFilename } = files.file[0];
            let copyToPath = "./app/images/" + originalFilename;
            console.log(copyToPath);
            fs.readFile(tempPath, (err, data) => {
                if (err) throw err;
                fs.writeFile(copyToPath, data, (err) => {
                    if (err) throw err;
                    // delete temp image
                    fs.unlink(tempPath, () => {
                        res.send("File uploaded to: " + copyToPath);
                    });
                });
            });
        })
    

};
exports.login = function (req, res) {
    // Login User API
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Please Provide email and password"
        });
        console.log("ERROR");
    } else {
        let email = "\"" + req.body.email + "\"";


        db_controller.getConnection(function (err, connection) {
            // Use the connection
            let sqlQuery = 'select * from user where email=' + email;
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                console.log(results);

                if (results.length >= 1) {
                    console.log('check  password');
                    console.log('Checking Password: ' + req.body.password);
                    console.log(bcrypt.compareSync(req.body.password, results[0].password));
                    if (bcrypt.compareSync(req.body.password, results[0].password)) {
                        // Passwords match
                        console.log('pass match');
                        res.json("Successful");
                        return;
                    } else {
                        // Passwords don't match
                        console.log('passn not match');
                        res.json("Username password does not match");
                        return;
                    }

                }
                else {
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

        let hash = bcrypt.hashSync(req.body.password, 10);
        var password = "\"" + hash + "\"";
        console.log('Hashing Password: ' + req.body.password);
        console.log('Hashed Password: ' + password);

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