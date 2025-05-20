import React, { useState, useEffect, type FormEvent } from 'react';
import { distributeTokens, getTokenBalance, getTokenValue } from '../api/api';
import { useAuth } from '../pages/AuthContext'; // Asumiendo que tienes un contexto de autenticación

// Using your defined interfaces
export interface PaymentFormData {
  userId: string;
  amount: number;
  creditCardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
  amount?: number;
}

export interface TokenValue {
  value: number;
  timestamp: string;
}

const Payment: React.FC = () => {
  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [tokenValue, setTokenValue] = useState<number>(0);
  const [formData, setFormData] = useState<PaymentFormData>({
    userId: currentUser?.id || '', // Usar el ID del usuario actual si está disponible
    amount: 0,
    creditCardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  // Fetch user balance and token value on component mount
  useEffect(() => {
    fetchTokenValue();
    // Set up interval to update token value
    const intervalId = setInterval(fetchTokenValue, 60000); // Update every minute

    // If current user is available, set userId and fetch balance
    if (currentUser?.id) {
      setFormData(prev => ({ ...prev, userId: currentUser.id }));
      fetchUserBalance(currentUser.id);
    }
    
    return () => {
      clearInterval(intervalId); // Clean up interval on component unmount
    };
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

  const fetchTokenValue = async () => {
    try {
      const response = await getTokenValue();
      const tokenData: TokenValue = response.data;
      setTokenValue(tokenData.value);
    } catch (error) {
      console.error('Error fetching token value:', error);
      // Si falla, mantener el último valor conocido
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'creditCardNumber') {
      // Only allow numbers and limit to 16 digits
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numbersOnly.slice(0, 16) });
    } else if (name === 'cvv') {
      // Only allow numbers and limit to 3-4 digits
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numbersOnly.slice(0, 4) });
    } else if (name === 'amount') {
      // Only allow valid numbers for amount
      const amount = parseFloat(value) || 0;
      setFormData({ ...formData, [name]: amount });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Auto-format to MM/YY
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    setFormData({ ...formData, expirationDate: value });
  };

  const formatCreditCard = (value: string): string => {
    // Format as **** **** **** ****
    const groups = [];
    for (let i = 0; i < value.length; i += 4) {
      groups.push(value.slice(i, i + 4));
    }
    return groups.join(' ');
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

    // Check if card number starts with 9999 and has total 16 digits
    if (!formData.creditCardNumber.startsWith('9999') || formData.creditCardNumber.length !== 16) {
      setErrorMessage('El número de tarjeta debe comenzar con 9999 y tener 16 dígitos');
      return false;
    }

    // Check if CVV is 3 or 4 digits
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      setErrorMessage('CVV debe tener 3 o 4 dígitos');
      return false;
    }

    // Check if expiration date is valid and not expired
    if (!formData.expirationDate) {
      setErrorMessage('Por favor, ingrese la fecha de vencimiento');
      return false;
    }

    // Validate expiration date format (MM/YY)
    const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryPattern.test(formData.expirationDate)) {
      setErrorMessage('La fecha de vencimiento debe estar en formato MM/YY');
      return false;
    }

    // Parse expiration date
    const [month, year] = formData.expirationDate.split('/');
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10) + 2000; // Convert YY to 20YY
    
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await distributeTokens(formData);
      const data: PaymentResponse = response.data;
      
      setSuccessMessage('¡Pago procesado exitosamente!');
      console.log('Payment successful:', data);
      
      // Refresh the user balance after successful payment
      if (formData.userId) {
        fetchUserBalance(formData.userId);
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'El procesamiento del pago falló. Por favor, inténtelo de nuevo.'
      );
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

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
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