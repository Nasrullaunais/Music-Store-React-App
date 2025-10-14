import { useState, useEffect } from 'react';
import { refundApi } from '@/api/refundApi';
import { Order, RefundRequest } from '@/types';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Tabs,
  Tab,
} from '@heroui/react';
import { FiShoppingBag, FiDollarSign, FiAlertCircle, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [processingRefund, setProcessingRefund] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, refundsData] = await Promise.all([
        refundApi.getMyOrders(0, 100),
        refundApi.getMyRefunds(),
      ]);

      setOrders(ordersData.content);
      setRefunds(refundsData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders and refunds');
      setOrders([]);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefund = async (order: Order) => {
    try {
      const eligibility = await refundApi.checkRefundEligibility(order.id);
      if (!eligibility.eligible) {
        toast.error(eligibility.message || 'This order is not eligible for refund');
        return;
      }
      setSelectedOrder(order);
      setRefundReason('');
      setIsRefundModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to check refund eligibility');
    }
  };

  const submitRefundRequest = async () => {
    if (!selectedOrder || !refundReason.trim()) {
      toast.error('Please provide a reason for the refund');
      return;
    }

    if (refundReason.trim().length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }

    try {
      setProcessingRefund(true);
      await refundApi.applyForRefund(selectedOrder.id, refundReason.trim());
      toast.success('Refund request submitted successfully');
      setIsRefundModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit refund request');
    } finally {
      setProcessingRefund(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'success';
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'primary';
      case 'SHIPPED': return 'primary';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getRefundStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      default: return 'default';
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

  const isRefundable = (order: Order) => {
    // For digital music, orders are instantly fulfilled
    // Refunds should be available for any non-cancelled order (within 24 hours - backend checks this)
    return order.status !== 'CANCELLED' && !refunds.some(r => r.order.id === order.id);
  };

  const getOrderRefund = (orderId: number) => {
    return refunds.find(r => r.order.id === orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiShoppingBag className="text-primary" />
            My Orders & Refunds
          </h2>
        </CardHeader>
      </Card>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
      >
        <Tab key="orders" title={`Orders (${orders.length})`}>
          <div className="mt-4 space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center py-10 text-gray-500">
                    <FiShoppingBag className="mx-auto text-4xl mb-3" />
                    <p>You haven't placed any orders yet.</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              orders.map((order) => {
                const refund = getOrderRefund(order.id);
                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardBody className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Chip color={getStatusColor(order.status)} variant="flat" size="sm">
                            {order.status}
                          </Chip>
                          {refund && (
                            <Chip color={getRefundStatusColor(refund.status)} variant="flat" size="sm">
                              Refund: {refund.status}
                            </Chip>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{item.musicTitle}</p>
                              <p className="text-gray-500">by {item.artistName}</p>
                            </div>
                            <p className="font-semibold">{formatCurrency(item.unitPrice)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-gray-500" />
                          <span className="text-lg font-bold">{formatCurrency(order.totalAmount)}</span>
                        </div>
                        {isRefundable(order) && (
                          <Button
                            color="warning"
                            variant="flat"
                            size="sm"
                            onPress={() => handleRequestRefund(order)}
                            startContent={<FiAlertCircle />}
                          >
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        </Tab>

        <Tab key="refunds" title={`Refund Requests (${refunds.length})`}>
          <div className="mt-4 space-y-4">
            {refunds.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center py-10 text-gray-500">
                    <FiAlertCircle className="mx-auto text-4xl mb-3" />
                    <p>No refund requests yet.</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              refunds.map((refund) => (
                <Card key={refund.id} className="hover:shadow-lg transition-shadow">
                  <CardBody className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Refund Request #{refund.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Order #{refund.order.id} • {formatDate(refund.requestDate)}
                        </p>
                      </div>
                      <Chip color={getRefundStatusColor(refund.status)} variant="flat">
                        {refund.status}
                      </Chip>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Refund Amount
                        </p>
                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(refund.refundAmount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Your Reason
                        </p>
                        <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {refund.reason}
                        </p>
                      </div>

                      {refund.status === 'PENDING' && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                          <FiClock />
                          <span>Your refund request is being reviewed by our admin team.</span>
                        </div>
                      )}

                      {refund.status === 'APPROVED' && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <FiCheckCircle />
                          <span>
                            Refund approved on {refund.processedDate ? formatDate(refund.processedDate) : 'N/A'}
                          </span>
                        </div>
                      )}

                      {refund.status === 'REJECTED' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <FiXCircle />
                            <span>Refund request was rejected</span>
                          </div>
                          {refund.adminNotes && (
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Admin Notes
                              </p>
                              <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                {refund.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {refund.adminNotes && refund.status === 'APPROVED' && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Admin Notes
                          </p>
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            {refund.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Refund Request Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">Request Refund</h3>
          </ModalHeader>
          <ModalBody>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">Refund Policy</p>
                      <p>Refunds can only be requested within 24 hours of purchase. Please provide a detailed reason for your refund request.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Order Details</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Order #{selectedOrder.id}
                  </p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </div>

                <Textarea
                  label="Reason for Refund"
                  placeholder="Please explain why you're requesting a refund (minimum 10 characters)..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  minRows={4}
                  maxRows={8}
                  description={`${refundReason.length}/1000 characters`}
                  maxLength={1000}
                  isRequired
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setIsRefundModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="warning"
              onPress={submitRefundRequest}
              isLoading={processingRefund}
              isDisabled={refundReason.trim().length < 10}
            >
              Submit Refund Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MyOrders;
