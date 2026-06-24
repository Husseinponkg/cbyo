const  db=require('../config/db');



const uploadfile=async (req,res)=>{
    try{
        const{originalname,mimetype,filename,path:filepath}=req.file;
        const type=mimetype.startsWith('image/')?'image':'video';
        const sql=`insert into media(name,type,filename,filepath,created_at)values(?,?,?,?,Now())`;
        const [rows]=await db.query(sql,[originalname,mimetype,filename,filepath]);
        return res.status(200).json({
            id:rows.insertId
        });
    }catch(error){
        console.error('error in uploading media',error);
        return res.status(500).json({message:'internal server error'});
    }
}
const getallmedia=async (req,res)=>{
    try{
        const [rows]=await db.query('select * from media');
        
        return res.status(200).json(rows);


    }catch(error){
        console.error('error in fetching media',error);
        return res.status(500).json({message:'internal server error'});
    }
}
const getonemedia=async (req,res)=>{
    try{
        const{id}=req.params;
        const [rows]=await db.query('select * from media where id=?',[id]);

        return res.status(500).json(rows[0]);
    }catch(error){
        console.error('error in fetching media',error);
        return res.status(500).json({message:'internal server error'});
    }
}
const deletemedia=async (req,res)=>{
    try{
        const{id}=req.params;
        const [rows]=await db.query('delete from media where id=?',[id]);

        return res.status(200).json({message:'deleted successfully'});
    }catch(error){
        console.log('error in delete media files');
        return res.status(500).json({message:'internal server error'});
    }
}
module.exports={
    uploadfile,
    getallmedia,
    getonemedia,
    deletemedia
}