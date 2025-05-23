import React, { useState, useEffect, type FormEvent } from 'react';
import { sellTokens, getTokenBalance } from '../api/tokenApi';
import { useAuth } from '../pages/AuthContext';
import type { SellRequest } from '../interfaces/SellRequest';
import '../styles/Sell.css';
import '../styles/shared/FormPST.css';

interface SellResponse {
  success: boolean;
  message?: string; 
  transactionId?: string;
  amount?: number;
  newBalance?: number;
}

const Sell: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState<SellRequest>({
    userId: userId|| '',
    amount: 0,
  });

  useEffect(() => {
    if (currentUser?.id) {
      setFormData(prev => ({ ...prev, userId: currentUser.id }));
      fetchUserBalance(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (formData.userId.trim() && !currentUser) {
      fetchUserBalance(formData.userId);
    }
  }, [formData.userId, currentUser]);

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
    if (!formData.userId.trim()) {
      setErrorMessage('ID de Usuario es requerido');
      return false;
    }
    if (formData.amount <= 0) {
      setErrorMessage('La cantidad debe ser mayor que 0');
      return false;
    }
    if (userBalance !== null && formData.amount > userBalance) {
      setErrorMessage('Balance insuficiente para esta venta');
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
      const response = await sellTokens(formData);
      const data: SellResponse = response.data;
      setSuccessMessage('¡Venta de tokens procesada exitosamente!');
      if (data.newBalance !== undefined) {
        setUserBalance(data.newBalance);
      } else if (formData.userId) {
        fetchUserBalance(formData.userId);
      }
    } catch (error: unknown) {
      let message = 'La venta falló. Por favor, inténtelo de nuevo.';
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
      <h1 className="payment-title">Vender SanderCoin</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="form-payment">
        <div className="form-group">
          <label htmlFor="userId">Usuario</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            placeholder="Ingrese su usuario"
            disabled={loading || !!currentUser}
            className="form-input" disabled
          />
          {userBalance !== null && (
            <div className="user-balance">
              <span>Balance disponible: <strong>{userBalance.toFixed(4)} SND</strong></span>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="amount">Cantidad a Vender (SND)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            required
            min="0.0001"
            step="0.0001"
            placeholder="Ingrese la cantidad a vender"
            disabled={loading}
            className="form-input"
          />
          {userBalance !== null && formData.amount > 0 && (
            <div className="token-value">
              <span>Después de la venta: {(userBalance - formData.amount - 0.001).toFixed(4)} SND</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={loading || (userBalance !== null && formData.amount > userBalance)}
        >
          {loading ? 'Procesando...' : 'Vender Tokens'}
        </button>
      </form>
      {successMessage && (
        <div className="transaction-summary">
          <h2>Resumen de la Venta</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span>Usuario:</span>
              <span>{formData.userId}</span>
            </div>
            <div className="summary-item">
              <span>Tokens Vendidos:</span>
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
        <h3>Información de Venta</h3>
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
            <span className="info-label">Tasa de Cambio:</span>
            <span className="info-value">1:1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;