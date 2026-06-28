import * as Dialog from '@radix-ui/react-dialog';
import { HiXMark } from 'react-icons/hi2';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, setIsOpen, title, children }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <Dialog.Content
          // Avoid close button being auto-focused initially, as pressing space will otherwise close the modal
          onOpenAutoFocus={(event: Event) => event.preventDefault()}
          className="fixed top-[50%] left-[50%] z-40 w-[98vw] max-w-2xl -translate-x-[50%] -translate-y-[50%] bg-container-elevated border border-container-high p-4 sm:w-[90vw]"
        >
          <Dialog.Title className="text-center font-poppins sm:text-lg text-textPrimary">
            {title}
          </Dialog.Title>
          <Dialog.Close
            className="absolute right-2 top-2 bg-container-low p-1.5 hover:bg-container-high text-textPrimary"
            aria-label="Close"
          >
            <HiXMark size="18" />
          </Dialog.Close>
          <div className="px-2 py-3 sm:p-[25px_55px]">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
