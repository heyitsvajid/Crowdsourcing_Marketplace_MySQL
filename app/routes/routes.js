module.exports = function (app) {

    var api_controller = require('../controllers/controller.js');

    //Login
    app.post('/login', api_controller.login);

    //SignUp
    app.post('/signup', api_controller.signup);

    //Upload Image
    app.post('/uploadImage', api_controller.uploadImage);

    //Update profile
    app.post('/updateprofile', api_controller.updateprofile);

    //Get profile
    app.post('/getProfile', api_controller.getprofile);

    //Get profile image
    app.post('/getProfileImage', api_controller.getprofileimage);

     //Post Project
     app.post('/postProject', api_controller.postProject);
}