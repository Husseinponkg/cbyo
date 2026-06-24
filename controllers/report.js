const db=require('../config/db');
const PDFDocument=require('pdfkit');


const createreport=async (req,res)=>{
    try{
        const{title,description,activity}=req.body;

        const sql=`insert into reports(title,description,activity,created_at)values(?,?,?,Now())`;
        const [result]=await db.query(sql,[title,description,activity]);

        const doc=new PDFDocument();
        const filename=`report-${result.insertId}.pdf`;

        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition',`attachment;filename=${filename}`),

        doc.pipe(res);
        doc.fontSize(20).text(title,{align:'center'});
        doc.moveDown();
        doc.fontSize(14).text('Description:');
        doc.fontSize(12).text(description);
        doc.moveDown();
        doc.fontSize(14).text('activity:');
        doc.fontSize(12).text(activity);
        doc.moveDown();
        doc.fontSize(10).text('created_at: ${new Date().toLocaleString())');

        doc.end();
        
       
    }catch(error){
        console.log('error in creating report',error);
        return res.status(500).json({message:'error in creating report'});
    }
}
const getallreport=async (req,res)=>{
    try{
        const [rows]=await db.query('select * from reports');

        return res.status(200).json(rows);
    }catch(error){
          console.log('error in getting report');
        return res.status(500).json({message:'internal server error'});
    }
}
const downloadreport=async (req,res)=>{
    try{
        const{id}=req.params;
        const [rows]=await db.query('select * from reports where id=?',[id]);

        const report=rows[0];
        const doc=new PDFDocument();
        const filename=`report-${id}.pdf`;

        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition',`attachment;filename-${filename}`);

        doc.pipe(res);
        doc.fontSize(14).text(report.title,{align :'center'});
        doc.moveDown();
        doc.fontSize(14).text('Description:');
        doc.fontSize(12).text(report.description);
        doc.moveDown();
        doc.fontSize(14).text('activity:');
        doc.fontSize(12).text(report.activity);
        doc.moveDown();
        doc.fontSize(10).text(`created:${new Date(report.created_at).toLocaleString()}`);

        doc.end();


    }catch(error){
          console.log('error in getting report');
        return res.status(500).json({message:'internal server error'});
    }
}
const deleteReport=async (req,res)=>{
    try{
        const{id}=req.params;
        const [rows]=await db.query('DELETE  FROM reports where id=?',[id]);
        return res.status(200).json({message:'successfully delete report'});

    }catch(error){
          console.log('delete error report');
        return res.status(500).json({message:'internal server error'});
    }
}
module.exports={
    createreport,
    getallreport,
    downloadreport,
    deleteReport
}