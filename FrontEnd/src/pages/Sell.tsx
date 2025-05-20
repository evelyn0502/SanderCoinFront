import React, { useState, useEffect, type FormEvent } from 'react';
import { sellTokens, getTokenBalance } from '../api/api';
import { useAuth } from '../pages/AuthContext'; // Asumiendo que tienes un contexto de autenticación
import '../styles/Sell.css';

// Interfaces
export interface SellRequest {
  userId: string;
  amount: number;
}

export interface SellResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
  amount?: number;
  newBalance?: number;
}

const Sell: React.FC = () => {
  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [formData, setFormData] = useState<SellRequest>({
    userId: currentUser?.id || '', // Usar el ID del usuario actual si está disponible
    amount: 0,
  });

  // Fetch user balance on component mount
  useEffect(() => {
    // If current user is available, set userId and fetch balance
    if (currentUser?.id) {
      setFormData(prev => ({ ...prev, userId: currentUser.id }));
      fetchUserBalance(currentUser.id);
    }
  }, [currentUser]);

  // Fetch user balance when userId changes manually (for cases where no auth context)
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
      // Only allow valid numbers for amount
      const amount = parseFloat(value) || 0;
      setFormData({ ...formData, [name]: amount });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    // Check if userId is provided
    if (!formData.userId.trim()) {
      setErrorMessage('ID de Usuario es requerido');
      return false;
    }

    // Check if amount is greater than 0
    if (formData.amount <= 0) {
      setErrorMessage('La cantidad debe ser mayor que 0');
      return false;
    }

    // Check if user has enough balance
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await sellTokens(formData);
      const data: SellResponse = response.data;
      
      setSuccessMessage('¡Venta de tokens procesada exitosamente!');
      console.log('Sell successful:', data);
      
      // Update the displayed balance with the new balance from the response
      if (data.newBalance !== undefined) {
        setUserBalance(data.newBalance);
      } 
      // Otherwise, refresh the user balance after successful sell
      else if (formData.userId) {
        fetchUserBalance(formData.userId);
      }
    } catch (error: any) {
      console.error('Sell failed:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'La venta falló. Por favor, inténtelo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Vender SanderCoin</h1>
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="userId">ID de Usuario</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
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