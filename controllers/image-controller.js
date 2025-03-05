const { PrismaClient } = require('@prisma/client');
const { cloudinary } = require('../configs/cloudinary');

const prisma = new PrismaClient();

exports.uploadImage = async (req, res) => {
  try {
    const {eventId} = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'ไม่มีไฟล์ที่อัปโหลด' });
    }
const event = await prisma.events.findUnique({
    where: {id: Number(eventId)}
});

if(!event){
    return res.status(404).json({message: 'ไม่พบกิจกรรม'});
}

    const image = await prisma.eventImages.create({
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        eventId: Number(eventId)
      }
    });

    res.status(201).json({
      success: true,
      image
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await prisma.eventImages.findUnique({
      where: { id: Number(id) }
    });

    if (!image) {
      return res.status(404).json({ message: 'ไม่พบรูปภาพ' });
    }

    await cloudinary.uploader.destroy(image.publicId);

    await prisma.eventImages.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'ลบรูปภาพเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรูปภาพ', error: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await prisma.eventImages.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ', error: error.message });
  }
};