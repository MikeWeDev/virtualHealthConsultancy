// components/UI/Modal.tsx

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-md max-w-lg w-full">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
              {children}
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default Modal;
  