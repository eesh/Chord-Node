var UserController = require('../controllers/UserController');
var GroupController = require('../controllers/GroupController');

module.exports = function(app) {
    
    
    app.get('/', function(req, res, err) {
        
        res.send('Website under construction');
    });
    
    /*  USER END POINTS  */
    
    app.get('/user/:userid', UserController.getUserInfo); // Get user profile information
    
    app.post('/user', UserController.postCreateUser); // Create new user - works
    app.post('/user/authenticate', UserController.postAuthenticateUser); // Login user - works
    
    app.put('/user', UserController.putUpdateUser); // Update user information
    
    
    /* GROUP END POINTS  */
    
    app.delete('/group/:groupid/:userid', GroupController.deleteMember); // Removes a member from the group - done
    app.delete('/group/:groupid', GroupController.deleteGroup); // - done
    
    app.get('/group/:groupid', GroupController.getGroupInfo); // Get group information - done
    
    app.post('/group', GroupController.postGroup); // Create new group - done
    app.post('/group/member', GroupController.postAddMember); // Add a new member to the group - done
    
    app.put('/group', GroupController.putUpdateGroup); // Update group - done
    
    
    /* FILE IO END POINTS */
    
    app.post('/file', GroupFilesController.addFile);
    
    app.get('/file', GroupFilesController.getFile);
};