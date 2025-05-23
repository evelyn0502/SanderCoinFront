import React, { useState, useEffect, type FormEvent } from 'react';
import { transferTokens, getTokenBalance } from '../api/tokenApi';
import { useAuth } from '../pages/AuthContext';
import '../styles/Transfer.css';

// Interfaces
export interface TransferRequest {
  senderId: string;
  receiverId: string;
  amount: number;
}

export interface TransferResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
  amount?: number;
  newBalance?: number;
}

const Transfer: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [formData, setFormData] = useState<TransferRequest>({
    senderId: currentUser?.id || '',
    receiverId: '',
    amount: 0,
  });

  useEffect(() => {
    if (currentUser?.id) {
      setFormData(prev => ({ ...prev, senderId: currentUser.id }));
      fetchUserBalance(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (formData.senderId.trim() && !currentUser) {
      fetchUserBalance(formData.senderId);
    }
  }, [formData.senderId, currentUser]);

  const fetchUserBalance = async (userId: string) => {
    try {
      const response = await getTokenBalance(userId);
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setUserBalance(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const amount = parseFloat(value) || 0;
      setFormData({ ...formData, [name]: amount });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.senderId.trim()) {
      setErrorMessage('ID de Remitente es requerido');
      return false;
    }
    if (!formData.receiverId.trim()) {
      setErrorMessage('ID de Destinatario es requerido');
      return false;
    }
    if (formData.amount <= 0) {
      setErrorMessage('La cantidad debe ser mayor que 0');
      return false;
    }
    if (userBalance !== null && formData.amount > userBalance) {
      setErrorMessage('Balance insuficiente para esta transferencia');
      return false;
    }
    if (formData.senderId === formData.receiverId) {
      setErrorMessage('No puedes transferir tokens a ti mismo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await transferTokens(formData);
      const data: TransferResponse = response.data;
      setSuccessMessage('¡Transferencia procesada exitosamente!');
      if (data.newBalance !== undefined) {
        setUserBalance(data.newBalance);
      } else if (formData.senderId) {
        fetchUserBalance(formData.senderId);
      }
    } catch (error: unknown) {
      let message = 'La transferencia falló. Por favor, inténtelo de nuevo.';
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response === 'object'
      ) {
        message =
          (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          message;
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Transferir SanderCoin</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="senderId">ID de Remitente</label>
          <input
            type="text"
            id="senderId"
            name="senderId"
            value={formData.senderId}
            onChange={handleChange}
            required
            placeholder="Ingrese su ID de usuario"
            disabled={loading || !!currentUser}
          />
          {userBalance !== null && (
            <div className="user-balance">
              <span>Balance disponible: <strong>{userBalance.toFixed(4)} SND</strong></span>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="receiverId">ID de Destinatario</label>
          <input
            type="text"
            id="receiverId"
            name="receiverId"
            value={formData.receiverId}
            onChange={handleChange}
            required
            placeholder="Ingrese el ID del destinatario"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Cantidad (SND)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            required
            min="0.0001"
            step="0.0001"
            placeholder="Ingrese la cantidad a transferir"
            disabled={loading}
          />
          {userBalance !== null && formData.amount > 0 && (
            <div className="token-value">
              <span>Después de transferencia: {(userBalance - formData.amount - 0.001).toFixed(4)} SND</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || (userBalance !== null && formData.amount > userBalance)}
        >
          {loading ? 'Procesando...' : 'Transferir Tokens'}
        </button>
      </form>
      {successMessage && (
        <div className="transaction-summary">
          <h2>Resumen de la Transferencia</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span>Destinatario:</span>
              <span>{formData.receiverId}</span>
            </div>
            <div className="summary-item">
              <span>Tokens Transferidos:</span>
              <span>{formData.amount} SND</span>
            </div>
            <div className="summary-item">
              <span>Nuevo Balance:</span>
              <span>{userBalance !== null ? userBalance.toFixed(4) : '--'} SND</span>
            </div>
            <div className="summary-item">
              <span>Comisión:</span>
              <span>0.001 SND</span>
            </div>
          </div>
        </div>
      )}
      <div className="information-panel">
        <h3>Información de Transferencia</h3>
        <div className="info-stats">
          <div className="info-stat">
            <span className="info-label">Comisión:</span>
            <span className="info-value">0.001 SND</span>
          </div>
          <div className="info-stat">
            <span className="info-label">Tiempo de Procesado:</span>
            <span className="info-value">Instantáneo</span>
          </div>
          <div className="info-stat">
            <span className="info-label">Límite:</span>
            <span className="info-value">Sin límite</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;