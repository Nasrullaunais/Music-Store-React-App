import { useState, useEffect, useRef } from 'react';
import { Ticket, TicketMessage } from '@/types';
import { staffTicketAPI } from '@/api/ticketsApi.ts';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Avatar,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  Spinner
} from '@heroui/react';
import {
  FiUser,
  FiClock,
  FiSend,
  FiUserCheck,
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

interface TicketDetailsModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TicketDetailsModal = ({ ticket, isOpen, onClose, onUpdate }: TicketDetailsModalProps) => {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && ticket) {
      loadMessages();
    }
  }, [isOpen, ticket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const ticketMessages = await staffTicketAPI.getTicketMessages(ticket.id);
      setMessages(ticketMessages);

      // Debug: Log ticket and message data
      console.log('Ticket details loaded:', {
        ticketId: ticket.id,
        customer: ticket.customer,
        messagesCount: ticketMessages.length,
        sampleMessage: ticketMessages[0]
      });
    } catch (error) {
      toast.error('Failed to load ticket messages');
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const sentMessage = await staffTicketAPI.replyToTicket(ticket.id, newMessage);
      setNewMessage('');

      // Add the new message immediately to provide instant feedback
      setMessages(prevMessages => [...prevMessages, sentMessage]);

      // Reload messages to ensure we have the complete conversation
      await loadMessages();

      toast.success('Message sent successfully');
    } catch (error: any) {
      console.error('Failed to send message - Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data
      });
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleAssignTicket = async () => {
    setUpdating(true);
    try {
      await staffTicketAPI.assignTicket(ticket.id);
      toast.success('Ticket assigned to you');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to assign ticket - Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        headers: error.config?.headers
      });

      // Log the complete error response data
      if (error.response?.data) {
        console.error('Backend error response:', error.response.data);
      }

      toast.error(`Failed to assign ticket: ${error.response?.data?.message || error.response?.data?.error || error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (value: string) => {
    setUpdating(true);
    try {
      await staffTicketAPI.updateTicketStatus(ticket.id, value);
      toast.success(`Ticket status updated to ${value}`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update ticket status');
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseTicket = async () => {
    setUpdating(true);
    try {
      await staffTicketAPI.closeTicket(ticket.id);
      toast.success('Ticket closed successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to close ticket');
      console.error('Failed to close ticket:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
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

  const statusOptions = [
    { key: 'OPEN', label: 'Open' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'URGENT', label: 'Urgent' },
    { key: 'CLOSED', label: 'Closed' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{ticket.subject}</h3>
              <p className="text-sm text-default-500">Ticket #{ticket.id}</p>
            </div>
            <Chip
              color={getStatusColor(ticket.status)}
              variant="flat"
            >
              {ticket.status.replace('_', ' ')}
            </Chip>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Ticket Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardBody className="p-4">
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="flex items-center gap-3">
                  <Avatar
                    icon={<FiUser />}
                    className="bg-primary/10 text-primary"
                  />
                  <div>
                    <p className="font-medium">{ticket.customer?.username || ticket.customerName || 'Unknown Customer'}</p>
                    <p className="text-sm text-default-500">Email: {ticket.customer?.email || 'N/A'}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardBody className="p-4">
                <h4 className="font-semibold mb-2">Ticket Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-default-400" />
                    <span className="text-sm">Created: {formatDate(ticket.createdAt)}</span>
                  </div>
                  {(ticket.staff || ticket.assignedStaffName) && (
                    <div className="flex items-center gap-2">
                      <FiUserCheck className="text-success" />
                      <span className="text-sm">Assigned to: {ticket.staff?.username || ticket.assignedStaffName || 'Staff Member'}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Messages */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">Conversation</h4>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => {
                  // Prefer unified sender object when available, then fall back to legacy fields
                  const isStaffMessage = (message.sender?.role === 'STAFF') || !!message.staff || !!message.isFromStaff;

                  // Prefer sender.id for ownership check; fall back to staff/customer ids
                  const senderId = message.sender?.id ?? (message.staff?.id ?? message.customer?.id);
                  const isOwnMessage = !!user && senderId === user.id;

                  const containerJustify = isOwnMessage ? 'justify-end' : 'justify-start';
                  const bubbleClasses = isOwnMessage
                    ? 'max-w-[70%] p-4 rounded-lg bg-primary/10 text-primary-foreground'
                    : 'max-w-[70%] p-4 rounded-lg bg-default-100';

                  const displayName = isOwnMessage
                    ? 'You'
                    : (message.sender?.username || (isStaffMessage ? (message.staff?.username || 'Staff Member') : (message.customer?.username || 'Customer')));

                  return (
                    <div key={message.id} className={`flex ${containerJustify}`}>
                      {/* Avatar on left for others */}
                      {!isOwnMessage && (
                        <div className="mr-3 flex items-start">
                          <Avatar
                            icon={<FiUser />}
                            size="sm"
                            className={isStaffMessage ? 'bg-primary/20 text-primary' : 'bg-default-200 text-default-600'}
                          />
                        </div>
                      )}

                      <div className={bubbleClasses} aria-label={`${displayName} message`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">{displayName}</span>
                          <span className="text-xs text-default-500">{formatDate(message.timestamp)}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {/* Avatar on right for own messages */}
                      {isOwnMessage && (
                        <div className="ml-3 flex items-start">
                          <Avatar
                            icon={<FiUser />}
                            size="sm"
                            className="bg-primary/40 text-primary-inverse"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Reply Section */}
          {ticket.status !== 'CLOSED' && (
            <div>
              <h4 className="font-semibold mb-4">Send Reply</h4>
              <Textarea
                placeholder="Type your response to the customer..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                minRows={3}
                maxRows={6}
                className="mb-4"
              />
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            {!ticket.staff && !ticket.assignedStaffName && (
              <Button
                color="success"
                variant="flat"
                startContent={<FiUserCheck />}
                onPress={handleAssignTicket}
                isLoading={updating}
              >
                Assign to Me
              </Button>
            )}

            <Select
              placeholder="Change Status"
              aria-label="Change ticket status"
              className="w-40"
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                if (selectedKey) handleStatusChange(selectedKey);
              }}
              isDisabled={updating}
            >
              {statusOptions.map((status) => (
                <SelectItem key={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>

            {ticket.status !== 'CLOSED' && (
              <Button
                color="warning"
                variant="flat"
                startContent={<FiCheckCircle />}
                onPress={handleCloseTicket}
                isLoading={updating}
              >
                Close Ticket
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="light"
              onPress={onClose}
              startContent={<FiX />}
            >
              Close
            </Button>

            {ticket.status !== 'CLOSED' && (
              <Button
                color="primary"
                onPress={handleSendMessage}
                isLoading={sending}
                isDisabled={!newMessage.trim()}
                startContent={<FiSend />}
              >
                Send Reply
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TicketDetailsModal;
