// routes/search-route.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/search?term=concert&location=Bangkok
router.get('/', async (req, res) => {
    try {
        // ตรวจสอบและตั้งค่าเริ่มต้นของ query parameters
        const term = req.query.term || '';
        const location = req.query.location || '';

        console.log(`Searching for term: "${term}", location: "${location}"`);

        // สร้างเงื่อนไขการค้นหาตามข้อมูลที่มี
        let whereCondition = {
            isApproved: true,
            status: "APPROVED"
        };

        // เพิ่มเงื่อนไขค้นหาจากคำค้น (term) เมื่อไม่เป็นค่าว่าง
        if (term.trim() !== '') {
            whereCondition.OR = [
                { eventTitle: { contains: term } },
                { description: { contains: term } }
            ];

            // ตรวจสอบว่า eventCategories เป็น array หรือไม่ก่อนใช้ hasSome
            try {
                whereCondition.OR.push(
                    { eventCategories: { contains: term } }
                );
            } catch (e) {
                console.log("ไม่สามารถค้นหาใน eventCategories ได้:", e.message);
            }
        }

        // เพิ่มเงื่อนไขค้นหาจากสถานที่ (location) เมื่อไม่เป็นค่าว่าง
        if (location.trim() !== '') {
            whereCondition.location = { contains: location };
        }

        console.log("Where condition:", JSON.stringify(whereCondition, null, 2));

        // ค้นหาจาก Events model
        const events = await prisma.events.findMany({
            where: whereCondition,
            include: {
                user: {
                    select: {
                        username: true,
                        profileImage: true
                    }
                },
                eventImages: true
            }
        });

        console.log(`Found ${events.length} events`);
        res.json(events);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'เกิดข้อผิดพลาดในการค้นหา',
            message: error.message,
            stack: process.env.DATABASE_URL === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;