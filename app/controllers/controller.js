var db_controller = require('./dbhelper.js');
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');
let fs = require('fs');
const BID_STATUS_SENT = 'BID_SENT';
const BID_STATUS_ACCEPTED = 'BID_ACCEPTED';
const BID_STATUS_REJECTED = 'BID_REJECTED';

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
            console.log('Catch : ' + e.message);
            resultObject.errorMsg = e.message;
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
        errorMsg: 'Error',
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
                } else {
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
            console.log('Catch : ' + e.message);
            resultObject.errorMsg = e.message;
            res.json(resultObject);
            return;
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
            if (req.body.id != '') {
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
    // getprofileimage API
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

            if (req.body.id != '') {
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
                            if (results.length > 0) {
                                console.log('Image in response');
                                var filePath = results[0].link;
                                var stat = fs.statSync(filePath);

                                var img = fs.readFileSync(filePath);
                                res.writeHead(200, { 'Content-Type': 'image/png' });
                                res.end(img);
                            } else {
                                console.log('No image found');
                                res.json({ errorMsg: 'No Image found' });
                                return;
                            }

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
        let copyToPath = "./app/files/_" + Date.now() + '_.' + fileType[1];
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


exports.getOpenProjects = function (req, res) {
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
            if (req.body.id != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    // let sqlGetProjectDetail = 'select project.id,user.name,title,main_skill_id,budget_range,budget_period from project inner join user on project.employer_id=user.id';
                    // let sqlGetProjectDetail = 'select project_avg_detail.* from (select a.id,a.employer_id,user.name,a.title,a.main_skill_id,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average '+ 
                    // 'from project inner join user on project.employer_id=user.id,project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as project_avg_detail where project_avg_detail.employer_id!='+req.body.id;

                    let sqlGetProjects = 'select c.name,sub1.* from (select a.id,a.employer_id,a.title,a.main_skill_id,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average ,count(b.project_id) as count ' +
                        'from project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as sub1,user c where c.id=sub1.employer_id and employer_id!=' + req.body.id;
                    console.log(sqlGetProjects);
                    connection.query(sqlGetProjects, function (error, results, fields) {
                        if (error) throw error;
                        console.log(results);
                        connection.release();
                        console.log('Fetch projects Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch projects Succcessful';
                        resultObject.data = results;
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

exports.getProject = function (req, res) {
    // Get project detail from id API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching project',
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
            if (req.body.id != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlGetProject = 'select * from project where id=' + id;
                    console.log(sqlGetProject);
                    connection.query(sqlGetProject, function (error, results1, fields) {
                        if (error) throw error;

                        console.log('Fetch project Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch project Succcessful';
                        let sqlGetProjectBid = 'select * from bid where project_id=' + id + 'and user_id=' + req.body.currentUserId;
                        console.log(sqlGetProjectBid);
                        connection.query(sqlGetProjectBid, function (error, results, fields) {
                            if (error) throw error;

                            console.log('Fetch bid Succcessful');
                            resultObject.errorMsg = '';
                            resultObject.successMsg = 'Fetch bid Succcessful';
                            console.log(results);
                            var flag = results.length > 0;
                            resultObject.data = {
                                title: results1[0].title,
                                skill: results1[0].main_skill_id,
                                description: results1[0].description,
                                budget: results1[0].budget_range,
                                period: results1[0].budget_period,
                                bidNowButton: !flag,
                            }

                            connection.release();
                            res.json(resultObject);
                            return;
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

exports.postBid = function (req, res) {
    // postBid API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error posting bid',
        data: {}
    }
    if (!req.body.projectId || !req.body.employeeId || !req.body.period || !req.body.amount) {
        console.log('No name, email and password');
        resultObject.errorMsg = 'Please Provide project id , employee id, amount and period';
        res.json(resultObject);
        return;
    } else {

        let projectId = "\"" + req.body.projectId + "\"";
        let employeeId = "\"" + req.body.employeeId + "\"";
        let amount = "\"" + req.body.amount + "\"";
        let period = "\"" + req.body.period + "\"";
        let staus = "\"" + BID_STATUS_SENT + "\"";

        db_controller.getConnection(function (err, connection) {
            // Use the connection
            let sqlQuery = 'insert into bid(project_id,user_id,bid_period,bid_amount,bid_status)' +
                ' values(' + projectId + ',' + employeeId + ',' + period + ',' + amount + ',' + staus + ')';
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                console.log('Bid Succcessful');
                resultObject.errorMsg = '';
                resultObject.successMsg = 'Bid Succcessful';
                res.json(resultObject);

                return;
            });
        });


    }

};


exports.getBids = function (req, res) {
    // Get project detail from id API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching project bids',
        data: {}
    }
    if (!req.body.id) {
        console.log('No project id provided');
        resultObject.errorMsg = 'No project id provided';
        res.json(resultObject);
        return;
    } else {
        try {
            let project_id = "\"" + req.body.id + "\"";
            if (req.body.id != '') {
                db_controller.getConnection(function (err, connection) {
                    // Use the connection
                    let sqlGetProjectBids = 'select sub1.* from (select a.project_id,a.user_id,b.name,a.bid_period,a.bid_amount'+
                    ' from bid a join user b on a.user_id=b.id)  as sub1 where project_id=' + project_id;
                    console.log(sqlGetProjectBids);
                    connection.query(sqlGetProjectBids, function (error, results, fields) {
                        if (error) throw error;
                        console.log('Fetch project bids Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch project bids Succcessful';

                        console.log(results);
                        resultObject.data = results;
                        connection.release();
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