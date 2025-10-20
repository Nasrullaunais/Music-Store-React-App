# Admin Ticket Management API Documentation

## Overview
This feature allows administrators to view and reply to customer support tickets without being assigned to them. Admins have full access to all tickets in the system and can respond to any ticket directly.

**Key Features:**
- View all support tickets in the system
- View individual ticket details and message history
- Reply to any ticket without assignment
- Update ticket status
- Filter tickets by status
- No assignment required - admins can help with any ticket

## Key Differences: Admin vs Staff
- **Staff Members**: Must be assigned to tickets before they can work on them
- **Admins**: Can view and reply to ANY ticket without assignment
- **Assignment**: Admins don't get assigned to tickets; they can jump in and help as needed
- **Flexibility**: Admins can oversee all support operations and provide assistance where needed

---

## API Endpoints

### 1. Get All Tickets

**Endpoint:** `GET /api/admin/tickets`

**Description:** Retrieve all support tickets in the system with optional status filtering.

**Authentication:** Required (Admin role)

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | String | No | Filter by ticket status (OPEN, IN_PROGRESS, URGENT, CLOSED) |

**Example Requests:**
```bash
# Get all tickets
curl -X GET "http://localhost:8080/api/admin/tickets" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get only open tickets
curl -X GET "http://localhost:8080/api/admin/tickets?status=OPEN" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"

# Get urgent tickets
curl -X GET "http://localhost:8080/api/admin/tickets?status=URGENT" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "subject": "Payment Issue",
    "status": "OPEN",
    "customerName": "john_doe",
    "assignedStaffName": null,
    "createdAt": "2025-10-15T10:30:00",
    "closedAt": null
  },
  {
    "id": 2,
    "subject": "Cannot Download Music",
    "status": "IN_PROGRESS",
    "customerName": "jane_smith",
    "assignedStaffName": "support_agent_1",
    "createdAt": "2025-10-14T14:20:00",
    "closedAt": null
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved tickets
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges
- `400 Bad Request` - Invalid status filter value

---

### 2. Get Ticket Details

**Endpoint:** `GET /api/admin/tickets/{ticketId}`

**Description:** Retrieve detailed information about a specific ticket.

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| ticketId | Long | The ID of the ticket to retrieve |

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/admin/tickets/1" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "subject": "Payment Issue",
  "status": "Oclient:755 WebSocket connection to 'ws://localhost:5173/?token=29FwjlG955TU' failed: 
createConnection @ client:755
connect @ client:426
connect @ client:764
connect @ client:279
connect @ client:372
(anonymous) @ client:861
client:768 WebSocket connection to 'ws://localhost:5173/?token=29FwjlG955TU' failed: 
createConnection @ client:768
connect @ client:426
connect @ client:775
client:783 [vite] failed to connect to websocket.
your current setup:
  (browser) localhost:5173/ <--[HTTP]--> localhost:5173/ (server)
  (browser) localhost:5173/ <--[WebSocket (failing)]--> localhost:5173/ (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr .
overrideMethod @ hook.js:608
connect @ client:783
await in connect
connect @ client:279
connect @ client:372
(anonymous) @ client:861
TicketManagement.tsx:60 Tickets: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
TicketManagement.tsx:60 Tickets: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
TicketChatOverlay.tsx:66 Received messages from backend: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
TicketChatOverlay.tsx:67 First message sample: {id: 3, content: 'blah blah blah blah', timestamp: '2025-09-21T21:43:11.099156', ticketId: 7, customerName: 'nasrulla', …}
TicketChatOverlay.tsx:66 Received messages from backend: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]0: {id: 3, content: 'blah blah blah blah', timestamp: '2025-09-21T21:43:11.099156', ticketId: 7, customerName: 'nasrulla', …}1: adminName: nullcontent: "adshasfasjf"customerName: "nasrulla"fromStaff: falseid: 6staffName: nullticketId: 7timestamp: "2025-09-23T11:39:55.454298"[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()2: {id: 9, content: 'what??', timestamp: '2025-10-01T02:29:53.834355', ticketId: 7, customerName: null, …}3: {id: 10, content: 'no', timestamp: '2025-10-01T02:34:53.386119', ticketId: 7, customerName: 'nasrulla', …}4: {id: 11, content: 'lol', timestamp: '2025-10-01T02:35:15.511665', ticketId: 7, customerName: null, …}5: {id: 12, content: 'hii\n', timestamp: '2025-10-01T02:39:06.562816', ticketId: 7, customerName: null, …}6: {id: 17, content: 'jjbjbbj', timestamp: '2025-10-02T12:53:51.483821', ticketId: 7, customerName: null, …}length: 7[[Prototype]]: Array(0)
TicketChatOverlay.tsx:67 First message sample: {id: 3, content: 'blah blah blah blah', timestamp: '2025-09-21T21:43:11.099156', ticketId: 7, customerName: 'nasrulla', …}adminName: nullcontent: "blah blah blah blah"customerName: "nasrulla"fromStaff: falseid: 3staffName: nullticketId: 7timestamp: "2025-09-21T21:43:11.099156"[[Prototype]]: Object
PEN",
  "customerName": "john_doe",
  "assignedStaffName": null,
  "createdAt": "2025-10-15T10:30:00",
  "closedAt": null
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved ticket
- `404 Not Found` - Ticket not found
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges

---

### 3. Get Ticket Messages

**Endpoint:** `GET /api/admin/tickets/{ticketId}/messages`

**Description:** Retrieve all messages in a ticket's conversation history.

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| ticketId | Long | The ID of the ticket |

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/admin/tickets/1/messages" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "content": "I'm having trouble processing my payment",
    "timestamp": "2025-10-15T10:30:00Z",
    "isFromStaff": false,
    "sender": {
      "id": 5,
      "username": "john_doe",
      "role": "CUSTOMER"
    }
  },
  {
    "id": 2,
    "content": "I've checked your account. What payment method are you using?",
    "timestamp": "2025-10-15T11:15:00Z",
    "isFromStaff": true,
    "sender": {
      "id": 2,
      "username": "admin_sarah",
      "role": "ADMIN"
    }
  },
  {
    "id": 3,
    "content": "I'm using a credit card ending in 1234",
    "timestamp": "2025-10-15T11:20:00Z",
    "isFromStaff": false,
    "sender": {
      "id": 5,
      "username": "john_doe",
      "role": "CUSTOMER"
    }
  }
]
```

