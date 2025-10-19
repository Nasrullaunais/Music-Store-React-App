import { ReactNode } from 'react';
import { Modal, ModalContent } from '@heroui/react';
import { motion } from 'framer-motion';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  placement?: 'auto' | 'top' | 'bottom' | 'center' | 'top-center' | 'bottom-center';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  backdrop?: 'transparent' | 'opaque' | 'blur';
}

const AnimatedModal = ({
  isOpen,
  onClose,
  children,
  placement = 'top-center',
  size = 'md',
  backdrop = 'blur'
}: AnimatedModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
      size={size}
      backdrop={backdrop}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900/50 to-zinc-900/10 backdrop-blur-md",
        wrapper: "z-[999]",
      }}
      motionProps={{
        variants: {
          enter: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }
          },
          exit: {
            scale: 0.95,
            opacity: 0,
            y: -20,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 1, 1]
            }
          }
        }
      }}
    >
      <ModalContent className="!bg-white/30 backdrop-blur-lg border border-white/50 shadow-2xl overflow-hidden">
        {(_onCloseModal) => (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AnimatedModal;
