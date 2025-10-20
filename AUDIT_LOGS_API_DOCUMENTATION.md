# Admin Audit Logs API Documentation


## Overview
The audit logs endpoint allows administrators to view all administrative actions taken in the system. Every admin action (create, update, delete, view, etc.) is automatically logged for accountability and security purposes.

---

## Endpoint

### Get Audit Logs

**Endpoint:** `GET /api/admin/audit-logs`

**Description:** Retrieve audit logs with pagination and optional filtering.

**Authentication:** Required (Admin role)

**Request Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 0 | Page number (zero-based) |
| size | int | No | 20 | Number of records per page |
| adminUsername | String | No | null | Filter by specific admin username |
| action | String | No | null | Filter by action type (currently not fully implemented) |
| resourceType | String | No | null | Filter by resource type (currently not fully implemented) |

---

## Example Requests

### 1. Get All Audit Logs (First Page)

```bash
curl -X GET "http://localhost:8080/api/admin/audit-logs" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 2. Get Audit Logs with Pagination

```bash
# Get page 2 with 50 records per page
curl -X GET "http://localhost:8080/api/admin/audit-logs?page=1&size=50" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 3. Filter by Admin Username

```bash
# Get all logs for a specific admin
curl -X GET "http://localhost:8080/api/admin/audit-logs?adminUsername=admin_sarah" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 4. Combine Filters

```bash
# Get logs for specific admin with custom page size
curl -X GET "http://localhost:8080/api/admin/audit-logs?adminUsername=admin_john&page=0&size=100" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

---

## Response Format

**Success Response (200 OK):**

The endpoint returns a paginated response following Spring Data's `Page` format:

```json
{
  "content": [
    {
      "id": 1,
      "adminUsername": "admin_sarah",
      "action": "CREATE_USER",
      "resourceType": "USER",
      "resourceId": 123,
      "details": "Created user: john_doe with role: CUSTOMER",
      "success": true,
      "errorMessage": null,
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "sessionId": "ABC123XYZ",
      "severity": "HIGH",
      "timestamp": "2025-10-20T10:30:45"
    },
    {
      "id": 2,
      "adminUsername": "admin_john",
      "action": "DELETE_MUSIC",
      "resourceType": "MUSIC",
      "resourceId": 456,
      "details": "Deleted music track",
      "success": true,
      "errorMessage": null,
      "ipAddress": "192.168.1.101",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      "sessionId": "DEF456UVW",
      "severity": "CRITICAL",
      "timestamp": "2025-10-20T10:25:30"
    },
    {
      "id": 3,
      "adminUsername": "admin_sarah",
      "action": "VIEW_ANALYTICS_OVERVIEW",
      "resourceType": "ANALYTICS",
      "resourceId": null,
      "details": "Viewed system overview analytics",
      "success": true,
      "errorMessage": null,
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "sessionId": "ABC123XYZ",
      "severity": "LOW",
      "timestamp": "2025-10-20T10:20:15"
    }
  ],
  "pageable": {
    "sort": {
      "sorted": false,
      "unsorted": true,
      "empty": true
    },
    "pageNumber": 0,
    "pageSize": 20,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 98,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": false,
    "unsorted": true,
    "empty": true
  },
  "numberOfElements": 20,
  "empty": false
}
```

---

## Audit Log Fields

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Unique identifier for the audit log entry |
| adminUsername | String | Username of the admin who performed the action |
| action | String | Type of action performed (see Action Types below) |
| resourceType | String | Type of resource affected (see Resource Types below) |
| resourceId | Long | ID of the specific resource (null for non-specific actions) |
| details | String | Human-readable description of the action |
| success | Boolean | Whether the action succeeded |
| errorMessage | String | Error message if action failed (null if successful) |
| ipAddress | String | IP address of the admin who performed the action |
| userAgent | String | Browser/client user agent string |
| sessionId | String | Session ID for tracking |
| severity | String | Severity level: LOW, MEDIUM, HIGH, CRITICAL |
| timestamp | DateTime | ISO 8601 timestamp when action occurred |

---

## Common Action Types