**Message Fields:**
- `id`: Message ID
- `content`: The message text
- `timestamp`: ISO 8601 UTC timestamp
- `isFromStaff`: true if sent by staff/admin, false if from customer
- `sender`: Information about who sent the message
  - `id`: User ID
  - `username`: Username of the sender
  - `role`: Role of the sender (CUSTOMER, STAFF, or ADMIN)

**Status Codes:**
- `200 OK` - Successfully retrieved messages
- `404 Not Found` - Ticket not found
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges

---

### 4. Reply to Ticket (Admin)

**Endpoint:** `POST /api/admin/tickets/{ticketId}/reply`

**Description:** Add a reply to a ticket as an admin. No assignment required.

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| ticketId | Long | The ID of the ticket to reply to |

**Request Body:**
```json
{
  "message": "Your reply message here"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8080/api/admin/tickets/1/reply" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I can help you with that. Let me check your account details."
  }'
```

**Response:**
```json
{
  "id": 4,
  "content": "I can help you with that. Let me check your account details.",
  "timestamp": "2025-10-15T11:25:00Z",
  "isFromStaff": true,
  "ticketId": 1,
  "adminName": "admin_sarah"
}
```

**Status Codes:**
- `200 OK` - Reply successfully added
- `404 Not Found` - Ticket not found
- `400 Bad Request` - Invalid request body or empty message
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges

---

### 5. Update Ticket Status

**Endpoint:** `PUT /api/admin/tickets/{ticketId}/status`

**Description:** Update the status of a ticket.

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| ticketId | Long | The ID of the ticket to update |

**Request Body:**
```json
{
  "status": "CLOSED"
}
```

**Valid Status Values:**
- `OPEN` - Ticket is open and awaiting response
- `IN_PROGRESS` - Someone is working on the ticket
- `URGENT` - High priority ticket
- `CLOSED` - Ticket has been resolved

**Example Request:**
```bash
curl -X PUT "http://localhost:8080/api/admin/tickets/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CLOSED"
  }'
```

