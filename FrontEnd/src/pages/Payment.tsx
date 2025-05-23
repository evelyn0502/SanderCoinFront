import React, { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../pages/AuthContext';
import type { PaymentFormData, TokenValue } from '../interfaces/Payment';
import { distributeTokens, getTokenBalance, getTokenValue } from '../api/tokenApi';
import '../styles/shared/FormPST.css';

const Payment: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [tokenValue, setTokenValue] = useState(0);

  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState<PaymentFormData>({
    userId: userId || '',
    amount: 0,
    creditCardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  useEffect(() => {
    fetchTokenValue();
    const intervalId = setInterval(fetchTokenValue, 60000);
    if (currentUser?.id) {
      setFormData(prev => ({ ...prev, userId: currentUser.id }));
      fetchUserBalance(currentUser.id);
    }
    return () => clearInterval(intervalId);
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
    } catch {
      setUserBalance(null);
    }
  };

  const fetchTokenValue = async () => {
    try {
      const response = await getTokenValue();
      const tokenData: TokenValue = response.data;
      setTokenValue(tokenData.value);
    } catch (error) {
    console.error('Error al obtener el valor del token:', error);
  }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'creditCardNumber') {
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numbersOnly.slice(0, 16) });
    } else if (name === 'cvv') {
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numbersOnly.slice(0, 4) });
    } else if (name === 'amount') {
      const amount = parseFloat(value) || 0;
      setFormData({ ...formData, [name]: amount });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormData({ ...formData, expirationDate: value });
  };

  const formatCreditCard = (value: string): string => {
    const groups = [];
    for (let i = 0; i < value.length; i += 4) {
      groups.push(value.slice(i, i + 4));
    }
    return groups.join(' ');
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
    if (!formData.creditCardNumber.startsWith('9999') || formData.creditCardNumber.length !== 16) {
      setErrorMessage('El número de tarjeta debe comenzar con 9999 y tener 16 dígitos');
      return false;
    }
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      setErrorMessage('CVV debe tener 3 o 4 dígitos');
      return false;
    }
    if (!formData.expirationDate) {
      setErrorMessage('Por favor, ingrese la fecha de vencimiento');
      return false;
    }
    const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryPattern.test(formData.expirationDate)) {
      setErrorMessage('La fecha de vencimiento debe estar en formato MM/YY');
      return false;
    }
    const [month, year] = formData.expirationDate.split('/');
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10) + 2000;
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      setErrorMessage('La tarjeta ha expirado');
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
      await distributeTokens(formData);
      setSuccessMessage('¡Pago procesado exitosamente!');
      if (formData.userId) {
        fetchUserBalance(formData.userId);
      }
    } catch (error: unknown) {
      let message = 'El procesamiento del pago falló. Por favor, inténtelo de nuevo.';
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
      <h1 className="payment-title">Comprar SanderCoin</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="payment-form">
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
            disabled={loading || !!currentUser} disabled
          />
          {userBalance !== null && (
            <div className="user-balance">
              <span>Balance actual: <strong>{userBalance.toFixed(4)} SND</strong></span>
            </div>
          )}
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
            min="1"
            step="0.01"
            placeholder="Ingrese la cantidad"
            disabled={loading}
          />
          {formData.amount > 0 && tokenValue > 0 && (
            <div className="token-value">
              <span>Valor aproximado: $USD {(formData.amount * tokenValue).toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="creditCardNumber">Número de Tarjeta</label>
          <input
            type="text"
            id="creditCardNumber"
            name="creditCardNumber"
            value={formData.creditCardNumber}
            onChange={handleChange}
            required
            placeholder="9999XXXXXXXXXXXX"
            maxLength={16}
            disabled={loading}
          />
          {formData.creditCardNumber && (
            <div className="formatted-card">
              {formatCreditCard(formData.creditCardNumber)}
            </div>
          )}
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="expirationDate">Fecha de Vencimiento</label>
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleExpirationDateChange}
              required
              placeholder="MM/YY"
              maxLength={5}
              disabled={loading}
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              required
              placeholder="CVV"
              maxLength={4}
              disabled={loading}
            />
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Procesando...' : 'Comprar Tokens'}
        </button>
      </form>
      {successMessage && (
        <div className="transaction-summary">
          <h2>Resumen de la Transacción</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span>Tokens Comprados:</span>
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
        <h3>Información de SanderCoin</h3>
        <div className="info-stats">
          <div className="info-stat">
            <span className="info-label">Valor Actual:</span>
            <span className="info-value">${tokenValue.toFixed(4)} USD</span>
          </div>
          <div className="info-stat">
            <span className="info-label">Comisión:</span>
            <span className="info-value">0.001 SND</span>
          </div>
          <div className="info-stat">
            <span className="info-label">Actualizado:</span>
            <span className="info-value">cada minuto</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;