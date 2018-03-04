var db_controller = require('./dbhelper.js');
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');
let fs = require('fs');



exports.uploadImage = function (req, res) {
    // Login User API
    console.log('Image Upload API Called');
    //console.log(req);

    var resultObject = {
        successMsg: '',
        errorMsg: 'Error Uploading Image',
        data: {}
    }
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        var resultObject = {
            successMsg: '',
            errorMsg: 'Error Uploading Image',
            data: {}
        }
        let { path: tempPath, originalFilename } = files.file[0];
        console.log(files);
        var fileType = originalFilename.split(".");
        let copyToPath = "./app/images/" + fields.id + '.' + fileType[1];
        console.log(copyToPath);
        try {
            fs.readFile(tempPath, (err, data) => {
                if (err) throw err;
                fs.writeFile(copyToPath, data, (err) => {
                    if (err) throw err;
                    // delete temp image
                    fs.unlink(tempPath, () => {
                    });
                });
            });
            db_controller.getConnection(function (err, connection) {
                // Use the connection
                let sqlQuery = 'insert into attachments(link) values(\"' + copyToPath + '\");';
                console.log(sqlQuery);
                connection.query(sqlQuery, function (error, results, field) {
                    // And done with the connection.
                    connection.release();
                    if (error) throw error;
                    if (results.insertId > 0) {
                        console.log('updating user table for : ' + fields.id);
                        db_controller.getConnection(function (err, connection) {
                            // Use the connection
                            let sqlUpdateProfileId = 'update user set profile_id=\"' + results.insertId + '\" where id=' + fields.id;
                            console.log(sqlUpdateProfileId);
                            connection.query(sqlUpdateProfileId, function (error, results, fields) {
                                // And done with the connection.
                                //console.log(error);
                                connection.release();
                                // Handle error after the release.
                                if (error) throw error;
                                console.log(results);
                                resultObject.successMsg = 'Image Uploaded Successfully';
                                resultObject.errorMsg = '';
                                res.json(resultObject);
                                return;
                            });
                        });
                    }
                });
            });



        } catch (e) {
            console.log('Catch');
            resultObject.errorMsg = 'Error Uploading Image';
            res.json(resultObject);
            return;
        }
    })


};
exports.login = function (req, res) {
    // Login User API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error Signing user in',
        data: {}
    }
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
                    console.log('checking  password');

                    if (bcrypt.compareSync(req.body.password, results[0].password)) {
                        // Passwords match
                        resultObject.successMsg = 'Log In Successful';
                        resultObject.errorMsg = '';
                        resultObject.data = {
                            id: results[0].id,
                            name: results[0].name,
                            email: results[0].email
                        }
                        res.json(resultObject);
                        return;
                    } else {
                        // Passwords don't match
                        console.log('passn not match');
                        resultObject.errorMsg = 'Username password does not match';
                        res.json(resultObject);
                        return;
                    }

                }
                else {
                    console.log('Username not found');
                    resultObject.errorMsg = 'Username not found';
                    res.json(resultObject);
                    return;
                }
            });
        });


    }

};



exports.signup = function (req, res) {
    // SignUp User API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error Signing user in',
        data: {}
    }
    if (!req.body.name || !req.body.email || !req.body.password) {
        console.log('No name, email and password');
        resultObject.errorMsg = 'Please Provide name, email and password';
        res.json(resultObject);
        return;
    } else {

        let name = "\"" + req.body.name + "\"";
        let email = "\"" + req.body.email + "\"";

        let hash = bcrypt.hashSync(req.body.password, 10);
        var password = "\"" + hash + "\"";
        console.log('Hashing Password: ' + req.body.password);
        console.log('Hashed Password: ' + password);

        //Check Username allready exists
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
                    console.log('Username allready taken');
                    resultObject.errorMsg = 'Username allready taken';
                    res.json(resultObject);
                    return;
                }
            });
        });

        db_controller.getConnection(function (err, connection) {
            // Use the connection
            let sqlQuery = 'insert into user(name,email,password) values(' + name + ',' + email + ',' + password + ')';
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                console.log('Sign Up Succcessful');
                resultObject.errorMsg = '';
                resultObject.successMsg = 'Sign Up Succcessful';
                resultObject.data = {
                    id: results.insertId,
                    name: name,
                    email: email
                }
                res.json(resultObject);

                return;
            });
        });


    }

};

