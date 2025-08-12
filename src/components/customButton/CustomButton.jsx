import React from 'react';

const CustomButton = ({
  isLoading,
  type = "button",
  label,
  btnClassName = "",
  onClick,
  disabled = false
}) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`default-submit-btn login-btn ${btnClassName}`}
      style={{
        width: '100%',
        background: isDisabled
          ? '#94a3b8'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.2s ease-in-out',
        outline: 'none',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default CustomButton;