**Response:**
```json
{
  "id": 1,
  "subject": "Payment Issue",
  "status": "CLOSED",
  "customerName": "john_doe",
  "assignedStaffName": null,
  "createdAt": "2025-10-15T10:30:00",
  "closedAt": "2025-10-15T11:30:00"
}
```

**Status Codes:**
- `200 OK` - Status successfully updated
- `404 Not Found` - Ticket not found
- `400 Bad Request` - Invalid status value
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges

---

### 6. Close Ticket

**Endpoint:** `POST /api/admin/tickets/{ticketId}/close`

**Description:** Close a ticket (convenience endpoint).

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| ticketId | Long | The ID of the ticket to close |

**Example Request:**
```bash
curl -X POST "http://localhost:8080/api/admin/tickets/1/close" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "subject": "Payment Issue",
  "status": "CLOSED",
  "customerName": "john_doe",
  "closedAt": "2025-10-15T11:30:00"
}
```

**Status Codes:**
- `200 OK` - Ticket successfully closed
- `404 Not Found` - Ticket not found
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges

---

## Database Schema Changes

A new column has been added to the `ticket_messages` table:

```sql
ALTER TABLE ticket_messages
ADD COLUMN admin_id BIGINT NULL;

ALTER TABLE ticket_messages
ADD CONSTRAINT fk_ticket_messages_admin
FOREIGN KEY (admin_id) REFERENCES admins(id)
ON DELETE SET NULL;

CREATE INDEX idx_ticket_messages_admin_id ON ticket_messages(admin_id);
```

**Migration File:** `add_admin_to_ticket_messages.sql`

**Important Notes:**
- The `admin_id`, `staff_id`, and `customer_id` columns are mutually exclusive
- Only one should be set for any given message
- This allows admins to reply without being in the staff table

---

## Use Cases

### 1. Admin Monitoring All Tickets

An admin wants to see all open tickets to monitor support operations:

```javascript
// Fetch all open tickets
fetch('/api/admin/tickets?status=OPEN', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
})
.then(response => response.json())
.then(tickets => {
  console.log(`Found ${tickets.length} open tickets`);
  displayTickets(tickets);
});
```

### 2. Admin Jumping In to Help

An admin sees a ticket that needs immediate attention and replies without assignment:

```javascript
// View ticket messages
const ticketId = 123;
const messages = await fetch(`/api/admin/tickets/${ticketId}/messages`, {
  headers: { 'Authorization': `Bearer ${adminToken}` }
}).then(r => r.json());

// Admin can reply immediately
await fetch(`/api/admin/tickets/${ticketId}/reply`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "I can help you with this right away. Let me check your account."
  })
});
```

### 3. Admin Closing Resolved Tickets

After helping a customer, the admin closes the ticket:

```javascript
// Close the ticket
await fetch(`/api/admin/tickets/${ticketId}/close`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

console.log('Ticket closed successfully');
```

### 4. Dashboard View for Admins

Display ticket statistics and allow quick access:

```javascript
async function loadAdminTicketDashboard() {
  // Get all tickets grouped by status
  const allTickets = await fetch('/api/admin/tickets', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  
  const stats = {
    open: allTickets.filter(t => t.status === 'OPEN').length,
    inProgress: allTickets.filter(t => t.status === 'IN_PROGRESS').length,
    urgent: allTickets.filter(t => t.status === 'URGENT').length,
    closed: allTickets.filter(t => t.status === 'CLOSED').length
  };
  
  displayDashboard(stats, allTickets);
}
```

---

