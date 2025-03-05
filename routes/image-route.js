const express = require('express');
const multer = require('multer');
const { cloudinary } = require('../configs/cloudinary.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'eventImages' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            
            // ส่งข้อมูลไฟล์ที่อยู่ในหน่วยความจำไปยัง Cloudinary
            uploadStream.end(req.file.buffer);
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'แกลงรูปไม่ได้จ่ะ', details: error.message });
    }
});

module.exports = router;