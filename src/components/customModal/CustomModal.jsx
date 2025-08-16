import React from 'react';
import {X} from "lucide-react";

const CustomModal = ({isOpen, onClose, title, children, isDarkMode, theme}) => {
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
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}
            onClick={onClose}
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
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
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
                        borderBottom: `1px solid ${t.border}`
                    }}
                >
                    <h2 style={{margin: 0, color: t.text, fontSize: '1.25rem'}}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: t.textSec,
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{padding: '1.5rem'}}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;