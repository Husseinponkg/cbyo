const express=require('express');
const port=3000;
const app=express();
const jwt=require('jsonwebtoken');
const session=require('express-session');
const path=require('path');
require('dotenv').config({path:path.resolve(__dirname,'.env')});

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));
app.use(express.urlencoded({extended:true}));


app.use(session({
    secret:process.env.Secret,
    resave:false,
    saveUninitialized:false
}))

app.get('/',async (req,res)=>{
    res.sendFile(__dirname +'/public/index.html');
});
//routes
const adminRoutes=require('./routes/admin');
const authrouter=require('./routes/auth');
const reportrouter=require('./routes/report');
const mediarouter=require('./routes/media');

app.use('/auth',authrouter);
app.use('/admin',adminRoutes);
app.use('/report',reportrouter);
app.use('/media',mediarouter);

app.listen(port,()=>{
    console.log(`server is running in port http://localhost:${port}`);
});