### User Management
- `CREATE_USER` - Creating a new user
- `UPDATE_USER` - Updating user information
- `DELETE_USER` - Deleting a user account
- `VIEW_USERS` - Viewing user list
- `VIEW_USER` - Viewing specific user details
- `UPDATE_USER_STATUS` - Enabling/disabling user accounts

### Ban Management
- `BAN_CUSTOMER` - Banning a customer
- `BAN_ARTIST` - Banning an artist
- `UNBAN_CUSTOMER` - Unbanning a customer
- `UNBAN_ARTIST` - Unbanning an artist
- `VIEW_CUSTOMER_BAN_STATUS` - Viewing ban status
- `VIEW_BANNED_USERS` - Viewing banned users list

### Music Management
- `DELETE_MUSIC` - Deleting music tracks
- `UPDATE_MUSIC_STATUS` - Changing music status
- `VIEW_MUSIC` - Viewing music list
- `UNFLAG_MUSIC` - Unflagging music content
- `DELETE_FLAGGED_MUSIC` - Deleting flagged music

### Ticket Management
- `VIEW_TICKETS` - Viewing ticket list
- `VIEW_TICKET` - Viewing specific ticket
- `VIEW_TICKET_MESSAGES` - Viewing ticket messages
- `REPLY_TO_TICKET` - Replying to a ticket
- `UPDATE_TICKET_STATUS` - Changing ticket status
- `CLOSE_TICKET` - Closing a ticket
- `DELETE_TICKET` - Deleting a ticket

### Refund Management
- `VIEW_REFUND_REQUESTS` - Viewing refund requests
- `VIEW_REFUND_REQUEST` - Viewing specific refund
- `APPROVE_REFUND` - Approving a refund
- `REJECT_REFUND` - Rejecting a refund

### Analytics & Reports
- `VIEW_ANALYTICS_OVERVIEW` - Viewing system overview
- `VIEW_DETAILED_ANALYTICS` - Viewing detailed analytics
- `VIEW_PERFORMANCE_METRICS` - Viewing performance metrics
- `DOWNLOAD_SALES_REPORT` - Downloading sales reports

### System Management
- `SHUTDOWN_SERVER` - Shutting down the server
- `VIEW_SYSTEM_STATUS` - Viewing system status
- `CREATE_SYSTEM_BACKUP` - Creating system backup

### Staff/Admin Management
- `REGISTER_STAFF` - Registering new staff
- `REGISTER_ADMIN` - Registering new admin
- `VIEW_STAFF_LIST` - Viewing staff members
- `VIEW_ADMIN_LIST` - Viewing admin users

### Audit Logs
- `VIEW_AUDIT_LOGS` - Viewing audit logs (yes, this itself is logged!)

---

## Resource Types

- `USER` - User-related actions
- `CUSTOMER` - Customer-specific actions
- `ARTIST` - Artist-specific actions
- `STAFF` - Staff member actions
- `ADMIN` - Admin user actions
- `MUSIC` - Music track actions
- `TICKET` - Support ticket actions
- `REFUND` - Refund request actions
- `ORDER` - Order-related actions
- `REVIEW` - Review-related actions
- `ANALYTICS` - Analytics viewing
- `REPORT` - Report generation
- `SYSTEM` - System-level actions
- `AUDIT` - Audit log viewing

---

## Severity Levels

| Severity | Description | Examples |
|----------|-------------|----------|
| **LOW** | Read-only operations | Viewing data, analytics, reports |
| **MEDIUM** | Standard operations | General updates, searching |
| **HIGH** | Important changes | Creating/updating users, status changes |
| **CRITICAL** | Dangerous operations | Deleting data, refunds, server shutdown |

**Automatic Severity Assignment:**
- Actions containing "DELETE", "REFUND", "SHUTDOWN" → CRITICAL
- Actions containing "CREATE", "UPDATE", "STATUS_CHANGE" → HIGH
- Actions containing "VIEW", "GET", "ANALYTICS" → LOW
- All other actions → MEDIUM

---

## Frontend Integration Examples

### React/TypeScript

