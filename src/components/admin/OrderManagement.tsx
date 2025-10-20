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
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Input,
  Modal,
  ModalContent,
} from '@heroui/react';
import {
  FiShoppingCart,
  FiDollarSign,
  FiUser,
  FiMusic,
  FiRefreshCw,
  FiAlertTriangle,
  FiEye,
  FiPackage,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import AnimatedModal from './AnimatedModal';

const OrderManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [viewItemsOrder, setViewItemsOrder] = useState<AdminOrder | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isItemsModalOpen, onOpen: onItemsModalOpen, onClose: onItemsModalClose } = useDisclosure();

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

  const handleViewAllItems = (order: AdminOrder) => {
    setViewItemsOrder(order);
    onItemsModalOpen();
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
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
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
                classNames={{
                  trigger: "bg-white/30 backdrop-blur-lg border-white/50 shadow-lg",
                  listboxWrapper: "max-h-[300px]",
                  popoverContent: "bg-white/90 border border-gray-200 shadow-2xl"
                }}
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
      <Card className="bg-white/30 backdrop-blur-lg border-white/50 shadow-lg">
        <CardBody>
          <Table
            aria-label="Orders table"
            classNames={{
              wrapper: "bg-transparent shadow-none",
              th: "bg-white/20 backdrop-blur-sm",
              td: "bg-transparent"
            }}
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
                  classNames={{
                      wrapper: "backdrop-blur-slg rounded-xl",
                      item: "backdrop-blur-lg rounded-lg",
                      cursor: "bg-primary/60 backdrop-blur-lg rounded-lg",
                      prev: "backdrop-blur-lg",
                      next: "backdrop-blur-lg"
                  }}
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
                        {order.customer?.username || order.customerUsername || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {(order.orderItems || []).slice(0, 2).map((item, index) => {
                        const musicName = item.product?.name || item.product?.title || 'Unknown Track';
                        const artistName = item.product?.artist || item.product?.artistUsername || 'Unknown Artist';
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FiMusic className="text-primary text-xs" />
                            <span className="truncate max-w-32">{musicName}</span>
                            <span className="text-xs text-default-500">by {artistName}</span>
                          </div>
                        );
                      })}
                      {(order.orderItems?.length || 0) > 2 && (
                        <Button
                          size="xs"
                          variant="link"
                          color="primary"
                          onPress={() => handleViewAllItems(order)}
                          className="p-0"
                          startContent={<FiEye className="mr-1" />}
                        >
                          View All Items
                        </Button>
                      )}
                      {(!order.orderItems || order.orderItems.length === 0) && (
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
      <AnimatedModal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size="lg"
      >
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
                    {(selectedOrder.orderItems || []).map((item, index) => {
                      const musicName = item.product?.name || item.product?.title || 'Unknown Track';
                      const artistName = item.product?.artist || item.product?.artistUsername || 'Unknown Artist';
                      const price = item.price || 0;
                      const quantity = item.quantity || 1;
                      return (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <FiMusic className="text-primary" />
                            <span>{musicName}</span>
                            <span className="text-default-500">by {artistName}</span>
                            {quantity > 1 && (
                              <span className="text-xs text-default-400">(x{quantity})</span>
                            )}
                          </div>
                          <span className="font-medium">{formatCurrency(price)}</span>
                        </div>
                      );
                    })}
                    {(!selectedOrder.orderItems || selectedOrder.orderItems.length === 0) && (
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
                  classNames={{
                    inputWrapper: "bg-white/30 backdrop-blur-lg border-white/50"
                  }}
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
      </AnimatedModal>

      {/* View All Items Modal */}
      <Modal
        isOpen={isItemsModalOpen}
        onClose={onItemsModalClose}
        size="lg"
        placement="top-center"
      >
        <ModalContent className="bg-white/90 border border-gray-200 shadow-2xl">
          <ModalHeader>
            <div className="flex items-center gap-2">
              <FiPackage className="text-primary" />
              <span className="text-lg font-semibold">Order Items</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {viewItemsOrder && (
              <div className="space-y-4">
                {/* Order Details */}
                <div className="p-4 bg-default-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">Order #{viewItemsOrder.id}</p>
                      <p className="text-sm text-default-600">
                        Customer: {(
                          (viewItemsOrder as any).customer?.username ||
                          (viewItemsOrder as any).customerUsername ||
                          (viewItemsOrder as any).customerName ||
                          'Unknown'
                        )}
                      </p>
                      <p className="text-sm text-default-600">
                        Date: {formatDate(viewItemsOrder.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(viewItemsOrder.totalAmount)}
                      </p>
                      <Chip color={getStatusColor(viewItemsOrder.status)} variant="flat" size="sm">
                        {viewItemsOrder.status}
                      </Chip>
                    </div>
                  </div>

                  <div className="border-t border-divider pt-3">
                    <p className="font-medium mb-2">Order Items:</p>
                    <div className="space-y-2">
                      {(viewItemsOrder.orderItems || []).map((item, index) => {
                        const musicName = item.product?.name || item.product?.title || 'Unknown Track';
                        const artistName = item.product?.artist || item.product?.artistUsername || 'Unknown Artist';
                        const price = item.price || 0;
                        const quantity = item.quantity || 1;
                        return (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <FiMusic className="text-primary" />
                              <span>{musicName}</span>
                              <span className="text-default-500">by {artistName}</span>
                              {quantity > 1 && (
                                <span className="text-xs text-default-400">(x{quantity})</span>
                              )}
                            </div>
                            <span className="font-medium">{formatCurrency(price)}</span>
                          </div>
                        );
                      })}
                      {(!viewItemsOrder.orderItems || viewItemsOrder.orderItems.length === 0) && (
                        <p className="text-sm text-default-500">No items found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onItemsModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OrderManagement;
