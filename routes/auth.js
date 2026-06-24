const express=require('express');
const db=require('../config/db');
const router=express.Router();
const authcontroller=require('../controllers/auth');


router.post('/create-user',authcontroller.createusers);
router.post('/login',authcontroller.loginuser);
router.get('/all',authcontroller.getallusers);
router.put('/update/:id',authcontroller.updateuser);
router.delete('/delete/:id',authcontroller.deleteuser);
router.get('/one/:id',authcontroller.getoneuser);
router.get('/count',authcontroller.countusers);

module.exports=router;