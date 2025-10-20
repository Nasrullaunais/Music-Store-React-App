import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react';
import { FiAlertCircle, FiClock, FiInfo } from 'react-icons/fi';
import { BanErrorResponse } from '@/api/authApi';

interface BanNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  banDetails: BanErrorResponse;
}

const BanNotificationModal = ({ isOpen, onClose, banDetails }: BanNotificationModalProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (bannedUntil?: string) => {
    if (!bannedUntil) return 'Unknown';

    const now = new Date();
    const until = new Date(bannedUntil);
    const diff = until.getTime() - now.getTime();

    if (diff <= 0) return 'Ban has expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "bg-white/90 backdrop-blur-lg border border-danger/30 shadow-2xl",
        header: "border-b border-danger/20",
        body: "py-6",
        footer: "border-t border-danger/20"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/20 rounded-full">
              <FiAlertCircle className="text-2xl text-danger" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-danger">Account Temporarily Banned</h3>
              <p className="text-sm text-default-500 font-normal">Access to your account has been restricted</p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Ban Reason */}
            <div className="bg-danger/10 backdrop-blur-sm rounded-lg p-4 border border-danger/20">
              <div className="flex items-start gap-3">
                <FiInfo className="text-danger text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-danger mb-1">Reason for Ban</h4>
                  <p className="text-default-700">
                    {banDetails.banReason || 'No reason provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="bg-warning/10 backdrop-blur-sm rounded-lg p-4 border border-warning/20">
              <div className="flex items-start gap-3">
                <FiClock className="text-warning text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-warning mb-2">Time Remaining</h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-warning">
                      {getTimeRemaining(banDetails.bannedUntil)}
                    </p>
                    <p className="text-sm text-default-600">
                      Ban expires on: <span className="font-medium">{formatDate(banDetails.bannedUntil)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">What This Means</h4>
              <ul className="text-sm text-default-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You cannot access your account during the ban period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Your account will be automatically reactivated when the ban expires</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You will receive an email notification when the ban is lifted</span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="text-center pt-2">
              <p className="text-sm text-default-600">
                If you believe this ban was issued in error, please contact our support team.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            variant="flat"
            onPress={onClose}
            className="w-full bg-primary/20 backdrop-blur-md hover:bg-primary/30"
          >
            I Understand
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BanNotificationModal;

