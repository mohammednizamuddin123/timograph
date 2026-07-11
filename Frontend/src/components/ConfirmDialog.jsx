import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ConfirmDialog = () => {
  const { confirmDialog, closeConfirm } = useContext(AppContext);

  if (!confirmDialog.isOpen) return null;

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    closeConfirm();
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const dialogStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '300px',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    margin: '0 0.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Confirm Action</h3>
        <p style={{ marginBottom: '2rem', color: '#666' }}>{confirmDialog.message}</p>
        <div>
          <button 
            style={{ ...buttonStyle, backgroundColor: '#dc3545', color: '#fff' }} 
            onClick={handleConfirm}
          >
            Confirm
          </button>
          <button 
            style={{ ...buttonStyle, backgroundColor: '#e0e0e0', color: '#333' }} 
            onClick={closeConfirm}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