exports.updateprofile = function (req, res) {
    // SignUp User API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error updating profile',
        data: {}
    }
    if (!req.body.name || !req.body.email) {
        console.log('No name and email');
        resultObject.errorMsg = 'Please Provide name and email';
        res.json(resultObject);
        return;
    } else {
        try {
            let name = "\"" + req.body.name + "\"";
            let email = "\"" + req.body.email + "\"";
            let phone = "\"" + req.body.phone + "\"";
            let about = "\"" + req.body.about + "\"";
            let skills = "\"" + req.body.skills + "\""
            let id = "\"" + req.body.id + "\"";

            // let hash = bcrypt.hashSync(req.body.password, 10);
            // var password = "\"" + hash + "\"";
            // console.log('Hashing Password: ' + req.body.password);
            // console.log('Hashed Password: ' + password);

            db_controller.getConnection(function (err, connection) {
                // Use the connection
                let sqlUpdateNEP = 'update user set name=' + name + ',email=' + email + ' where id=' + id;
                console.log(sqlUpdateNEP);
                connection.query(sqlUpdateNEP, function (error, results, fields) {
                    if (error) throw error;
                    connection.release();
                });
            });
            if (req.body.about != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlUpdateAbout = 'update user set about=' + about + ' where id=' + id;
                    console.log(sqlUpdateAbout);
                    connection.query(sqlUpdateAbout, function (error, results, fields) {
                        if (error) throw error;
                        connection.release();
                    });
                });
            }
            if (req.body.phone != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlUpdatePhone = 'update user set phone=' + phone + ' where id=' + id;
                    console.log(sqlUpdatePhone);
                    connection.query(sqlUpdatePhone, function (error, results, fields) {
                        if (error) throw error;
                        connection.release();
                    });
                });
            }
            if (req.body.skills != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlUpdateSkills = 'update user set skills=' + skills + ' where id=' + id;
                    console.log(sqlUpdateSkills);
                    connection.query(sqlUpdateSkills, function (error, results, fields) {
                        if (error) throw error;
                        connection.release();
                    });
                });
            }
            console.log('Update Succcessful');
            resultObject.errorMsg = '';
            resultObject.successMsg = 'Update Succcessful';
            res.json(resultObject);
            return;
        } catch (e) {
            console.log('Update Succcessful');
            resultObject.errorMsg = 'Error Occured';
            resultObject.successMsg = '';
            res.json(resultObject);
        }
    }

};



exports.getprofile = function (req, res) {
    // SignUp User API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching profile',
        data: {}
    }
    if (!req.body.id) {
        console.log('No Id provided');
        resultObject.errorMsg = 'No Id provided';
        res.json(resultObject);
        return;
    } else {
        try {
            let id = "\"" + req.body.id + "\"";
            if (req.body.about != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlGetProfile = 'select * from user where id=' + id;
                    console.log(sqlGetProfile);
                    connection.query(sqlGetProfile, function (error, results, fields) {
                        if (error) throw error;
                        connection.release();
                        console.log('Fetch profile Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch profile Succcessful';
                        resultObject.data = {
                            name: results[0].name,
                            email: results[0].email,
                            phone: results[0].phone ? results[0].phone : '',
                            about: results[0].about ? results[0].about : '',
                            skills: results[0].skills ? results[0].skills : ''
                        }
                        res.json(resultObject);
                        return;
                    });
                });
            }


        } catch (e) {
            console.log('Error Occured');
            resultObject.errorMsg = 'Error Occured';
            resultObject.successMsg = '';
            res.json(resultObject);
        }
    }

};

