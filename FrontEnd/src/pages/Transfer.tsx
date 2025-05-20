import React, { useState, useEffect, type FormEvent } from 'react';
import { transferTokens, getTokenBalance } from '../api/api';
import { useAuth } from '../pages/AuthContext'; // Asumiendo que tienes un contexto de autenticación
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
  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [formData, setFormData] = useState<TransferRequest>({
    senderId: currentUser?.id || '', // Usar el ID del usuario actual si está disponible
    receiverId: '',
    amount: 0,
  });

  // Fetch user balance on component mount
  useEffect(() => {
    // If current user is available, set senderId and fetch balance
    if (currentUser?.id) {
      setFormData(prev => ({ ...prev, senderId: currentUser.id }));
      fetchUserBalance(currentUser.id);
    }
  }, [currentUser]);

  // Fetch user balance when senderId changes manually (for cases where no auth context)
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
      // Only allow valid numbers for amount
      const amount = parseFloat(value) || 0;
      setFormData({ ...formData, [name]: amount });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    // Check if senderId is provided
    if (!formData.senderId.trim()) {
      setErrorMessage('ID de Remitente es requerido');
      return false;
    }

    // Check if receiverId is provided
    if (!formData.receiverId.trim()) {
      setErrorMessage('ID de Destinatario es requerido');
      return false;
    }

    // Check if amount is greater than 0
    if (formData.amount <= 0) {
      setErrorMessage('La cantidad debe ser mayor que 0');
      return false;
    }

    // Check if sender has enough balance
    if (userBalance !== null && formData.amount > userBalance) {
      setErrorMessage('Balance insuficiente para esta transferencia');
      return false;
    }

    // Check if sender and receiver are not the same
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await transferTokens(formData);
      const data: TransferResponse = response.data;
      
      setSuccessMessage('¡Transferencia procesada exitosamente!');
      console.log('Transfer successful:', data);
      
      // Update the displayed balance with the new balance from the response
      if (data.newBalance !== undefined) {
        setUserBalance(data.newBalance);
      } 
      // Otherwise, refresh the user balance after successful transfer
      else if (formData.senderId) {
        fetchUserBalance(formData.senderId);
      }
    } catch (error: any) {
      console.error('Transfer failed:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'La transferencia falló. Por favor, inténtelo de nuevo.'
      );
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
            disabled={loading || !!currentUser} // Deshabilitar si hay un usuario conectado
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