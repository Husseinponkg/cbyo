const db=require('../config/db');
const bcrypt=require('bcrypt');


const createadmin=async (req,res)=>{
    try{
        const{username,password}=req.body;
        
        
        const sql=`insert into admin(username,password)values(?,?)`;
        const [results]=await db.query(sql,[username,password]);

        return res.status(200).json({
            message:'admin created',
            id:results.insertId,
            username:username,
            password:password
        });
    }catch(error){
        console.error('error in creating admin',error);
        return res.status(500).json({message:'internal server error'});
    }
}

const updateadmin=async (req,res)=>{
    try{
        const{id}=req.params;
        const{username,password}=req.body;
        const sql='UPDATE admin SET username=?, password where id=?';
        const [result]=await db.query(sql,[username,password,id]);
    
         if(result.affectedRows===0){
            return res.status(404).json({message:'user not found'});
         }
         return res.status(200).json({message:'user updated successfully'});
    }catch(error){
        console.error('error in updating admin',error);
        return res.status(500).json({message:'internalo server error'});
    }
}
const deleteadmin=async (req,res)=>{
    try{
        const{id}=req.params;
        const [result]=await db.query('delete from admin where id=?',[id]);

        return res.status(200).json({message:"admin deleteed successfully"});
    }catch(error){
            console.error('error in delete admin',error);
        return res.status(500).json({message:'internalo server error'});
    }
}
const getalladmin=async (req,res)=>{
    try{
        const [results]=await db.query('select * from admin');
        return res.status(200).json(results);
    }catch(error){
        console.error(error,'error in getting all admins');
        return res.status(500).json({message:'internal server error'});
    }
}
const getoneadmin=async (req,res)=>{
    try{
        const{id}=req.params;
        const [result]=await db.query('select * from admin where id=?',[id]);
        if(result.length===0){
            return res.status(404).json({message:'admin not found'});
        }
        return res.status(200).json(result[0]);
    }catch(error){
            console.error(error,'error in getting one admins');
        return res.status(500).json({message:'internal server error'});
    }
}
module.exports={
    createadmin,
    updateadmin,
    deleteadmin,
    getalladmin,
    getoneadmin
}