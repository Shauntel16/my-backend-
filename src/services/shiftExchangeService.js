const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ShiftExchangeService {
  static async requestExchange(data) {
    const { shiftFK_id, requester_id, accepter_id } = data;

    const newExchange = await prisma.shiftExchange.create({
      data: {
        shiftFK_id,
        requester_id,
        accepter_id,
        // shift_Exchange_status defaults to PENDING
      },
    });

    return newExchange;
  }

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

  static async respondToExchange(exchange_id, status, admin_id) {
    // Validate status is ACCEPTED or REJECTED
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new Error('Invalid status');
    }

    // Check if exchange exists and is pending
    const exchange = await prisma.shiftExchange.findUnique({
      where: { exchange_id },
    });

    if (!exchange || exchange.shift_Exchange_status !== 'PENDING') {
      return null;
    }

    // Update the exchange status and reviewed_by
    const updatedExchange = await prisma.shiftExchange.update({
      where: { exchange_id },
      data: {
        shift_Exchange_status: status,
        reviewed_by: admin_id,
      },
    });

    return updatedExchange;
  }
}

module.exports = ShiftExchangeService;
