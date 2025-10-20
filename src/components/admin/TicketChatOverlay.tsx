import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Spinner,
  Chip,
  Card,
  CardBody
} from '@heroui/react';
import { FiSend, FiX, FiMessageSquare, FiUser, FiShield, FiCheckCircle } from 'react-icons/fi';
import { adminAPI, AdminTicket, TicketMessage } from '@/api/adminApi';
import { toast } from 'react-toastify';

interface TicketChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: AdminTicket | null;
  onTicketUpdate?: () => void;
}

const TicketChatOverlay = ({ isOpen, onClose, ticket, onTicketUpdate }: TicketChatOverlayProps) => {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<AdminTicket | null>(ticket);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && ticket) {
      loadTicketData();
      loadMessages();
    }
  }, [isOpen, ticket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTicketData = async () => {
    if (!ticket) return;

    try {
      const details = await adminAPI.getTicketById(ticket.id);
      setTicketDetails(details);
    } catch (error) {
      console.error('Failed to load ticket details:', error);
    }
  };

  const loadMessages = async () => {
    if (!ticket) return;

    setLoading(true);
    try {
      const msgs = await adminAPI.getTicketMessages(ticket.id);
      console.log('Received messages from backend:', msgs);
      console.log('First message sample:', msgs[0]);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load ticket messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!ticket || !replyText.trim()) return;

    setSending(true);
    try {
      await adminAPI.replyToTicket(ticket.id, replyText.trim());
      toast.success('Reply sent successfully');
      setReplyText('');
      await loadMessages(); // Reload messages to show the new reply
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;

    if (!confirm('Are you sure you want to close this ticket?')) return;

    try {
      await adminAPI.closeTicket(ticket.id);
      toast.success('Ticket closed successfully');
      await loadTicketData();
      if (onTicketUpdate) onTicketUpdate();
    } catch (error: any) {
      console.error('Failed to close ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to close ticket');
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

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const renderMessage = (message: TicketMessage) => {
    const isCustomer = !message.fromStaff;

    // Determine sender name based on available fields
    let senderName: string;
    let senderRole: string;

    if (message.adminName) {
      senderName = 'Administration'; // Hide admin username
      senderRole = 'ADMIN';
    } else if (message.staffName) {
      senderName = message.staffName;
      senderRole = 'STAFF';
    } else if (message.customerName) {
      senderName = message.customerName;
      senderRole = 'CUSTOMER';
    } else {
      senderName = 'Unknown';
      senderRole = 'UNKNOWN';
    }

    return (
      <div
        key={message.id}
        className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`flex gap-2 max-w-[70%] ${isCustomer ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isCustomer 
              ? 'bg-purple-200/40 text-purple-600' 
              : 'bg-success/20 text-success'
          }`}>
            {isCustomer ? <FiUser className="text-lg" /> : <FiShield className="text-lg" />}
          </div>

          {/* Message Content */}
          <div className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
            <div className={`rounded-2xl px-4 py-3 ${
              isCustomer 
                ? 'bg-gradient-to-br from-purple-100/80 to-purple-50/60 text-purple-900' 
                : 'bg-gradient-to-br from-success/80 to-success/60 text-white'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold opacity-90">
                  {senderName}
                </span>
                <Chip
                  size="sm"
                  variant="flat"
                  className={`text-[10px] h-4 ${
                    isCustomer 
                      ? 'bg-purple-200/50 text-purple-700' 
                      : 'bg-white/30 text-white'
                  }`}
                >
                  {senderRole}
                </Chip>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <span className="text-xs text-default-400 mt-1 px-2">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (!ticket || !ticketDetails) return null;

  const isClosed = ticketDetails.status === 'CLOSED';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.15,
              ease: "easeIn",
            },
          },
        },
      }}
      classNames={{
        base: "bg-white/50 backdrop-blur-md",
        backdrop: "bg-black/50 backdrop-blur-md",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {/* Header */}
            <ModalHeader className="flex flex-col gap-1 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMessageSquare className="text-primary text-xl" />
                    <h3 className="text-xl font-bold text-foreground">
                      {ticketDetails.subject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-default-600">
                    <span>Ticket #{ticketDetails.id}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <FiUser className="text-xs" />
                      <span>{ticketDetails.customerName || ticketDetails.customer?.username || 'Unknown'}</span>
                    </div>
                    {ticketDetails.assignedStaffName && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FiShield className="text-xs" />
                          <span>Assigned to: {ticketDetails.assignedStaffName}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Chip color={getStatusColor(ticketDetails.status)} variant="flat" size="sm">
                      {ticketDetails.status.replace('_', ' ')}
                    </Chip>
                    <Chip color={getPriorityColor(ticketDetails.priority)} variant="flat" size="sm">
                      {ticketDetails.priority} Priority
                    </Chip>
                    {isClosed && ticketDetails.closedAt && (
                      <Chip color="default" variant="flat" size="sm" startContent={<FiCheckCircle />}>
                        Closed {new Date(ticketDetails.closedAt).toLocaleDateString()}
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
            </ModalHeader>

            {/* Messages Body */}
            <ModalBody className="py-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" label="Loading messages..." />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <FiMessageSquare className="text-6xl text-default-300 mb-4" />
                  <p className="text-default-500">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex flex-col gap-3 border-t border-default-200 pt-4">
              {!isClosed ? (
                <>
                  {/* Reply Input */}
                  <div className="flex gap-2 w-full">
                    <Textarea
                      placeholder="Type your reply as Administration..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      minRows={2}
                      maxRows={4}
                      className="flex-1"
                      classNames={{
                        input: "text-foreground placeholder:text-default-400",
                        inputWrapper: "bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl hover:bg-white/50 focus-within:bg-white/50 transition-all duration-300 data-[hover=true]:bg-white/50",
                        base: "bg-transparent"
                      }}
                      disabled={sending}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />
                    <Button
                      color="success"
                      isIconOnly
                      className="h-auto backdrop-blur-md bg-success/80 hover:bg-success/90"
                      onPress={handleSendReply}
                      isLoading={sending}
                      isDisabled={!replyText.trim() || sending}
                    >
                      {!sending && <FiSend />}
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center w-full">
                    <Button
                      color="default"
                      variant="flat"
                      startContent={<FiX />}
                      onPress={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      color="warning"
                      variant="flat"
                      startContent={<FiCheckCircle />}
                      onPress={handleCloseTicket}
                    >
                      Close Ticket
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <Card className="bg-warning/10 border-warning/30">
                    <CardBody className="py-3">
                      <div className="flex items-center gap-2 text-warning">
                        <FiCheckCircle />
                        <span className="font-medium">This ticket is closed</span>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="flex justify-end mt-3">
                    <Button
                      color="default"
                      variant="flat"
                      startContent={<FiX />}
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TicketChatOverlay;
