const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ShiftExchangeService {
  /**
   * Create a new shift exchange request
   * @param {Object} data
   * @param {number} data.shiftFK_id
   * @param {number} data.requester_id
   * @param {number} data.accepter_id
   */
  static async requestExchange(data) {
    const { shiftFK_id, requester_id, accepter_id } = data;

    // Validate that shift exists
    const shiftExists = await prisma.shift.findUnique({ where: { shift_id: shiftFK_id } });
    if (!shiftExists) throw new Error('Shift not found');

    // Validate requester and accepter exist
    const [requesterExists, accepterExists] = await Promise.all([
      prisma.studentAssistant.findUnique({ where: { stud_Assistance_id: requester_id } }),
      prisma.studentAssistant.findUnique({ where: { stud_Assistance_id: accepter_id } }),
    ]);

    if (!requesterExists) throw new Error('Requester not found');
    if (!accepterExists) throw new Error('Accepter not found');

    // Prevent requester from sending request to self
    if (requester_id === accepter_id) throw new Error('Requester and accepter cannot be the same');

    // Create new exchange
    const newExchange = await prisma.shiftExchange.create({
      data: {
        shiftFK_id,
        requester_id,
        accepter_id,
        shift_Exchange_status: 'PENDING',
      },
      include: {
        shifts: true,
        requester: true,
        accepter: true,
      },
    });

    return newExchange;
  }

  /**
   * List all shift exchanges with related data
   */
  static async listAll() {
    return await prisma.shiftExchange.findMany({
      include: {
        shifts: true,
        requester: true,
        accepter: true,
        administrator: true,
      },
      orderBy: { created_Date: 'desc' },
    });
  }

  /**
   * Respond to a shift exchange request
   * @param {number} exchange_id
   * @param {string} status - ACCEPTED or REJECTED
   * @param {number} admin_id
   */
  static async respondToExchange(exchange_id, status, admin_id) {
    const validStatuses = ['ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) throw new Error('Invalid status');

    // Ensure exchange exists and is pending
    const exchange = await prisma.shiftExchange.findUnique({ where: { exchange_id } });
    if (!exchange || exchange.shift_Exchange_status !== 'PENDING') return null;

    // Validate admin exists
    const adminExists = await prisma.administrator.findUnique({ where: { admin_id } });
    if (!adminExists) throw new Error('Admin not found');

    // Update exchange
    const updatedExchange = await prisma.shiftExchange.update({
      where: { exchange_id },
      data: {
        shift_Exchange_status: status,
        reviewed_by: admin_id,
      },
      include: {
        shifts: true,
        requester: true,
        accepter: true,
        administrator: true,
      },
    });

    return updatedExchange;
  }
}

module.exports = ShiftExchangeService;
