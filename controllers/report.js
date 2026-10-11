const db=require('../config/db');
const PDFDocument=require('pdfkit');

const buildProfessionalPdf=async (doc,report)=>{

    const pageWidth=doc.page.width;
    const margin=60;
    const contentWidth=pageWidth-margin*2;
    const primaryDarkBlue='#0a1f44';
    const primaryGold='#ffd700';
    const primaryGreen='#2e7d32';
    const textMain='#1a1a1a';

    doc.rect(0,0,pageWidth,100).fill(primaryDarkBlue);

    doc.fill('#ffffff').fontSize(24).font('Helvetica-Bold')
        .text('CBYO 2026',margin,28,{width:contentWidth,align:'center'});

    doc.fill('#ffffff').fontSize(11).font('Helvetica')
        .text('Official Activity Report',margin,58,{width:contentWidth,align:'center'});

    doc.moveTo(margin,95).lineTo(pageWidth-margin,95)
        .strokeColor(primaryGold).lineWidth(3).stroke();

    let y=120;

    const titleHeight=28;
    const titlePadding=10;
    doc.rect(margin,y-titlePadding,contentWidth,titleHeight+titlePadding*2).fill(primaryDarkBlue);
    doc.fill('#ffffff').fontSize(20).font('Helvetica-Bold')
        .text(report.title,margin,y,{width:contentWidth,align:'center',height:titleHeight});
    y+=42;

    doc.moveTo(margin,y).lineTo(pageWidth-margin,y)
        .strokeColor(primaryGreen).lineWidth(2).stroke();
    y+=18;

    const sectionHeaderHeight=22;
    const sectionHeaderPadding=10;

    doc.rect(margin,y-sectionHeaderPadding,contentWidth,sectionHeaderHeight).fill(primaryDarkBlue);
    doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold')
        .text('Description',margin,y,{width:contentWidth});
    y+=18;

    doc.moveTo(margin,y).lineTo(pageWidth-margin,y)
        .strokeColor(primaryGold).lineWidth(1).stroke();
    y+=12;

    doc.fill(textMain).fontSize(11).font('Helvetica')
        .text(report.description,margin,y,{width:contentWidth,lineGap:6});
    y+=doc.heightOfString(report.description,{width:contentWidth})+24;

    doc.rect(margin,y-sectionHeaderPadding,contentWidth,sectionHeaderHeight).fill(primaryDarkBlue);
    doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold')
        .text('Activity Name',margin,y,{width:contentWidth});
    y+=18;

    doc.moveTo(margin,y).lineTo(pageWidth-margin,y)
        .strokeColor(primaryGold).lineWidth(1).stroke();
    y+=12;

    doc.fill(textMain).fontSize(11).font('Helvetica')
        .text(report.activity,margin,y,{width:contentWidth,lineGap:6});
    y+=doc.heightOfString(report.activity,{width:contentWidth})+24;

    doc.rect(margin,y-sectionHeaderPadding,contentWidth,sectionHeaderHeight).fill(primaryDarkBlue);
    doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold')
        .text('Submission Date',margin,y,{width:contentWidth});
    y+=18;

    doc.moveTo(margin,y).lineTo(pageWidth-margin,y)
        .strokeColor(primaryGold).lineWidth(1).stroke();
    y+=12;

    doc.fill(textMain).fontSize(11).font('Helvetica')
        .text(new Date(report.created_at).toLocaleString(),margin,y,{width:contentWidth});
};
const createreport=async (req,res)=>{
    try{
        const{title,description,activity}=req.body;

        const sql=`insert into reports(title,description,activity,created_at)values(?,?,?,Now())`;
        const [result]=await db.query(sql,[title,description,activity]);

        const [report]=await db.query('select * from reports where id=?',[result.insertId]);
        const doc=new PDFDocument({size:'A4',margin:60});
        const filename=`CBYO Report ${result.insertId}.pdf`;

        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition',`attachment;filename=${filename}`);

        doc.pipe(res);
        await buildProfessionalPdf(doc,report[0]||{...req.body,id:result.insertId,created_at:new Date()});
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
        const doc=new PDFDocument({size:'A4',margin:60});
        const filename=`CBYO Report ${id}.pdf`;

        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition',`attachment;filename=${filename}`);

        doc.pipe(res);
        await buildProfessionalPdf(doc,report);
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