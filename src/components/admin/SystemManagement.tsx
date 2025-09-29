import { useState, useEffect } from 'react';
import { adminAPI } from '@/api/admin';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Progress
} from '@heroui/react';
import {
  FiSettings,
  FiPower,
  FiAlertTriangle,
  FiServer,
  FiActivity,
  FiShield,
  FiDatabase
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const SystemManagement = () => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [, setLoading] = useState(true);
  const [shutdownDelay, setShutdownDelay] = useState('10');
  const [shutdownReason, setShutdownReason] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    setLoading(true);
    try {
      const status = await adminAPI.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      toast.error('Failed to load system status');
      console.error('System status error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShutdownServer = () => {
    onOpen();
  };

  const confirmShutdown = async () => {
    try {
      await adminAPI.shutdownServer(parseInt(shutdownDelay), shutdownReason);
      toast.success(`Server shutdown initiated with ${shutdownDelay}s delay`);
      onClose();
    } catch (error) {
      toast.error('Failed to shutdown server');
      console.error('Shutdown error:', error);
    }
  };

  const refreshStatus = () => {
    loadSystemStatus();
    toast.success('System status refreshed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiSettings />
              System Management
            </h3>
            <Button color="primary" variant="flat" onPress={refreshStatus}>
              Refresh Status
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <FiServer />
              Server Status
            </h4>
          </CardHeader>
          <CardBody>
            {systemStatus ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Status</span>
                  <Chip color="success" variant="flat">
                    {systemStatus.status || 'Online'}
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Version</span>
                  <span className="font-medium">{systemStatus.version || '1.0.0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-600">Uptime</span>
                  <span className="font-medium">{systemStatus.uptime || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-default-500">
                Loading system status...
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <FiActivity />
              Performance
            </h4>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-default-600">CPU Usage</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} color="primary" className="max-w-md" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-default-600">Memory Usage</span>
                  <span className="font-medium">67%</span>
                </div>
                <Progress value={67} color="warning" className="max-w-md" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-default-600">Disk Usage</span>
                  <span className="font-medium">23%</span>
                </div>
                <Progress value={23} color="success" className="max-w-md" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <FiShield />
            System Actions
          </h4>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              color="primary"
              variant="flat"
              startContent={<FiDatabase />}
              className="h-16"
              onPress={() => toast.info('Backup initiated (simulated)')}
            >
              <div className="text-center">
                <p className="font-medium">Database Backup</p>
                <p className="text-xs text-default-500">Create system backup</p>
              </div>
            </Button>

            <Button
              color="secondary"
              variant="flat"
              startContent={<FiActivity />}
              className="h-16"
              onPress={() => toast.info('Cache cleared (simulated)')}
            >
              <div className="text-center">
                <p className="font-medium">Clear Cache</p>
                <p className="text-xs text-default-500">Clear system cache</p>
              </div>
            </Button>

            <Button
              color="warning"
              variant="flat"
              startContent={<FiSettings />}
              className="h-16"
              onPress={() => toast.info('Maintenance mode toggled (simulated)')}
            >
              <div className="text-center">
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-xs text-default-500">Enable/disable maintenance</p>
              </div>
            </Button>

            <Button
              color="danger"
              variant="flat"
              startContent={<FiPower />}
              className="h-16"
              onPress={handleShutdownServer}
            >
              <div className="text-center">
                <p className="font-medium">Server Shutdown</p>
                <p className="text-xs text-default-500">Graceful shutdown</p>
              </div>
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <FiServer />
            System Information
          </h4>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-semibold text-default-700">Environment</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Environment</span>
                  <Chip color="primary" variant="flat" size="sm">Production</Chip>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Node.js Version</span>
                  <span>v18.17.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Database</span>
                  <span>PostgreSQL 15.3</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-default-700">Security</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">SSL Certificate</span>
                  <Chip color="success" variant="flat" size="sm">Valid</Chip>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Last Security Scan</span>
                  <span>2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Firewall Status</span>
                  <Chip color="success" variant="flat" size="sm">Active</Chip>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Shutdown Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FiPower className="text-danger" />
              Server Shutdown
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-danger/10 border border-danger/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertTriangle className="text-danger" />
                  <span className="font-semibold text-danger">Critical Action Warning</span>
                </div>
                <p className="text-small">
                  This will shut down the entire server. All users will be disconnected and the system will be unavailable until manually restarted.
                </p>
              </div>

              <Input
                label="Shutdown Delay (seconds)"
                placeholder="Enter delay in seconds"
                value={shutdownDelay}
                onChange={(e) => setShutdownDelay(e.target.value)}
                type="number"
                min="0"
                max="300"
              />

              <Input
                label="Shutdown Reason"
                placeholder="Enter reason for shutdown (optional)"
                value={shutdownReason}
                onChange={(e) => setShutdownReason(e.target.value)}
              />

              <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
                <p className="text-small font-medium">
                  ⚠️ This action is irreversible and will affect all users immediately.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmShutdown}>
              Shutdown Server
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SystemManagement;