exports.getprofileimage = function (req, res) {
    // SignUp User API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching image',
        data: {}
    }
    if (!req.body.id) {
        console.log('No Id provided');
        resultObject.errorMsg = 'No Id provided';
        res.json(resultObject);
        return;
    } else {
        try {
            let id = "\"" + req.body.id + "\"";
            if (req.body.about != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlGetProfileId = 'select profile_id from user where id=' + id;
                    console.log(sqlGetProfileId);
                    connection.query(sqlGetProfileId, function (error, results, fields) {
                        if (error) throw error;

                        console.log('Fetch profile id Succcessful');

                        let sqlGetPath = 'select link from attachments where id=' + results[0].profile_id;
                        console.log(sqlGetPath);
                        connection.query(sqlGetPath, function (error, results, fields) {
                            if (error) throw error;
                            connection.release();
                            console.log('Fetch path Succcessful');

                            var filePath = results[0].link;
                            var stat = fs.statSync(filePath);

                            var img = fs.readFileSync(filePath);
                            res.writeHead(200, { 'Content-Type': 'image/png' });
                            res.end(img);
                        });
                    });
                });
            }


        } catch (e) {
            console.log('Error Occured');
            resultObject.errorMsg = 'Error Occured';
            resultObject.successMsg = '';
            res.json(resultObject);
        }
    }

};


exports.postProject = function (req, res) {
    // Login User API
    console.log('Post Project API Called');
    //console.log(req);

    var resultObject = {
        successMsg: '',
        errorMsg: 'Error posting project',
        data: {}
    }
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        var resultObject = {
            successMsg: '',
            errorMsg: 'Error Uploading Image',
            data: {}
        }
        let { path: tempPath, originalFilename } = files.file[0];
        console.log(files);
        var fileType = originalFilename.split(".");
        let copyToPath = "./app/files/" + fields.id + '.' + fileType[1];
        console.log(copyToPath);
        try {
            fs.readFile(tempPath, (err, data) => {
                if (err) throw err;
                fs.writeFile(copyToPath, data, (err) => {
                    if (err) throw err;
                    // delete temp image
                    fs.unlink(tempPath, () => {
                    });
                });
            });
            db_controller.getConnection(function (err, connection) {
                // Use the connection
                let sqlQuery = 'insert into attachments(link) values(\"' + copyToPath + '\");';
                console.log(sqlQuery);
                connection.query(sqlQuery, function (error, results, field) {
                    // And done with the connection.
                    connection.release();
                    if (error) throw error;
                    if (results.insertId) {
                        let title = "\"" + fields.title + "\"";
                        let description = "\"" + fields.description + "\"";
                        let skill = "\"" + fields.skill + "\"";
                        let budget = "\"" + fields.budget + "\"";
                        let period = "\"" + fields.period + "\"";
                        let id = fields.id;
                        console.log('updating user table for : ' + fields.id);
                        db_controller.getConnection(function (err, connection) {
                            // Use the connection
                            let sqlAddProject = 'insert into project(' +
                                'employer_id,title,description,main_skill_id,budget_range,budget_period,document_id)'
                                + 'values(' + fields.id + ',' + title + ',' + description + ',' + skill + ',' + budget + ',' + period + ',' + results.insertId + ')';
                            console.log(sqlAddProject);
                            connection.query(sqlAddProject, function (error, results, fields) {
                                // And done with the connection.
                                //console.log(error);
                                connection.release();
                                // Handle error after the release.
                                if (error) throw error;
                                console.log(results);
                                resultObject.successMsg = 'Project posted Successfully';
                                resultObject.errorMsg = '';
                                res.json(resultObject);
                                return;
                            });
                        });
                    }
                });
            });



        } catch (e) {
            console.log('Catch');
            resultObject.errorMsg = 'Error Uploading Image';
            res.json(resultObject);
            return;
        }
    })


};