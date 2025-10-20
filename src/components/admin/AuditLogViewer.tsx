import { useState, useEffect } from 'react';
import { adminAPI } from '@/api/adminApi';
import { AuditLog, AuditLogPage } from '@/types';
import { Card, CardBody, Button, Input, Chip, Spinner } from '@heroui/react';
import { FiSearch, FiX, FiClock, FiUser, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLogPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(20); // Removed setSize since it's not used
  const [filterAdmin, setFilterAdmin] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, [page, size, filterAdmin]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAuditLogs(page, size, filterAdmin || undefined);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'primary';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <FiAlertCircle className="text-sm" />;
      case 'MEDIUM':
        return <FiActivity className="text-sm" />;
      case 'LOW':
        return <FiClock className="text-sm" />;
      default:
        return null;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterAdmin(searchInput);
    setPage(0);
  };

  const handleClearFilter = () => {
    setSearchInput('');
    setFilterAdmin('');
    setPage(0);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading && !logs) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiActivity className="text-primary" />
            Audit Logs
          </h2>
          <p className="text-default-600 text-sm mt-1">
            Track all administrative actions for security and compliance
          </p>
        </div>
      </div>

      {/* Filter Form */}
      <Card className="bg-transparent border-none shadow-none">
        <CardBody>
          <form onSubmit={handleSearch} className="flex gap-3 items-end bg-white/30 backdrop-blur-lg border-white/50 p-4 rounded-lg">
            <div className="flex-1">
              <Input
                label="Filter by Admin Username"
                placeholder="Enter admin username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                startContent={<FiUser className="text-default-400" />}
                variant="flat"
              />
            </div>
            <Button type="submit" color="primary" isLoading={loading} className="text-white">
              <FiSearch className="mr-1 text-white" />
              Filter
            </Button>
            {filterAdmin && (
              <Button
                type="button"
                color="default"
                variant="flat"
                onPress={handleClearFilter}
              >
                <FiX className="mr-1" />
                Clear
              </Button>
            )}
          </form>
        </CardBody>
      </Card>

      {/* Stats */}
      {logs && (
        <div className="flex items-center gap-4 text-sm text-default-600">
          <span className="font-medium">
            Showing {logs.content.length} of {logs.totalElements.toLocaleString()} logs
          </span>
          <span>•</span>
          <span>
            Page {logs.number + 1} of {logs.totalPages}
          </span>
          {filterAdmin && (
            <>
              <span>•</span>
              <Chip size="sm" color="primary" variant="flat">
                Filtered by: {filterAdmin}
              </Chip>
            </>
          )}
        </div>
      )}

      {/* Audit Logs Table */}
      <Card className="bg-white/30 backdrop-blur-lg border-white/50">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-default-100">
              <thead className="bg-default-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-default-700 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-default-100 divide-y divide-default-50">
                {logs?.content.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-default-500">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  logs?.content.map((log: AuditLog) => (
                    <tr key={log.id} className="hover:bg-default-200/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-default-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-default-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-primary" />
                          <span className="font-medium text-default-900">{log.adminUsername}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <code className="text-xs bg-default-200 px-2 py-1 rounded">
                          {log.action}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-default-700">
                        <div>
                          <span className="font-medium">{log.resourceType}</span>
                          {log.resourceId && (
                            <span className="text-default-500 ml-1">#{log.resourceId}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Chip
                          size="sm"
                          color={getSeverityColor(log.severity)}
                          variant="flat"
                          startContent={getSeverityIcon(log.severity)}
                        >
                          {log.severity}
                        </Chip>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {log.success ? (
                          <Chip size="sm" color="success" variant="flat">
                            ✓ Success
                          </Chip>
                        ) : (
                          <Chip size="sm" color="danger" variant="flat">
                            ✗ Failed
                          </Chip>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-default-700 max-w-xs">
                        <div className="truncate" title={log.details}>
                          {log.details}
                        </div>
                        {log.errorMessage && (
                          <div className="text-danger text-xs mt-1 truncate" title={log.errorMessage}>
                            Error: {log.errorMessage}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      {logs && logs.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            onPress={() => setPage(0)}
            isDisabled={logs.first || loading}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setPage(Math.max(0, page - 1))}
            isDisabled={logs.first || loading}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-default-600">
              Page {page + 1} of {logs.totalPages}
            </span>
          </div>

          <Button
            size="sm"
            variant="flat"
            onPress={() => setPage(Math.min(logs.totalPages - 1, page + 1))}
            isDisabled={logs.last || loading}
          >
            Next
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={() => setPage(logs.totalPages - 1)}
            isDisabled={logs.last || loading}
          >
            Last
          </Button>
        </div>
      )}

      {/* Additional Info Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-lg border-primary/30">
        <CardBody>
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-primary text-xl mt-1" />
            <div>
              <h3 className="font-semibold text-default-900 mb-1">About Audit Logs</h3>
              <p className="text-sm text-default-600">
                All administrative actions are automatically logged for security and compliance purposes.
                Logs include details about who performed the action, what was done, and when it occurred.
                This helps maintain accountability and track system changes.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AuditLogViewer;
