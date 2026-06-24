const db=require('../config/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');





const createusers=async (req,res)=>{
    try{
      const{username,email,password,phone,location}=req.body;
      


      const [existing]=await db.query('select id from users where username=? and email=?',[username,email]);
      
      if(existing.length > 0){
      return res.status(409).json({message:'user already exist'});
      }
      const [countresult]=await db.query('select count(*) as total  from users');
      const totalusers=countresult[0].total;

      if(totalusers >=250){
        return res.status(403).json({message:'registration limit as reached'});
      }


      const salts=10;
      const passwordhashed=await bcrypt.hash(password,salts);
      const sql=`insert into users(username,email,password,phone,location)values(?,?,?,?,?)`;
      const [results]=await db.query(sql,[username,email,passwordhashed,phone,location]);

      return res.status(201).json({
        id:results.insertId,
        email:email,
        phone:phone,
        location:location,
        totalmembers:totalusers + 1,
        slotsRemaining:250 - (totalusers + 1)
      });
    }catch(error){
    console.log(error,'error in creating user');
    return res.status(500).json({message:'internal server error'});
    }
}
const countusers=async (req,res)=>{
  try{
    const [rows]=await db.query('SELECT COUNT(*) as total FROM users');
    return res.status(200).json({total:rows[0].total});
  }catch(error){
     console.log(error,'error in count user');
    return res.status(500).json({message:'internal server error'});
  }
}


const loginuser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check admins table first
    const [adminRows] = await db.query('SELECT * FROM admin WHERE username = ? LIMIT 1', [username]);
    if (adminRows.length > 0 ) {
      req.session.user = { id: adminRows[0].id, role: 'admin' };
      return res.status(200).json({ message: 'Welcome Admin', redirect: '/admin/dashadmin.html' });
    }

    // check users table
    const [userRows] = await db.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (userRows.length > 0 && await bcrypt.compare(password, userRows[0].password)) {
      req.session.user = { id: userRows[0].id, role: 'user' };
      return res.status(200).json({ message: 'Welcome User', redirect: '/dash.html' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });

  } catch (error) {
    console.log(error, 'error in login');
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const getallusers=async (req,res)=>{
  try{
    const [rows]=await db.query('select * from users');
    
    if(rows.length===0){
      return res.status(404).json({message:'user not found'});
    }
    return res.status(200).json(rows);
  }catch(error){
    console.log('error in getting all users');
    return res.status(500).json({message:'innternal server error'});
  }
}
const getoneuser=async (req,res)=>{
  try{
    const{id}=req.params;

    const [rows]=await db.query('select * from users where id=?',[id]);

    if(rows.length===0){
      return res.status(404).json({message:'user not found'});
    }
    return res.status(200).json(rows[0]);
  }catch(error){
       console.error(error,'error in getting one user');
       return res.status(500).json({message:'internal server error'});
  }
}
const updateuser=async (req,res)=>{
  try{
  const{id}=req.params;
  const{useraname,password}=req.body;
  
  const sql='UPDATE users SET username=?,password=? where id=?';
  const [rows]=await db.query(sql,[username,password,id]);

  return res.status(200).json({message:'successfully updated'});
  

  }catch(error){
       console.error('error in updating user',error);
        return res.status(500).json({message:'internalo server error'});
  }
}
const deleteuser=async (req,res)=>{
  try{
    const{id}=req.params;
    const [rows]=await db.query('delete from users where id=?',[id]);

    return res.status(200).json({message:'successfully delete user'});
  }catch(error){
     console.error('error in delete user',error);
      return res.status(500).json({message:'internal server error'});
  }
}
module.exports={
  createusers,
  loginuser,
  getallusers,
  getoneuser,
  updateuser,
  deleteuser,
  countusers
}