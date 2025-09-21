import { Ticket } from '@/types';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Button,
  Tooltip
} from '@heroui/react';
import { FiUser, FiClock, FiMessageSquare, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

interface TicketsListProps {
  tickets: Ticket[];
  onTicketSelect: (ticket: Ticket) => void;
  getStatusColor: (status: string) => "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const TicketsList = ({ tickets, onTicketSelect, getStatusColor }: TicketsListProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getMessageCount = (ticket: Ticket) => {
    return ticket.messages?.length || 0;
  };

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiMessageSquare className="text-6xl text-default-300 mb-4" />
        <h3 className="text-xl font-semibold text-default-600 mb-2">No Tickets Found</h3>
        <p className="text-default-400">There are no tickets matching your current filter.</p>
      </div>
    );
  }

  return (
    <Table aria-label="Tickets table" removeWrapper>
      <TableHeader>
        <TableColumn>TICKET</TableColumn>
        <TableColumn>CUSTOMER</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>ASSIGNED TO</TableColumn>
        <TableColumn>MESSAGES</TableColumn>
        <TableColumn>CREATED</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>
              <div className="flex flex-col">
                <p className="font-semibold text-sm">{ticket.subject}</p>
                <p className="text-xs text-default-500">#{ticket.id}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar
                  icon={<FiUser />}
                  size="sm"
                  className="bg-primary/10 text-primary"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{ticket.customer?.username || ticket.customerName || 'Unknown Customer'}</p>
                  <p className="text-xs text-default-500">ID: {ticket.customer?.id || 'N/A'}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Chip
                color={getStatusColor(ticket.status)}
                variant="flat"
                size="sm"
              >
                {ticket.status.replace('_', ' ')}
              </Chip>
            </TableCell>
            <TableCell>
              {ticket.staff || ticket.assignedStaffName ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    icon={<FiUser />}
                    size="sm"
                    className="bg-success/10 text-success"
                  />
                  <span className="text-sm">{ticket.staff?.username || ticket.assignedStaffName || 'Assigned Staff'}</span>
                </div>
              ) : (
                <Chip variant="flat" color="warning" size="sm">
                  Unassigned
                </Chip>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <FiMessageSquare className="text-default-400" />
                <span className="text-sm">{getMessageCount(ticket)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <FiClock className="text-default-400" />
                <span className="text-sm">{formatDate(ticket.createdAt)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Tooltip content="View Details">
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  onPress={() => onTicketSelect(ticket)}
                >
                  <FiEye />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketsList;
