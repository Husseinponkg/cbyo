const express=require('express');
const router=express.Router();
const adminController=require('../controllers/admin');



router.post('/create',adminController.createadmin);
router.get('/getadmins',adminController.getalladmin);
router.put('/update/:id',adminController.updateadmin);
router.get('/admins/:id',adminController.getoneadmin);
router.delete('/delete/:id',adminController.deleteadmin);


module.exports=router;