```typescript
// types.ts
export interface AuditLog {
  id: number;
  adminUsername: string;
  action: string;
  resourceType: string;
  resourceId: number | null;
  details: string;
  success: boolean;
  errorMessage: string | null;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// AuditLogViewer.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogPage | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [filterAdmin, setFilterAdmin] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (filterAdmin) {
        params.append('adminUsername', filterAdmin);
      }

      const response = await axios.get(`/api/admin/audit-logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      alert('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [page, size]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadAuditLogs();
  };

  if (loading && !logs) {
    return <div className="p-8 text-center">Loading audit logs...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Audit Logs</h1>

      {/* Filter Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Filter by admin username..."
          value={filterAdmin}
          onChange={(e) => setFilterAdmin(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
        <button 
          type="button"
          onClick={() => { setFilterAdmin(''); setPage(0); }}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </form>

      {/* Stats */}
      {logs && (
        <div className="mb-4 text-gray-600">
          Showing {logs.content.length} of {logs.totalElements} logs
          (Page {logs.number + 1} of {logs.totalPages})
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Admin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Resource
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs?.content.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {log.adminUsername}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {log.action}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {log.resourceType}
                  {log.resourceId && ` #${log.resourceId}`}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {log.success ? (
                    <span className="text-green-600">✓ Success</span>
                  ) : (
                    <span className="text-red-600">✗ Failed</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {log.details}
                  {log.errorMessage && (
                    <div className="text-red-600 text-xs mt-1">
                      Error: {log.errorMessage}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {logs && logs.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={logs.first}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {page + 1} of {logs.totalPages}
          </span>
          
          <button
            onClick={() => setPage(Math.min(logs.totalPages - 1, page + 1))}
            disabled={logs.last}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogViewer;
```

### Simple JavaScript/Fetch Example

```javascript
// Fetch audit logs
async function fetchAuditLogs(page = 0, size = 20, adminUsername = null) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (adminUsername) {
    params.append('adminUsername', adminUsername);
  }

  try {
    const response = await fetch(`/api/admin/audit-logs?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}

// Usage
fetchAuditLogs(0, 50, 'admin_sarah')
  .then(data => {
    console.log(`Total logs: ${data.totalElements}`);
    console.log('Logs:', data.content);
  });
```

---

## Use Cases

### 1. Security Monitoring
Monitor all administrative actions for suspicious activity:
```typescript
// Get all logs and check for failed actions
const logs = await fetchAuditLogs(0, 100);
const failedActions = logs.content.filter(log => !log.success);
console.log(`Found ${failedActions.length} failed actions`);
```

### 2. Admin Activity Tracking
Track what a specific admin has been doing:
```typescript
const adminLogs = await fetchAuditLogs(0, 50, 'admin_john');
console.log(`Admin john performed ${adminLogs.totalElements} actions`);
```

### 3. Critical Action Alerts
Monitor critical actions (deletes, refunds, etc.):
```typescript
const allLogs = await fetchAuditLogs(0, 100);
const criticalActions = allLogs.content.filter(log => 
  log.severity === 'CRITICAL'
);
// Send alerts for critical actions
```

### 4. Compliance Reporting
Generate audit reports for compliance purposes:
```typescript
// Fetch all logs for a time period and export
const generateAuditReport = async () => {
  let page = 0;
  let allLogs = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetchAuditLogs(page, 100);
    allLogs = [...allLogs, ...response.content];
    hasMore = !response.last;
    page++;
  }

  return allLogs;
};
```

---

## Status Codes

- `200 OK` - Successfully retrieved audit logs
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Invalid or missing authentication token
- `403 Forbidden` - User does not have admin privileges

---

## Important Notes

1. **Self-Logging**: The act of viewing audit logs is itself logged with action `VIEW_AUDIT_LOGS`
2. **Pagination**: Large result sets are paginated to improve performance
3. **Filtering**: Currently, full filtering by action and resourceType is prepared but may need additional repository methods
4. **Privacy**: Audit logs contain IP addresses and user agents for security purposes
5. **Retention**: Consider implementing a retention policy for old logs

---

## Security Considerations

1. **Access Control**: Only users with ADMIN role can access audit logs
2. **Sensitive Data**: Logs may contain sensitive information - handle carefully
3. **Immutable**: Audit logs should never be deleted or modified
4. **Monitoring**: Regularly review logs for suspicious activity
5. **Backup**: Ensure audit logs are included in system backups

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0

