import TicketModel from './models/ticket.model.js';

class TicketDao {
    async createTicket(ticketData) {
        return TicketModel.create(ticketData);
    }
}

export default new TicketDao();