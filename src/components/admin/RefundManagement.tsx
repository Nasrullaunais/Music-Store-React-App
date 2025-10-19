import { useState, useEffect } from 'react';
import { adminAPI } from '@/api/adminApi';
import { RefundRequest } from '@/types';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Tabs,
  Tab,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import {
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiEye,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AnimatedModal from './AnimatedModal';

const RefundManagement = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadRefunds();
    loadStatistics();
  }, [page, statusFilter]);

  const loadRefunds = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllRefunds(
        page - 1,
        10,
        statusFilter === 'ALL' ? undefined : statusFilter
      );

      // Backend returns a Page object with content array
      setRefunds(response.content || []);
      const totalElements = response.totalElements || 0;
      setTotalPages(Math.max(1, Math.ceil(totalElements / 10)));
    } catch (error) {
      console.error('Failed to load refunds:', error);
      toast.error('Failed to load refund requests');
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await adminAPI.getRefundStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleViewDetails = async (refund: RefundRequest) => {
    try {
      const details = await adminAPI.getRefundById(refund.id);
      setSelectedRefund(details);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error('Failed to load refund details');
    }
  };

  const handleApprove = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setAdminNotes('');
    setIsApproveModalOpen(true);
  };

  const handleReject = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setAdminNotes('');
    setIsRejectModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRefund) return;

    try {
      setProcessing(true);
      await adminAPI.approveRefund(selectedRefund.id, adminNotes.trim() || undefined);
      toast.success('Refund approved successfully');
      setIsApproveModalOpen(false);
      loadRefunds();
      loadStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve refund');
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedRefund || !adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      await adminAPI.rejectRefund(selectedRefund.id, adminNotes.trim());
      toast.success('Refund rejected');
      setIsRejectModalOpen(false);
      loadRefunds();
      loadStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject refund');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && refunds.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    {statistics.pendingCount || 0}
                  </p>
                </div>
                <FiClock className="text-3xl text-warning" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Approved</p>
                  <p className="text-2xl font-bold text-success">
                    {statistics.approvedCount || 0}
                  </p>
                </div>
                <FiCheckCircle className="text-3xl text-success" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Rejected</p>
                  <p className="text-2xl font-bold text-danger">
                    {statistics.rejectedCount || 0}
                  </p>
                </div>
                <FiXCircle className="text-3xl text-danger" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-600">Total Refunded</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(statistics.totalRefundAmount || 0)}
                  </p>
                </div>
                <FiDollarSign className="text-3xl text-primary" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Refunds Table */}
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiDollarSign />
              Refund Management
            </h3>
            <Tabs
              selectedKey={statusFilter}
              onSelectionChange={(key) => {
                setStatusFilter(key as string);
                setPage(1);
              }}
              size="sm"
              color="primary"
            >
              <Tab key="PENDING" title="Pending" />
              <Tab key="APPROVED" title="Approved" />
              <Tab key="REJECTED" title="Rejected" />
              <Tab key="ALL" title="All" />
            </Tabs>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : refunds.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FiAlertCircle className="mx-auto text-4xl mb-3" />
              <p>No refund requests found.</p>
            </div>
          ) : (
            <>
              <Table aria-label="Refund requests table">
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>CUSTOMER</TableColumn>
                  <TableColumn>ORDER ID</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>REQUEST DATE</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell>#{refund.id}</TableCell>
                      <TableCell>{refund.customer.username}</TableCell>
                      <TableCell>#{refund.order.id}</TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {formatCurrency(refund.refundAmount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(refund.status)}
                          variant="flat"
                          size="sm"
                        >
                          {refund.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(refund.requestDate)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => handleViewDetails(refund)}
                            startContent={<FiEye />}
                          >
                            View
                          </Button>
                          {refund.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                onPress={() => handleApprove(refund)}
                                startContent={<FiCheckCircle />}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={() => handleReject(refund)}
                                startContent={<FiXCircle />}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    showControls
                  />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <AnimatedModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        size="2xl"
      >
        <ModalHeader>
          <h3 className="text-xl font-bold">Refund Request Details</h3>
        </ModalHeader>
        <ModalBody>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Refund ID</p>
                  <p className="font-semibold">#{selectedRefund.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <Chip color={getStatusColor(selectedRefund.status)} variant="flat" size="sm">
                    {selectedRefund.status}
                  </Chip>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                  <p className="font-semibold">#{selectedRefund.order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="font-semibold">{selectedRefund.customer.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Refund Amount</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(selectedRefund.refundAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Request Date</p>
                  <p className="font-semibold">{formatDate(selectedRefund.requestDate)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Customer Reason</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-sm">{selectedRefund.reason}</p>
                </div>
              </div>

              {selectedRefund.processedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Processed By</p>
                    <p className="font-semibold">{selectedRefund.processedBy}</p>
                  </div>
                  {selectedRefund.processedDate && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Processed Date</p>
                      <p className="font-semibold">{formatDate(selectedRefund.processedDate)}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedRefund.adminNotes && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Admin Notes</p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm">{selectedRefund.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => setIsDetailModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </AnimatedModal>

      {/* Approve Modal */}
      <AnimatedModal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
        <ModalHeader>
          <h3 className="text-xl font-bold">Approve Refund Request</h3>
        </ModalHeader>
        <ModalBody>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-semibold mb-1">Confirm Approval</p>
                    <p>
                      You are about to approve a refund of {formatCurrency(selectedRefund.refundAmount)} for order #{selectedRefund.order.id}.
                      The order status will be changed to CANCELLED.
                    </p>
                  </div>
                </div>
              </div>

              <Textarea
                label="Admin Notes (Optional)"
                placeholder="Add any notes about this approval..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                minRows={3}
                maxLength={1000}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => setIsApproveModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="success"
            onPress={confirmApprove}
            isLoading={processing}
            startContent={<FiCheckCircle />}
          >
            Approve Refund
          </Button>
        </ModalFooter>
      </AnimatedModal>

      {/* Reject Modal */}
      <AnimatedModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
        <ModalHeader>
          <h3 className="text-xl font-bold">Reject Refund Request</h3>
        </ModalHeader>
        <ModalBody>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiXCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <p className="font-semibold mb-1">Confirm Rejection</p>
                    <p>
                      You are about to reject a refund request for order #{selectedRefund.order.id}.
                      Please provide a reason for the customer.
                    </p>
                  </div>
                </div>
              </div>

              <Textarea
                label="Reason for Rejection (Required)"
                placeholder="Explain why this refund request is being rejected..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                minRows={3}
                maxLength={1000}
                isRequired
                errorMessage={adminNotes.trim() ? '' : 'Reason is required for rejection'}
                classNames={{
                  inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
                }}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={() => setIsRejectModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={confirmReject}
            isLoading={processing}
            isDisabled={!adminNotes.trim()}
            startContent={<FiXCircle />}
          >
            Reject Refund
          </Button>
        </ModalFooter>
      </AnimatedModal>
    </div>
  );
};

export default RefundManagement;

