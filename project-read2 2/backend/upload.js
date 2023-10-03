// const multer = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, 'File_' + uniqueSuffix + file.originalname)
//     }
// })

// exports.upload = multer({ storage: storage }).single('file')
const fs = require('fs');

async function SaveImageToFile(imageData , fileName) {
  if(imageData == null)
    return;
  try {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, ''); // ลบส่วนข้อมูล Base64
    const buffer = Buffer.from(base64Data, 'base64'); // แปลงข้อมูล Base64 เป็น Buffer
    await fs.promises.writeFile(fileName, buffer); // บันทึก Buffer เป็นไฟล์
    console.log(`บันทึกรูปภาพเป็นไฟล์ ${fileName} สำเร็จ`);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกไฟล์รูปภาพ:', error);
  }
}

module.exports = {
  SaveImageToFile
};
