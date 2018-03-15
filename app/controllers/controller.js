var db_controller = require('./dbhelper.js');
var bcrypt = require('bcrypt');
var multiparty = require('multiparty');
let fs = require('fs');
const BID_STATUS_SENT = 'BID_SENT';
const BID_STATUS_ACCEPTED = 'BID_ACCEPTED';
const BID_STATUS_REJECTED = 'BID_REJECTED';

exports.uploadImage = function (req, res) {
    // Upload Image API
    console.log('API: uploadImage ' + 'STEP: Start');

    var resultObject = {
        successMsg: '',
        errorMsg: 'Error Uploading Image',
        data: {}
    }
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        resultObject = {
            successMsg: '',
            errorMsg: 'Error Uploading Image',
            data: {}
        }
        console.log(files);
        let { path: tempPath, originalFilename } = files.file[0];
        var fileType = originalFilename.split(".");
        let copyToPath = "./src/images/" + fields.id + '.' + fileType[1];
        let dbPath = fields.id + '.' + fileType[1];
        fs.readFile(tempPath, (err, data) => {
            if (err) throw err;
            fs.writeFile(copyToPath, data, (err) => {
                if (err) throw err;
                // delete temp image
                fs.unlink(tempPath, () => {
                    console.log('API: uploadImage ' + 'STEP: FIle save to new path');
                });
            });
        });
        db_controller.getConnection(function (error, connection) {
            try {
                if (error) throw error;
            } catch (error) {
                console.log(error);
                console.log('Catch : ' + error.message);
                resultObject.errorMsg = error.message;
                res.json(resultObject);
                return;
            }
            // Use the connection
            let sqlQuery = 'insert into attachments(link) values(\"' + dbPath + '\");';
            console.log('API: uploadImage ' + 'STEP: Add into DB' + ' Query : ' + sqlQuery);
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
        db_controller.getConnection(function (error, connection) {
            // Use the connection
            try {
                if (error) throw error;
            } catch (error) {
                console.log(error);
                console.log('Catch : ' + error.message);
                resultObject.errorMsg = error.message;
                res.json(resultObject);
                return;
            }
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
                        req.session.id = results[0].id;
                        req.session.name = results[0].name;
                        req.session.email = results[0].email;
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
        db_controller.getConnection(function (error, connection) {
            // Use the connection
            try {
                if (error) throw error;
            } catch (error) {
                console.log(error);
                console.log('Catch : ' + error.message);
                resultObject.errorMsg = error.message;
                res.json(resultObject);
                return;
            }
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
                            req.session.id = results.insertId;
                            req.session.name = name;
                            req.session.email = email;
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
            db_controller.getConnection(function (error, connection) {
                // Use the connection
                try {
                    if (error) throw error;
                } catch (error) {
                    console.log(error);
                    console.log('Catch : ' + error.message);
                    resultObject.errorMsg = error.message;
                    res.json(resultObject);
                    return;
                }
                let sqlUpdateNEP = 'update user set name=' + name + ',email=' + email + ' where id=' + id;
                console.log(sqlUpdateNEP);
                connection.query(sqlUpdateNEP, function (error, results, fields) {
                    if (error) throw error;
                    connection.release();
                });
            });
            if (req.body.about != '') {
                db_controller.getConnection(function (error, connection) {
                    // Use the connection
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
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
                db_controller.getConnection(function (error, connection) {
                    // Use the connection
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
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
                            skills: results[0].skills ? results[0].skills : '',
                            profile_id: results[0].profile_id ? results[0].profile_id : ''
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
                db_controller.getConnection(function (error, connection) {
                    // Use the connection
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
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
                                resultObject.errorMsg = '';
                                resultObject.successMsg = 'Fetch profile image Succcessful';
                                resultObject.data = {
                                    src: results[0].link
                                }
                                res.json(resultObject);
                                return;
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
        let copyToPath = "./src/files/_" + Date.now() + '_.' + fileType[1];
        let dbPath = Date.now() + '_.' + fileType[1];
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
            db_controller.getConnection(function (error, connection) {
                // Use the connection
                try {
                    if (error) throw error;
                } catch (error) {
                    console.log(error);
                    console.log('Catch : ' + error.message);
                    resultObject.errorMsg = error.message;
                    res.json(resultObject);
                    return;
                }
                let sqlQuery = 'insert into attachments(link) values(\"' + dbPath + '\");';
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
                db_controller.getConnection(function (error, connection) {
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
                    // Use the connection
                    // let sqlGetProjectDetail = 'select project.id,user.name,title,main_skill_id,budget_range,budget_period from project inner join user on project.employer_id=user.id';
                    // let sqlGetProjectDetail = 'select project_avg_detail.* from (select a.id,a.employer_id,user.name,a.title,a.main_skill_id,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average '+ 
                    // 'from project inner join user on project.employer_id=user.id,project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as project_avg_detail where project_avg_detail.employer_id!='+req.body.id;

                    let sqlGetProjects = 'select c.name,sub1.* from (select a.id,a.freelancer_id,a.employer_id,a.title,a.main_skill_id,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average ,count(b.project_id) as count ' +
                        'from project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as sub1,user c where c.id=sub1.employer_id and employer_id!=' + req.body.id + ' and sub1.freelancer_id IS NULL';
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
                db_controller.getConnection(function (error, connection) {
                    // Use the connection
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
                    //  let sqlGetProject = 'select a.*,b.link from project a join attachments b ON a.document_id = b.id where a.id=' + id;
                    let sqlGetProject = 'select sub1.*,b.link from (select a.id,a.freelancer_id,a.document_id,a.description,a.employer_id,a.title,a.main_skill_id,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average ' +
                        ',count(b.project_id) as count from project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as sub1,attachments b where ' +
                        'b.id=sub1.document_id  and sub1.id=' + id;
                    console.log(sqlGetProject);
                    connection.query(sqlGetProject, function (error, results1, fields) {
                        if (error) throw error;
                        console.log(results1);
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
                                link: results1[0].link,
                                average: results1[0].average,
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
    if (!req.body.projectId || !req.body.userId || !req.body.period || !req.body.amount) {
        console.log('No name, email and password');
        resultObject.errorMsg = 'Please Provide project id , employee id, amount and period';
        res.json(resultObject);
        return;
    } else {
        let update = req.body.update;
        let projectId = "\"" + req.body.projectId + "\"";
        let userId = "\"" + req.body.userId + "\"";
        let amount = "\"" + req.body.amount + "\"";
        let period = "\"" + req.body.period + "\"";
        let staus = "\"" + BID_STATUS_SENT + "\"";

        db_controller.getConnection(function (error, connection) {
            // Use the connection
            try {
                if (error) throw error;
            } catch (error) {
                console.log(error);
                console.log('Catch : ' + error.message);
                resultObject.errorMsg = error.message;
                res.json(resultObject);
                return;
            }
            let sqlQuery = '';
            if (update) {
                sqlQuery = 'update bid set bid_amount=' + amount + ',bid_period=' + period + ' where user_id=' + userId +
                    ' and project_id=' + projectId;
                resultObject.successMsg = 'Bid Updated Succcessfully';
            } else {
                sqlQuery = 'insert into bid(project_id,user_id,bid_period,bid_amount,bid_status)' +
                    ' values(' + projectId + ',' + userId + ',' + period + ',' + amount + ',' + staus + ')';
                resultObject.successMsg = 'Bid Succcessful';
            }
            connection.query(sqlQuery, function (error, results, fields) {
                // And done with the connection.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                console.log('Bid Succcessful');
                resultObject.errorMsg = '';
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
                db_controller.getConnection(function (error, connection) {
                    // Use the connection
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
                    let sqlGetProjectBids = 'select sub1.* from (select a.project_id,a.user_id,b.name,b.id as userId,b.profile_id,a.bid_period,a.bid_amount' +
                        ' from bid a join user b on a.user_id=b.id)  as sub1 where project_id=' + project_id;
                    console.log(sqlGetProjectBids);
                    connection.query(sqlGetProjectBids, function (error, results, fields) {
                        if (error) throw error;
                        connection.release();
                        console.log('Fetch project bids Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch project bids Succcessful';
                        console.log(results);
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



exports.getUserBidProjects = function (req, res) {
    // SignUp User API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching projects',
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
                db_controller.getConnection(function (error, connection) {
                    // Use the connection
                    try {
                        if (error) throw error;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
                    // let sqlGetProjectDetail = 'select project.id,user.name,title,main_skill_id,budget_range,budget_period from project inner join user on project.employer_id=user.id';
                    // let sqlGetProjectDetail = 'select project_avg_detail.* from (select a.id,a.employer_id,user.name,a.title,a.main_skill_id,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average '+ 
                    // 'from project inner join user on project.employer_id=user.id,project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as project_avg_detail where project_avg_detail.employer_id!='+req.body.id;

                    let sqlGetProjects = 'select c.name,sub1.* from (select a.id,a.employer_id,a.title,a.main_skill_id,a.budget_range,a.budget_period,b.bid_amount,b.bid_status,b.user_id,COALESCE(avg(b.bid_amount),0) as average ,count(b.project_id) as count ' +
                        'from project a left outer join bid b on a.id=b.project_id group by a.id,a.title) as sub1,user c where c.id=sub1.employer_id and sub1.employer_id!=' + req.body.id + ' and sub1.user_id=' + req.body.id;
                    console.log(sqlGetProjects);
                    connection.query(sqlGetProjects, function (error, results, fields) {
                        if (error) throw error;
                        console.log(results);
                        connection.release();
                        console.log('Fetch user project bid Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch user project bid Succcessful';
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


exports.isLoggedIn = function (req, res) {
    console.log('Check Login');
    console.log(req.session.name);
    if (req.session.name) {
        console.log('is logged in');
        let responsePayload = {
            responseCode: 0,
            responseMsg: 'Allready Logged In',
            name: req.session.name,
            email: req.session.email,
            id: req.session.id,
        }
        res.json(responsePayload);
        return;
    } else {
        console.log('Not logged in');
        let responsePayload = {
            responseCode: 1,
            responseMsg: 'Log In Required',
        }
        res.json(responsePayload);
        return;
    }
};

exports.logout = function (req, res) {
    console.log('Destroying Session');
    console.log('Session Destroyed');
    req.session.destroy();
    res.send('Logout');
    return;
};


exports.getUserProjects = function (req, res) {
    // My Projects API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching projects',
        data: {}
    }
    if (!req.body.id) {
        console.log('No Id provided');
        resultObject.errorMsg = 'No Id provided';
        res.json(resultObject);
        return;
    } else {

        if (req.body.id != '') {
            db_controller.getConnection(function (error, connection) {
                // Use the connection
                try {
                    if (error) throw error;
                } catch (error) {
                    console.log(error);
                    console.log('Catch : ' + error.message);
                    resultObject.errorMsg = error.message;
                    res.json(resultObject);
                    return;
                }
                let sqlGetOpenProjects = 'select a.id,a.employer_id,a.title,a.budget_range,a.budget_period,COALESCE(avg(b.bid_amount),0) as average ,count(b.project_id) as count' +
                    ' from project a left outer join bid b on a.id=b.project_id and b.bid_status=\'BID_SENT\' where a.employer_id=' + req.body.id + ' and a.freelancer_id is NULL group by a.id,a.title';
                console.log(sqlGetOpenProjects);
                connection.query(sqlGetOpenProjects, function (error, results, fields) {
                    try {
                        if (error) throw error;
                        console.log(results);
                        console.log('Fetch user open project Succcessful');
                        resultObject.errorMsg = '';
                        resultObject.successMsg = 'Fetch user open project Succcessful';
                        resultObject.data.openProjects = results;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
                    let sqlGetProgressProjects = 'select c.name,sub1.* from (select a.id as project_id,a.employer_id,a.freelancer_id,a.title,a.end_date,b.bid_amount,COALESCE(avg(b.bid_amount),0) as average ,count(b.project_id) as count' +
                        ' from project a left outer join bid b on a.id=b.project_id where b.bid_status!=\'BID_SENT\' and a.employer_id=' + req.body.id + ' group by a.id,a.title) as sub1,user c' +
                        ' where c.id=sub1.freelancer_id';
                    console.log(sqlGetProgressProjects);
                    connection.query(sqlGetProgressProjects, function (error, results1, fields) {
                        try {
                            if (error) throw error;
                            console.log(results1);
                            connection.release();
                            console.log('Fetch user progress project Succcessful');
                            resultObject.errorMsg = '';
                            resultObject.successMsg = 'Fetch user progress project Succcessful';
                            resultObject.data.progressProjects = results1;
                            console.log(resultObject);
                            res.json(resultObject);
                            return;
                        } catch (error) {
                            console.log(error);
                            console.log('Catch : ' + error.message);
                            resultObject.errorMsg = error.message;
                            res.json(resultObject);
                            return;
                        }
                    });
                });
            });
        }
    }
};

exports.checkBid = function (req, res) {
    // Get bid detail API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching bid detail',
        data: {}
    }
    if (!req.body.userId || !req.body.projectId) {
        console.log('No Id provided');
        resultObject.errorMsg = 'No Id provided';
        res.json(resultObject);
        return;
    } else {

        if (req.body.userId != '') {
            db_controller.getConnection(function (error, connection) {
                // Use the connection
                try {
                    if (error) throw error;
                } catch (error) {
                    console.log(error);
                    console.log('Catch : ' + error.message);
                    resultObject.errorMsg = error.message;
                    res.json(resultObject);
                    return;
                }
                let sqlBidDetail = 'select * from bid where user_id=' + req.body.userId +
                    ' and project_id=' + req.body.projectId;
                console.log(sqlBidDetail);
                connection.query(sqlBidDetail, function (error, results, fields) {
                    try {
                        if (error) throw error;
                        console.log(results);
                        connection.release();
                        console.log('Fetch user project bid Succcessful');
                        resultObject.errorMsg = '';
                        if (results.length > 0) {
                            resultObject.successMsg = 'Fetch user bid Succcessful';
                            resultObject.data.amount = results[0].bid_amount;
                            resultObject.data.period = results[0].bid_period;
                            resultObject.data.update = true;
                        } else {
                            resultObject.successMsg = 'No bid found';
                        }
                        res.json(resultObject);
                        return;
                    } catch (error) {
                        console.log(error);
                        console.log('Catch : ' + error.message);
                        resultObject.errorMsg = error.message;
                        res.json(resultObject);
                        return;
                    }
                });
            });
        }

    }

};

exports.hireEmployer = function (req, res) {
    // postBid API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error posting bid',
        data: {}
    }
    if (!req.body.projectId || !req.body.freelancerId) {
        console.log('No name, email and password');
        resultObject.errorMsg = 'Please Provide project idand freelancer id';
        res.json(resultObject);
        return;
    } else {
        let endDate = "\"" + req.body.endDate + "\"";
        let projectId = "\"" + req.body.projectId + "\"";
        let freelancerId = "\"" + req.body.freelancerId + "\"";

        db_controller.getConnection(function (error, connection) {
            try {
                if (error) throw error;
            } catch (error) {
                console.log(error);
                console.log('Catch : ' + error.message);
                resultObject.errorMsg = error.message;
                res.json(resultObject);
                return;
            }
            // Use the connection
            let sqlQuery = 'update project set freelancer_id=' + freelancerId + ',end_date=' + endDate +
                ' where id=' + projectId + ';update bid set bid_status=\'BID_ACCEPTED\' where project_id=' + projectId +
                ' and user_id=' + freelancerId + ' ;update bid set bid_status=\'BID_REJECTED\' where project_id=' + projectId +
                ' and user_id!=' + freelancerId;
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                try {
                    // And done with the connection.
                    connection.release();
                    // Handle error after the release.
                    if (error) throw error;
                    console.log('Freelancer detail added to project');
                    resultObject.successMsg = 'Freelancer detail added to project';
                    resultObject.errorMsg = '';
                    res.json(resultObject);
                    return;
                } catch (error) {
                    console.log(error);
                    console.log('Catch : ' + error.message);
                    resultObject.errorMsg = error.message;
                    res.json(resultObject);
                    return;
                }

            });
        });
    }
};


var mysql = require('mysql');
//without thread pool test method:
exports.getBidsWithoutThreadPool = function (req, res) {
    // Get project detail from id API
    var resultObject = {
        successMsg: '',
        errorMsg: 'Error fetching project bids',
        data: {}
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "freelancer",
    });

    if (!req.body.id) {
        console.log('No project id provided');
        resultObject.errorMsg = 'No project id provided';
        res.json(resultObject);
        return;
    } else {
        try {
            let project_id = "\"" + req.body.id + "\"";
            if (req.body.id != '') {

                con.connect(function (err) {
                    try {
                        if (err) throw err;
                        let sqlGetProjectBids = 'select sub1.* from (select a.project_id,a.user_id,b.name,b.id as userId,b.profile_id,a.bid_period,a.bid_amount' +
                            ' from bid a join user b on a.user_id=b.id)  as sub1 where project_id=' + project_id;
                        con.query(sqlGetProjectBids, function (err, results) {
                            if (err) throw err;
                            con.end();
                            console.log('Fetch project bids Succcessful');
                            resultObject.errorMsg = '';
                            resultObject.successMsg = 'Fetch project bids Succcessful';
                            console.log(results);
                            resultObject.data = results;
                            res.json(resultObject);
                            return;

                        });
                    } catch (e) {
                        res.json(e.message);
                    }
                });
            }
        } catch (e) {
            console.log('Exception Occured');
            resultObject.errorMsg = e.message;
            resultObject.successMsg = '';
            res.json(resultObject);
        }
    }
};


                        // //add session to table for horizontal scalability
                        // db_controller.getConnection(function (error, connection) {
                        //     // Use the connection
                        //     try {
                        //         if (error) throw error;
                        //     } catch (error) {
                        //         console.log(error);
                        //         console.log('Catch : ' + error.message);
                        //         resultObject.errorMsg = error.message;
                        //         res.json(resultObject);
                        //         return;
                        //     }
                        //     let storeSession = 'insert into user_session(user_name,user_email,user_id)'+
                        //     'values(\''+results[0].name+ '\',\''+results[0].email+'\','+results[0].id+')';
                        //     console.log(storeSession);
                        //     connection.query(storeSession, function (error, result, fields) {
                        //         try{
                        //             if (error) throw error;      
                        //         }    catch(e){
                        //             console.log('##########################################');                                    
                        //             console.log(e.message);
                        //         }
                        //         if (error) throw error;
                        //         connection.release();
                        //     });
                        // });