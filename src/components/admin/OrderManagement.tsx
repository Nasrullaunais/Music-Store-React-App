import { useState, useEffect } from 'react';
import { adminAPI, AdminOrder } from '@/api/adminApi.ts';
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
  FiShoppingCart,
  FiDollarSign,
  FiUser,
  FiMusic,
  FiRefreshCw,
  FiAlertTriangle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const filterValue = statusFilter === 'all' ? undefined : statusFilter || undefined;
      const response = await adminAPI.getAllOrders(page - 1, 10, filterValue);
      setOrders(response.content || []);
      const totalElements = response.totalElements || 0;
      setTotalPages(Math.max(1, Math.ceil(totalElements / 10)));
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Orders loading error:', error);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = (order: AdminOrder) => {
    setSelectedOrder(order);
    setRefundReason('');
    onOpen();
  };

  const confirmRefund = async () => {
    if (!selectedOrder) return;

    try {
      await adminAPI.processRefund(selectedOrder.id, refundReason);
      toast.success('Refund processed successfully');
      onClose();
      loadOrders();
    } catch (error) {
      toast.error('Failed to process refund');
      console.error('Refund error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'cancelled': return 'danger';
      case 'refunded': return 'secondary';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
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
              <FiShoppingCart />
              Order Management
            </h3>
            <div className="flex gap-4">
              <Select
                placeholder="Filter by status"
                selectedKeys={statusFilter ? [statusFilter] : []}
                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string || '')}
                className="max-w-xs"
                aria-label="Filter orders by status"
              >
                <SelectItem key="all">All Statuses</SelectItem>
                <SelectItem key="PENDING">Pending</SelectItem>
                <SelectItem key="PROCESSING">Processing</SelectItem>
                <SelectItem key="COMPLETED">Completed</SelectItem>
                <SelectItem key="CANCELLED">Cancelled</SelectItem>
                <SelectItem key="REFUNDED">Refunded</SelectItem>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardBody>
          <Table
            aria-label="Orders table"
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
              <TableColumn>ORDER ID</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>ITEMS</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-xs text-default-400">Order ID</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-default-400" />
                      <span>
                        {(
                          // Prefer nested customer object
                          (order as any).customer?.username ||
                          // Legacy flat field
                          (order as any).customerUsername ||
                          // Another legacy name
                          (order as any).customerName ||
                          'Unknown'
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {(order.items || []).slice(0, 2).map((item: any, index: number) => {
                        // Item may be in several shapes: { musicName, artistUsername }, or { music: { name, artistUsername } }
                        const musicName = item.musicName || item.name || item.title || item.music?.name || item.music?.title || 'Unknown Track';
                        const artistName = item.artistUsername || item.artist || item.music?.artist || item.music?.artistUsername || 'Unknown Artist';
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FiMusic className="text-primary text-xs" />
                            <span className="truncate max-w-32">{musicName}</span>
                            <span className="text-xs text-default-500">by {artistName}</span>
                          </div>
                        );
                      })}
                      {(order.items?.length || 0) > 2 && (
                        <p className="text-xs text-default-500">
                          +{(order.items?.length || 0) - 2} more items
                        </p>
                      )}
                      {(!order.items || order.items.length === 0) && (
                        <p className="text-xs text-default-500">No items</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-success" />
                      <span className="font-semibold text-success">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={getStatusColor(order.status)} variant="flat" size="sm">
                      {order.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status.toLowerCase() === 'completed' && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          startContent={<FiRefreshCw />}
                          onPress={() => handleRefund(order)}
                        >
                          Refund
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Refund Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FiRefreshCw className="text-warning" />
              Process Refund
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedOrder && (
              <div className="space-y-4">
                {/* Order Details */}
                <div className="p-4 bg-default-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">Order #{selectedOrder.id}</p>
                      <p className="text-sm text-default-600">
                        Customer: {(
                          (selectedOrder as any).customer?.username ||
                          (selectedOrder as any).customerUsername ||
                          (selectedOrder as any).customerName ||
                          'Unknown'
                        )}
                      </p>
                      <p className="text-sm text-default-600">
                        Date: {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </p>
                      <Chip color={getStatusColor(selectedOrder.status)} variant="flat" size="sm">
                        {selectedOrder.status}
                      </Chip>
                    </div>
                  </div>

                  <div className="border-t border-divider pt-3">
                    <p className="font-medium mb-2">Order Items:</p>
                    <div className="space-y-2">
                      {(selectedOrder.items || []).map((item: any, index: number) => {
                        const musicName = item.musicName || item.name || item.title || item.music?.name || item.music?.title || 'Unknown Track';
                        const artistName = item.artistUsername || item.artist || item.music?.artist || item.music?.artistUsername || 'Unknown Artist';
                        const price = typeof item.price === 'number' ? item.price : (item.music?.price || 0);
                        return (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <FiMusic className="text-primary" />
                              <span>{musicName}</span>
                              <span className="text-default-500">by {artistName}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(price)}</span>
                          </div>
                        );
                      })}
                      {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                        <p className="text-sm text-default-500">No items found</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Refund Reason */}
                <div>
                  <Input
                    label="Refund Reason"
                    placeholder="Enter reason for refund (optional)"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                  />
                </div>

                <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAlertTriangle className="text-warning" />
                    <span className="font-semibold text-warning">Refund Information</span>
                  </div>
                  <p className="text-small">
                    Processing this refund will:
                  </p>
                  <ul className="text-small mt-2 space-y-1 list-disc list-inside">
                    <li>Refund {formatCurrency(selectedOrder.totalAmount)} to the customer</li>
                    <li>Remove purchased music from customer's library</li>
                    <li>Update order status to "REFUNDED"</li>
                    <li>Send notification to the customer</li>
                  </ul>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="warning" onPress={confirmRefund}>
              Process Refund
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OrderManagement;
