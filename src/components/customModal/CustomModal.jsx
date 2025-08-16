import React, { useEffect } from 'react';
import { X } from "lucide-react";
import {useApp} from "../../context/AppContext.jsx";

const CustomModal = ({ isOpen, onClose, title, children, isDarkMode, theme }) => {
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

    // Handle escape key
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const t = isDarkMode ? theme.dark : theme.light;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                zIndex: 9999, // Very high z-index to stay above navbar
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    background: t.cardBg,
                    borderRadius: '12px',
                    border: `1px solid ${t.border}`,
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 10000 // Even higher z-index for modal content
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.5rem 1.5rem 1rem 1.5rem',
                        borderBottom: `1px solid ${t.border}`,
                        position: 'sticky',
                        top: 0,
                        background: t.cardBg,
                        borderRadius: '12px 12px 0 0',
                        zIndex: 10001
                    }}
                >
                    <h2 style={{ margin: 0, color: t.text, fontSize: '1.25rem' }}>
                        {title}
                    </h2>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: t.textSec,
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = t.border;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '1.5rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;