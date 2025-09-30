import { useState, useEffect } from 'react';
import { adminAPI, AdminTicket } from '@/api/adminApi.ts';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Input
} from '@heroui/react';
import {
  FiMessageSquare,
  FiUser,
  FiUserCheck,
  FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const TicketManagement = () => {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [actionType, setActionType] = useState<'assign' | 'status'>('assign');

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadTickets();
  }, [page, statusFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const filterValue = statusFilter === 'all' ? undefined : statusFilter || undefined;
      const response = await adminAPI.getAllTickets(filterValue);
      console.log('Tickets:', response);

      // Response may be either an array of tickets or an object like { content: AdminTicket[], totalElements: number }
      const resAny: any = response;
      let ticketsData: AdminTicket[] = [];
      let totalElements = 0;

      if (Array.isArray(resAny)) {
        ticketsData = resAny;
        totalElements = ticketsData.length;
      } else if (resAny && typeof resAny === 'object') {
        ticketsData = resAny.content || [];
        totalElements = typeof resAny.totalElements === 'number' ? resAny.totalElements : ticketsData.length;
      }

      setTickets(ticketsData);
      // If backend provides totalElements, try to compute total pages assuming a default page size (10).
      const pageSize = 10;
      setTotalPages(Math.max(1, Math.ceil(totalElements / pageSize)));
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error('Tickets loading error:', error);
      setTickets([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTicket = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    setActionType('assign');
    setAssignStaffId('');
    onOpen();
  };

  const handleUpdateStatus = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    setActionType('status');
    setNewStatus(ticket.status);
    onOpen();
  };

  const confirmAction = async () => {
    if (!selectedTicket) return;

    try {
      if (actionType === 'assign' && assignStaffId) {
        await adminAPI.assignTicket(selectedTicket.id, parseInt(assignStaffId));
        toast.success('Ticket assigned successfully');
      } else if (actionType === 'status' && newStatus) {
        await adminAPI.updateTicketStatus(selectedTicket.id, newStatus);
        toast.success('Ticket status updated successfully');
      }

      onClose();
      loadTickets();
    } catch (error) {
      toast.error(`Failed to ${actionType} ticket`);
      console.error(`${actionType} error:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'primary';
      case 'IN_PROGRESS': return 'warning';
      case 'URGENT': return 'danger';
      case 'CLOSED': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'primary';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      if (Number.isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show friendly empty state when not loading and there are no tickets
  if (!loading && tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FiMessageSquare className="text-6xl text-default-300 mb-4" />
        <h3 className="text-xl font-semibold text-default-600 mb-2">No Tickets Found</h3>
        <p className="text-default-400">There are no tickets matching your current filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiMessageSquare />
              Ticket Management
            </h3>
            <div className="flex gap-4">
              <Select
                placeholder="Filter by status"
                selectedKeys={statusFilter ? [statusFilter] : []}
                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string || '')}
                className="max-w-xs"
                aria-label="Filter tickets by status"
              >
                <SelectItem key="all">All Statuses</SelectItem>
                <SelectItem key="OPEN">Open</SelectItem>
                <SelectItem key="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem key="URGENT">Urgent</SelectItem>
                <SelectItem key="CLOSED">Closed</SelectItem>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardBody>
          <Table
            aria-label="Tickets table"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>TICKET</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>ASSIGNED STAFF</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>PRIORITY</TableColumn>
              <TableColumn>CREATED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {(tickets || []).map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium line-clamp-1">{ticket.subject || 'No Subject'}</p>
                      <p className="text-xs text-default-400">ID: {ticket.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-default-400" />
                      <span>{ticket.customerUsername || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedStaffUsername ? (
                      <div className="flex items-center gap-2">
                        <FiUserCheck className="text-success" />
                        <span>{ticket.assignedStaffUsername}</span>
                      </div>
                    ) : (
                      <Chip color="warning" variant="flat" size="sm">
                        Unassigned
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(ticket.status || 'UNKNOWN')} variant="flat" size="sm">
                      {(ticket.status || 'UNKNOWN').toString().replace('_', ' ')}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color={getPriorityColor(ticket.priority || 'LOW')} variant="flat" size="sm">
                      {ticket.priority || 'N/A'}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<FiUserCheck />}
                        onPress={() => handleAssignTicket(ticket)}
                      >
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        color="secondary"
                        variant="flat"
                        startContent={<FiCheckCircle />}
                        onPress={() => handleUpdateStatus(ticket)}
                      >
                        Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {actionType === 'assign' ? (
                <>
                  <FiUserCheck className="text-primary" />
                  Assign Ticket
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-secondary" />
                  Update Status
                </>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedTicket && (
              <div className="space-y-4">
                {/* Ticket Details */}
                <div className="p-4 bg-default-50 rounded-lg">
                  <p className="font-semibold">{selectedTicket.subject}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-default-600">
                    <span>ID: {selectedTicket.id}</span>
                    <span>Customer: {selectedTicket.customerUsername}</span>
                    <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Chip color={getStatusColor(selectedTicket.status)} variant="flat" size="sm">
                      {selectedTicket.status.replace('_', ' ')}
                    </Chip>
                    <Chip color={getPriorityColor(selectedTicket.priority)} variant="flat" size="sm">
                      {selectedTicket.priority}
                    </Chip>
                  </div>
                </div>

                {actionType === 'assign' ? (
                  <Input
                    label="Staff ID"
                    placeholder="Enter staff member ID to assign"
                    value={assignStaffId}
                    onChange={(e) => setAssignStaffId(e.target.value)}
                    type="number"
                  />
                ) : (
                  <Select
                    label="New Status"
                    selectedKeys={[newStatus]}
                    onSelectionChange={(keys) => setNewStatus(Array.from(keys)[0] as string)}
                  >
                    <SelectItem key="OPEN">Open</SelectItem>
                    <SelectItem key="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem key="URGENT">Urgent</SelectItem>
                    <SelectItem key="CLOSED">Closed</SelectItem>
                  </Select>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color={actionType === 'assign' ? 'primary' : 'secondary'}
              onPress={confirmAction}
            >
              {actionType === 'assign' ? 'Assign Ticket' : 'Update Status'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TicketManagement;
