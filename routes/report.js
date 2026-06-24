const express=require('express');
const router=express.Router();
const reportController=require('../controllers/report');

router.post('/create',reportController.createreport);
router.get('/all',reportController.getallreport);
router.get('/download/:id',reportController.downloadreport);
router.delete('/delete/:id',reportController.deleteReport);
module.exports=router;