// const express = require('express');
// const { createEvent, getAllEvents } = require('../controllers/event-controller.js');

// const router = express.Router();

// router.post('/', createEvent);
// router.get('/', getAllEvents);

// module.exports = router;

// back-end/routes/event-route.js
const express = require('express');
const eventController = require('../controllers/event-controller');
const { authCheck } = require('../middlewares/authenticate');

const router = express.Router();


// Public Routes - ไม่ต้องการ authentication
router.get('/', eventController.getAllEvents);  // ย้ายมาไว้ก่อน middleware

// Middleware สำหรับ routes ที่ต้องการ authentication
router.use(authCheck);


// เพิ่ม logging middleware
// router.use((req, res, next) => {
//     console.log('Event Route:', req.method, req.path);
//     next();
//   });
// Routes ที่ต้อง Authentication
router.post('/', authCheck, eventController.createEvent);
router.get('/user/:userId', authCheck, eventController.getUserEvents);
router.delete('/:id', authCheck, eventController.deleteEvent);

// Routes สำหรับ Admin
router.get('/all', authCheck, eventController.getAllEventsForAdmin); // เปลี่ยนเป็น getAllEventsForAdmin
router.patch('/:id/status', authCheck, eventController.updateEventStatus); // แก้ไข path
router.get('/pending', authCheck, eventController.getPendingEvents); // แก้ไข path

module.exports = router;