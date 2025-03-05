const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllEvents = async (req, res) => {
  try {
    // ดึงเฉพาะ events ที่ approved แล้ว
    const events = await prisma.events.findMany({
      where: {
        status: 'APPROVED',
        isApproved: true
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        eventDate: 'asc'
      }
    });
      // จัดรูปแบบข้อมูลโดยใช้แค่ eventType
      const formattedEvents = events.map(event => ({
        ...event,
        eventType: event.eventType || 'ไม่ระบุประเภท',
        user: event.user?.username || 'ไม่ระบุผู้จัด'
      }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({ 
      message: 'ไม่สามารถดึงข้อมูล events ได้', 
      error: error.message 
    });
  }
};

// back-end/controllers/event-controller.js 
const createEvent = async (req, res) => {
    try {
        const { 
            userId,         // Required
            eventTitle,     // Required
            description,    // Required 
            eventDate,      // Required
            location,       // Required
            tickets, // รับ tickets เป็น array
            eventType,
            eventBanner,
            endTime,
            eventCategories    
        } = req.body;

        // Validate required fields
        if (!userId || !eventTitle || !description || !eventDate || !location || !tickets || !eventBanner) {
            return res.status(400).json({ 
                error: "Missing required fields" 
            });
        }

         
    const newEvent = await prisma.events.create({
        data: {
          userId,
          eventTitle,
          description,
          eventDate: new Date(eventDate),
          location,
          eventType,
          eventBanner,
          endTime,
          eventCategories,
          tickets: JSON.stringify(tickets)
        }
      });
      
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
const updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status, statusMessage } = req.body;
  
  try {
    const event = await prisma.events.update({
      where: { id: parseInt(id) },
      data: {
        status,
        statusMessage,
        isApproved: status === 'APPROVED'
      }
    });
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event status', error: error.message });
  }
};

const getPendingEvents = async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'  // เพิ่มการเรียงลำดับตามวันที่สร้าง
      }
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching pending events:', error);
    res.status(500).json({ 
      message: 'Error fetching pending events', 
      error: error.message 
    });
  }
};

const getUserEvents = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await prisma.events.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล events ได้' });
  }
};

const getAllEventsForAdmin = async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ 
      message: 'ไม่สามารถดึงข้อมูล events ทั้งหมดได้',
      error: error.message 
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    console.log('Attempting to delete event:', id, 'by user:', userId); // เพิ่ม logging

    const event = await prisma.events.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId)
      }
    });

    if (!event) {
      console.log('Event not found or unauthorized');
      return res.status(404).json({ 
        message: 'ไม่พบ Event ที่ต้องการลบ หรือคุณไม่มีสิทธิ์ลบ Event นี้' 
      });
    }

    await prisma.events.delete({
      where: { 
        id: parseInt(id) 
      }
    });

    console.log('Event deleted successfully');
    res.status(200).json({ message: 'ลบ Event เรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการลบ Event', 
      error: error.message 
    });
  }
};

module.exports = {
    getAllEvents,
    createEvent,
    updateEventStatus,
    getPendingEvents,
    getUserEvents,
    getAllEventsForAdmin,
    deleteEvent
};