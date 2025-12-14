import TicketDao from "../dao/ticket.dao.js";

const generateUniqueCode = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 7).toUpperCase()
  );
};

class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createNewTicket(totalAmount, purchaserEmail, purchasedProducts) {
    const ticketData = {
      code: generateUniqueCode(),
      amount: totalAmount,
      purchaser: purchaserEmail,
      products: purchasedProducts,
    };

    return this.dao.createTicket(ticketData);
  }
}

export const ticketRepository = new TicketRepository(TicketDao);
