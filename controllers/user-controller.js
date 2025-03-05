const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



exports.getAllUsers = async (req, res, next) => {
    try {

        const users = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        events: true
                    }
                }
            }
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            eventCount: user._count.events
        }));

        res.status(200).json(formattedUsers);

    } catch (error) {
        console.error('Error fetching users ไม่ให้ดูจ่ะ:', error);

        next(error)
    }
}

exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    
    try {
      const updatedUser = await prisma.users.update({
        where: { id: parseInt(id) },
        data: { role },
        select: {
          id: true,
          username: true,
          email: true,
          role: true
        }
      });
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
  };



exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        await prisma.users.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
        next(error);
    }
}


exports.getUserEvents = async (req, res) => {
    const { id } = req.params;
    const requestingUserId = req.user.id;
    
    try {
        if (parseInt(id) !== requestingUserId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ 
              message: 'คุณสามารถดูได้เฉพาะ events ของคุณเท่านั้น' 
            });
          }
      const events = await prisma.events.findMany({
        where: {
          userId: parseInt(id)
        },
        include: {
          users: {
            select: {
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
      console.error('Error fetching user events:', error);
      res.status(500).json({ 
        message: 'Error fetching user events', 
        error: error.message 
      });
    }
  };

// const getProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await prisma.users.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         profileImage: true,
//         role: true
//       }
//     });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching profile' });
//   }
// };

// const updateProfileImage = async (req, res) => {
//   try {
//     const { imageUrl } = req.body;
//     const userId = req.user.id;

//     if (!imageUrl) {
//       return res.status(400).json({ message: 'กรุณาอัพโหลดรูปภาพ' });
//     }

//     const updatedUser = await prisma.users.update({
//       where: { id: userId },
//       data: {
//         profileImage: imageUrl
//       }
//     });

//     res.json({
//       message: 'อัพเดทรูปโปรไฟล์สำเร็จ',
//       profileImage: updatedUser.profileImage
//     });
    
//   } catch (error) {
//     console.error('Update profile image error:', error);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพเดทรูปโปรไฟล์' });
//   }
// };

// ส่งออก functions ทั้งหมดที่ต้องการใช้
// module.exports = {
  // updateProfileImage,
  // getProfile
// };