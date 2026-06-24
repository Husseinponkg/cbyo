const express=require('express');
const router=express.Router();
const mediacontr=require('../controllers/media');
const upload=require('../middleware/media');

router.post('/upload',upload.single('file'),mediacontr.uploadfile);
router.get('/all',mediacontr.getallmedia);
router.get('/one/:id',mediacontr.getonemedia);
router.delete('/delete/:id',mediacontr.deletemedia);


module.exports=router;