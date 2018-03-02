module.exports = function (app) {

    var api_controller = require('../controllers/controller.js');

    //Login
    app.post('/login', api_controller.login);

    //SignUp
    app.post('/signup', api_controller.signup);

     //Upload Image
     app.post('/uploadImage', api_controller.uploadImage);


     
}