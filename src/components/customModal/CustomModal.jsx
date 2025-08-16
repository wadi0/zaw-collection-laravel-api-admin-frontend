import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import './customModal.scss'; // Import the SCSS file

const CustomModal = ({
    isOpen,
    onClose,
    title,
    children,
    isDarkMode,
    theme,
    // Size control props (optional)
    size = 'medium', // 'small', 'medium', 'large', 'xlarge', 'fullscreen'
    maxWidth,
    width,
    height,
    // Behavior props (optional)
    className = '',
    hideHeader = false,
    closeOnBackdrop = true,
    closeOnEscape = true
}) => {
    const { openModal, closeModal } = useApp();

    // Sync with global modal state
    useEffect(() => {
        if (isOpen) {
            openModal();
        } else {
            closeModal();
        }
    }, [isOpen, openModal, closeModal]);

    // Handle close with both local and global state
    const handleClose = () => {
        closeModal();
        if (onClose) {
            onClose();
        }
    };

    // Handle backdrop click
    const handleBackdropClick = () => {
        if (closeOnBackdrop) {
            handleClose();
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isOpen && closeOnEscape) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, closeOnEscape, handleClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Get theme colors
    const t = isDarkMode ? theme.dark : theme.light;

    // Size mapping
    const sizeClasses = {
        small: 'modal-small',
        medium: 'modal-medium',
        large: 'modal-large',
        xlarge: 'modal-xlarge',
        fullscreen: 'modal-fullscreen'
    };

    // Custom styles for width/height props
    const customStyles = {};
    if (maxWidth) customStyles.maxWidth = maxWidth;
    if (width) customStyles.width = width;
    if (height) customStyles.height = height;

    const modalContent = (
        <div
            className={`custom-modal-overlay ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`custom-modal ${sizeClasses[size]} ${className}`}
                style={{
                    background: t.cardBg,
                    border: `1px solid ${t.border}`,
                    ...customStyles
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                {!hideHeader && (
                    <div
                        className="custom-modal-header"
                        style={{
                            borderBottom: `1px solid ${t.border}`,
                            background: t.cardBg,
                        }}
                    >
                        <h2
                            className="custom-modal-title"
                            style={{ color: t.text }}
                        >
                            {title}
                        </h2>
                        <button
                            className="custom-modal-close"
                            onClick={handleClose}
                            style={{ color: t.textSec }}
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Modal Body */}
                <div className={`custom-modal-body ${hideHeader ? 'no-header' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );

    // Render modal using portal to document.body
    return createPortal(modalContent, document.body);
};

export default CustomModal;


// <CustomModal
//     // Core required props
//     isOpen={modalState.isOpen}
//     onClose={closeModal}
//     title={modalState.type === 'add' ? 'Add New Product' : 'Edit Product'}
//     isDarkMode={isDarkMode}
//     theme={theme}
//
//     // Size control (optional)
//     size="large"
//     maxWidth="900px"
//     width="800px"
//     height="600px"
//
//     // Behavior control (optional)
//     className="product-modal special-modal"
//     hideHeader={false}
//     closeOnBackdrop={true}
//     closeOnEscape={true}
// >
//     {/* Your modal content */}
//     <YourFormComponent />
// </CustomModal>