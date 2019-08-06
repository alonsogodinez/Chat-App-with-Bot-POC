const express = require('express');
const router = express.Router();
const  userController = require('../controllers/users');
const  chatRoomController = require('../controllers/chatroom');
const { isAuthenticated } = require('../middlewares/auth');


router.post('/signup', userController.add);
router.post('/login', userController.login);

//router.post('/chatroom/message', chatRoomController.addMessage);

router.use(isAuthenticated);
router.get('/chatroom', chatRoomController.list);
router.get('/chatroom/:id', chatRoomController.getChatRoom);

router.post('/chatroom', chatRoomController.create);


module.exports = router;
