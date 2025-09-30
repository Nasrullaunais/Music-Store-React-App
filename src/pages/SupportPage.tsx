import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardBody, CardHeader, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip, Divider, ScrollShadow } from '@heroui/react';
import { FiPlus, FiSend, FiMessageCircle, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { ticketAPI } from '../api/ticketsApi.ts';
import { Ticket, TicketMessage } from '@/types';
import { useAuth } from '@/context/AuthContext';

const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [createTicketForm, setCreateTicketForm] = useState({ subject: '', description: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Load tickets on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Load messages when ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      loadTicketMessages(selectedTicket.id);
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await ticketAPI.getCustomerTickets();
      console.log('Loaded tickets:', ticketsData);
      setTickets(ticketsData);
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketMessages = async (ticketId: number) => {
    try {
      setLoadingMessages(true);
      const ticketMessages = await ticketAPI.getTicketMessages(ticketId);
      console.log('Loaded messages for ticket', ticketId, ':', ticketMessages);
      setMessages(ticketMessages || []);
    } catch (error) {
      toast.error('Failed to load ticket messages');
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!createTicketForm.subject.trim() || !createTicketForm.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const newTicket = await ticketAPI.createTicket(createTicketForm);
      // Ensure messages array exists
      const ticketWithMessages = {
        ...newTicket,
        messages: newTicket.messages || []
      };
      setTickets([ticketWithMessages, ...tickets]);
      setSelectedTicket(ticketWithMessages);
      setCreateTicketForm({ subject: '', description: '' });
      onClose();
      toast.success('Ticket created successfully!');
    } catch (error) {
      toast.error('Failed to create ticket');
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setLoading(true);
      const message = await ticketAPI.addMessageToTicket(selectedTicket.id, { content: newMessage });

      // Add the new message to the messages state
      setMessages(prevMessages => [...prevMessages, message]);

      // Update the ticket in the tickets list to show the latest message
      setTickets(tickets.map(ticket =>
        ticket.id === selectedTicket.id
          ? { ...ticket, messages: [...(ticket.messages || []), message] }
          : ticket
      ));

      setNewMessage('');
      toast.success('Message sent!');

      // Reload messages to ensure we have the latest state
      await loadTicketMessages(selectedTicket.id);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <FiMessageCircle size={16} />;
      case 'IN_PROGRESS': return <FiClock size={16} />;
      case 'URGENT': return <FiAlertCircle size={16} />;
      case 'CLOSED': return <FiCheckCircle size={16} />;
      default: return <FiMessageCircle size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">

        {/* Tickets List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center p-4">
              <h2 className="text-xl font-bold text-indigo-950 dark:text-indigo-50">Support Tickets</h2>
              <Button
                color="primary"
                startContent={<FiPlus />}
                onPress={onOpen}
                className="bg-indigo-600 hover:bg-indigo-700"
                size="sm"
              >
                New Ticket
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ScrollShadow className="h-full">
                {loading && tickets.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <FiMessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No tickets yet</p>
                    <p className="text-sm">Create your first support ticket to get help</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {tickets.map((ticket) => (
                      <Card
                        key={ticket.id}
                        isPressable
                        onPress={() => setSelectedTicket(ticket)}
                        className={`cursor-pointer transition-all ${
                          selectedTicket?.id === ticket.id
                            ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <CardBody className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm truncate flex-1 mr-2">
                              {ticket.subject}
                            </h3>
                            <Chip
                              size="sm"
                              color={getStatusColor(ticket.status)}
                              variant="flat"
                              startContent={getStatusIcon(ticket.status)}
                            >
                              {ticket.status}
                            </Chip>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>#{ticket.id}</span>
                            <span>•</span>
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                          {(ticket.messages && ticket.messages.length > 0) && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              {ticket.messages[ticket.messages.length - 1].content}
                            </p>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollShadow>
            </CardBody>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
                <CardHeader className="p-4 border-b">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-50">
                        {selectedTicket.subject}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Ticket #{selectedTicket.id}</span>
                        <span>•</span>
                        <span>Created {formatDate(selectedTicket.createdAt)}</span>
                        {(selectedTicket.staff || selectedTicket.assignedStaffName) && (
                          <>
                            <span>•</span>
                            <span>Assigned to {selectedTicket.staff?.username || selectedTicket.assignedStaffName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Chip
                      color={getStatusColor(selectedTicket.status)}
                      variant="flat"
                      startContent={getStatusIcon(selectedTicket.status)}
                    >
                      {selectedTicket.status}
                    </Chip>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardBody className="flex-1 p-0 overflow-hidden">
                  <ScrollShadow className="h-full p-4">
                    {loadingMessages ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">Loading messages...</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <FiMessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation by sending a message</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          // Determine sender type robustly:
                          // 1) prefer `message.sender.role` if present
                          // 2) fall back to explicit staff/customer objects
                          // 3) fall back to isFromStaff flag
                          const senderRoleIsStaff = message.sender?.role === 'STAFF';
                          const isStaffMessage = senderRoleIsStaff || !!message.staff || !!message.isFromStaff;

                          // Determine if the message was sent by the currently authenticated user.
                          // Prefer sender.id when available, otherwise compare against staff/customer ids.
                          const senderId = message.sender?.id ?? (message.staff?.id ?? message.customer?.id);
                          const isOwnMessage = !!user && senderId === user.id;

                          // Presentation values
                          const containerJustify = isOwnMessage ? 'justify-end' : 'justify-start';
                          const bubbleClasses = isOwnMessage
                            ? 'bg-indigo-600 text-white rounded-lg p-3 max-w-[70%]'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 max-w-[70%]';
                          // Prefer sender.username when available, then legacy fields
                          const displayName = isOwnMessage
                            ? 'You'
                            : (message.sender?.username || (isStaffMessage ? (message.staff?.username || 'Staff') : (message.customer?.username || 'Customer')));

                          return (
                            <div key={message.id} className={`flex ${containerJustify}`}>
                              {/* Avatar + bubble */}
                              {!isOwnMessage && (
                                <div className="mr-3 flex items-start">
                                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                                    {(displayName || 'U').charAt(0).toUpperCase()
                                  }</div>
                                </div>
                              )}

                              <div className={bubbleClasses} aria-label={`${displayName} message`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium">{displayName}</span>
                                  <span className="text-xs opacity-70">{formatDate(message.timestamp)}</span>
                                </div>
                                <p className="text-sm">{message.content}</p>
                              </div>

                              {isOwnMessage && (
                                <div className="ml-3 flex items-start">
                                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                                    {(displayName || 'U').charAt(0).toUpperCase()
                                  }</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollShadow>
                </CardBody>

                {/* Message Input */}
                {selectedTicket.status !== 'CLOSED' && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        color="primary"
                        isDisabled={!newMessage.trim() || loading}
                        onPress={handleSendMessage}
                        isLoading={loading}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        startContent={!loading && <FiSend />}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <CardBody className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <FiMessageCircle size={64} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select a ticket to view the conversation</h3>
                  <p>Choose a ticket from the list to start chatting with our support team</p>
                </div>
              </CardBody>
            )}
          </Card>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="text-indigo-950 dark:text-indigo-50">
            Create New Support Ticket
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Subject"
                placeholder="Brief description of your issue"
                value={createTicketForm.subject}
                onChange={(e) => setCreateTicketForm({
                  ...createTicketForm,
                  subject: e.target.value
                })}
                maxLength={255}
              />
              <Textarea
                label="Description"
                placeholder="Please provide detailed information about your issue..."
                value={createTicketForm.description}
                onChange={(e) => setCreateTicketForm({
                  ...createTicketForm,
                  description: e.target.value
                })}
                minRows={4}
                maxRows={8}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateTicket}
              isLoading={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Create Ticket
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SupportPage;
