const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.attendance.deleteMany();
  await prisma.shiftExchange.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.libraryClosure.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.studentAssistant.deleteMany();
  await prisma.administrator.deleteMany();
  await prisma.location.deleteMany();

  console.log('✅ Cleared existing data');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Locations
  const locations = await Promise.all([
    prisma.location.create({
      data: { name: 'Main Library' }
    }),
    prisma.location.create({
      data: { name: 'Science Library' }
    }),
    prisma.location.create({
      data: { name: 'Law Library' }
    })
  ]);

  console.log('✅ Created locations');

  // Create Administrator
  const admin = await prisma.administrator.create({
    data: {
      name: 'John Admin',
      email: 'admin@tut.ac.za',
      password: hashedPassword
    }
  });

  console.log('✅ Created administrator');

  // Create Student Assistants
  const students = await Promise.all([
    prisma.studentAssistant.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@tut4life.ac.za',
        password: hashedPassword,
        phone: '+27123456789',
        createdBy: admin.admin_id,
        location_id: locations[0].location_id,
        status: 'ACTIVE'
      }
    }),
    prisma.studentAssistant.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@tut4life.ac.za',
        password: hashedPassword,
        phone: '+27123456790',
        createdBy: admin.admin_id,
        location_id: locations[0].location_id,
        status: 'ACTIVE'
      }
    }),
    prisma.studentAssistant.create({
      data: {
        name: 'Carol Williams',
        email: 'carol@tut4life.ac.za',
        password: hashedPassword,
        phone: '+27123456791',
        createdBy: admin.admin_id,
        location_id: locations[1].location_id,
        status: 'ACTIVE'
      }
    }),
    prisma.studentAssistant.create({
      data: {
        name: 'David Brown',
        email: 'david@tut4life.ac.za',
        password: hashedPassword,
        phone: '+27123456792',
        createdBy: admin.admin_id,
        location_id: locations[2].location_id,
        status: 'DEACTIVATED'
      }
    })
  ]);

  console.log('✅ Created student assistants');

  // Create Schedules
  const schedules = await Promise.all([
    prisma.schedule.create({
      data: {
        reviewed_by: admin.admin_id,
        loc_id: locations[0].location_id,
        month_start: new Date('2025-10-01'),
        month_end: new Date('2025-10-31')
      }
    }),
    prisma.schedule.create({
      data: {
        reviewed_by: admin.admin_id,
        loc_id: locations[1].location_id,
        month_start: new Date('2025-10-01'),
        month_end: new Date('2025-10-31')
      }
    })
  ]);

  console.log('✅ Created schedules');

  // Create Shifts
  const shifts = await Promise.all([
    // Today's shifts
    prisma.shift.create({
      data: {
        studAssi_id: students[0].stud_Assistance_id,
        sched_id: schedules[0].schedule_id,
        shift_date: new Date('2025-10-28'),
        start_time: new Date('2025-10-28T08:00:00'),
        end_time: new Date('2025-10-28T12:00:00'),
        shift_Status: 'ACTIVE'
      }
    }),
    prisma.shift.create({
      data: {
        studAssi_id: students[1].stud_Assistance_id,
        sched_id: schedules[0].schedule_id,
        shift_date: new Date('2025-10-28'),
        start_time: new Date('2025-10-28T12:00:00'),
        end_time: new Date('2025-10-28T16:00:00'),
        shift_Status: 'ACTIVE'
      }
    }),
    // Tomorrow's shifts
    prisma.shift.create({
      data: {
        studAssi_id: students[0].stud_Assistance_id,
        sched_id: schedules[0].schedule_id,
        shift_date: new Date('2025-10-29'),
        start_time: new Date('2025-10-29T08:00:00'),
        end_time: new Date('2025-10-29T12:00:00'),
        shift_Status: 'ACTIVE'
      }
    }),
    prisma.shift.create({
      data: {
        studAssi_id: students[2].stud_Assistance_id,
        sched_id: schedules[1].schedule_id,
        shift_date: new Date('2025-10-29'),
        start_time: new Date('2025-10-29T13:00:00'),
        end_time: new Date('2025-10-29T17:00:00'),
        shift_Status: 'ACTIVE'
      }
    }),
    // Past shift
    prisma.shift.create({
      data: {
        studAssi_id: students[0].stud_Assistance_id,
        sched_id: schedules[0].schedule_id,
        shift_date: new Date('2025-10-25'),
        start_time: new Date('2025-10-25T08:00:00'),
        end_time: new Date('2025-10-25T12:00:00'),
        shift_Status: 'ACTIVE'
      }
    })
  ]);

  console.log('✅ Created shifts');

  // Create Attendance Records
  await prisma.attendance.create({
    data: {
      studAssi_id: students[0].stud_Assistance_id,
      shiftFK_id: shifts[4].shift_id, // Past shift
      work_date: new Date('2025-10-25'),
      check_in_time: new Date('2025-10-25T08:05:00'),
      check_out_time: new Date('2025-10-25T12:02:00'),
      hours_worked: 3.95,
      attendance_Status: 'ACTIVE'
    }
  });

  console.log('✅ Created attendance records');

  // Create Leave Requests
  await Promise.all([
    prisma.leaveRequest.create({
      data: {
        studAssi_id: students[0].stud_Assistance_id,
        reviewed_by: admin.admin_id,
        reason: 'Medical appointment',
        start_Date: new Date('2025-11-01'),
        end_date: new Date('2025-11-01'),
        leave_type: 'SICK',
        isGranted: 'PENDING'
      }
    }),
    prisma.leaveRequest.create({
      data: {
        studAssi_id: students[1].stud_Assistance_id,
        reviewed_by: admin.admin_id,
        reason: 'Family emergency',
        start_Date: new Date('2025-10-30'),
        end_date: new Date('2025-10-31'),
        leave_type: 'FAMILY_RESPONSIBILITY',
        isGranted: 'APPROVED',
        reviewed_at: new Date('2025-10-27T10:00:00')
      }
    }),
    prisma.leaveRequest.create({
      data: {
        studAssi_id: students[2].stud_Assistance_id,
        reviewed_by: admin.admin_id,
        reason: 'Not feeling well',
        start_Date: new Date('2025-10-20'),
        end_date: new Date('2025-10-21'),
        leave_type: 'SICK',
        isGranted: 'DECLINED',
        reviewed_at: new Date('2025-10-19T14:30:00')
      }
    })
  ]);

  console.log('✅ Created leave requests');

  // Create Shift Exchanges
  await Promise.all([
    prisma.shiftExchange.create({
      data: {
        shiftFK_id: shifts[2].shift_id, // Tomorrow's shift
        requester_id: students[0].stud_Assistance_id,
        accepter_id: students[1].stud_Assistance_id,
        reviewed_by: admin.admin_id,
        shift_Exchange_status: 'ACCEPTED'
      }
    }),
    prisma.shiftExchange.create({
      data: {
        shiftFK_id: shifts[1].shift_id, // Today's shift
        requester_id: students[1].stud_Assistance_id,
        shift_Exchange_status: 'PENDING'
      }
    })
  ]);

  console.log('✅ Created shift exchanges');

  // Create Library Closures
  await Promise.all([
    prisma.libraryClosure.create({
      data: {
        reviewed_by: admin.admin_id,
        loc_id: locations[0].location_id,
        closure_date: new Date('2025-12-25'),
        reason: 'Christmas Day'
      }
    }),
    prisma.libraryClosure.create({
      data: {
        reviewed_by: admin.admin_id,
        loc_id: locations[1].location_id,
        closure_date: new Date('2025-12-26'),
        reason: 'Day of Goodwill'
      }
    })
  ]);

    console.log('✅ Created library closures');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });