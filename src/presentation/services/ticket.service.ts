import { UuidAdapter } from '../../config/uuid.adapter';
import { Ticket } from '../../domain/interfaces/tickets';

export class TicketService {
  public readonly tickets: Ticket[] = [
    { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
  ];

  private readonly workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk);
  }

  public get lastWorkingOnTickets(): Ticket[] {
    return this.workingOnTickets.splice(0, 4);
  }

  public get lastTicketNumber() {
    return this.tickets.length > 0 ? this.tickets.at(-1)?.number : 0;
  }

  public createTicket(): Ticket {
    const lastNumber = this.lastTicketNumber ?? 0;
    const newTicket: Ticket = {
      id: UuidAdapter.v4(),
      number: lastNumber + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDesk: undefined,
    };

    this.tickets.push(newTicket);
    return newTicket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find((ticket) => !ticket.handleAtDesk);
    if (!ticket)
      return { status: 'error', message: 'No hay tickets pendientes' };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });

    return { status: 'ok', ticket };
  }

  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) return { status: 'error', message: 'Tickets no encontrado' };

    this.tickets.map((ticket) => {
      if (ticket.id === id) {
        ticket.done = true;
      }

      return ticket;
    });

    return { status: 'ok' };
  }
}