## React Example Component

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTicketViewer = ({ ticketId }) => {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTicket();
    loadMessages();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      const response = await axios.get(`/api/admin/tickets/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTicket(response.data);
    } catch (error) {
      console.error('Failed to load ticket:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await axios.get(`/api/admin/tickets/${ticketId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      await axios.post(`/api/admin/tickets/${ticketId}/reply`, 
        { message: replyText },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setReplyText('');
      await loadMessages(); // Reload to show new message
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async () => {
    if (!confirm('Are you sure you want to close this ticket?')) return;

    try {
      await axios.post(`/api/admin/tickets/${ticketId}/close`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      
      await loadTicket(); // Reload to show updated status
      alert('Ticket closed successfully!');
    } catch (error) {
      console.error('Failed to close ticket:', error);
      alert('Failed to close ticket. Please try again.');
    }
  };

  if (!ticket) return <div>Loading ticket...</div>;

  return (
    <div className="admin-ticket-viewer">
      <div className="ticket-header">
        <h2>{ticket.subject}</h2>
        <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
          {ticket.status}
        </span>
        <div className="ticket-info">
          <p>Customer: {ticket.customerName}</p>
          <p>Created: {new Date(ticket.createdAt).toLocaleString()}</p>
          {ticket.assignedStaffName && (
            <p>Assigned to: {ticket.assignedStaffName}</p>
          )}
        </div>
      </div>

      <div className="messages-container">
        <h3>Conversation</h3>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`message ${msg.isFromStaff ? 'staff-message' : 'customer-message'}`}
          >
            <div className="message-header">
              <strong>{msg.sender.username}</strong>
              <span className="role-badge">{msg.sender.role}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>

      {ticket.status !== 'CLOSED' && (
        <div className="reply-form">
          <h3>Reply as Admin</h3>
          <form onSubmit={sendReply}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
              required
            />
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reply'}
              </button>
              <button type="button" onClick={closeTicket} className="btn-close">
                Close Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {ticket.status === 'CLOSED' && (
        <div className="ticket-closed-notice">
          This ticket was closed on {new Date(ticket.closedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AdminTicketViewer;
```

---

## Audit Logging

All admin actions on tickets are automatically logged:

**Actions Logged:**
- `VIEW_TICKETS` - When admin views ticket list
- `VIEW_TICKET` - When admin views specific ticket details
- `VIEW_TICKET_MESSAGES` - When admin views ticket messages
- `REPLY_TO_TICKET` - When admin replies to a ticket
- `UPDATE_TICKET_STATUS` - When admin changes ticket status
- `CLOSE_TICKET` - When admin closes a ticket
- `DELETE_TICKET` - When admin deletes a ticket

**Audit Log Format:**
```json
{
  "adminUsername": "admin_sarah",
  "action": "REPLY_TO_TICKET",
  "resourceType": "TICKET",
  "resourceId": 123,
  "description": "Replied to support ticket",
  "ipAddress": "192.168.1.100",
  "timestamp": "2025-10-15T11:25:00",
  "success": true
}
```

---

## Security Considerations

1. **Authorization**: All endpoints require admin authentication
2. **No Assignment Required**: Admins can access any ticket without being assigned
3. **Audit Trail**: All admin actions are logged for accountability
4. **Data Privacy**: Admins can see customer information in tickets
5. **Rate Limiting**: Consider implementing rate limiting for reply endpoints

---

## Testing

### Manual Testing

1. **Test Viewing All Tickets:**
   ```bash
   curl -X GET "http://localhost:8080/api/admin/tickets" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

2. **Test Replying to Ticket:**
   ```bash
   curl -X POST "http://localhost:8080/api/admin/tickets/1/reply" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message": "Test admin reply"}'
   ```

3. **Test Filtering by Status:**
   ```bash
   curl -X GET "http://localhost:8080/api/admin/tickets?status=URGENT" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

---

## Troubleshooting

### Common Issues

1. **403 Forbidden Error:**
   - Ensure the user has ADMIN role
   - Check JWT token is valid and not expired

2. **Empty Message List:**
   - Verify ticket exists
   - Check database migration was applied

3. **Cannot Send Reply:**
   - Ensure message content is not empty
   - Check admin user exists in database

4. **Admin Name Shows as "system":**
   - This occurs if admin_id relation is not properly loaded
   - Check the populateMessageTransientFields method is being called

---

## Future Enhancements

Potential improvements for future versions:

1. **Ticket Assignment from Admin Panel**: Allow admins to assign tickets to staff
2. **Bulk Actions**: Close multiple tickets at once
3. **Ticket Templates**: Pre-defined responses for common issues
4. **Internal Notes**: Add private notes visible only to staff/admins
5. **Ticket Priority Management**: Change priority levels
6. **Search and Filters**: Advanced search across ticket content
7. **Real-time Updates**: WebSocket support for live ticket updates
8. **Notifications**: Alert admins of new urgent tickets

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0

