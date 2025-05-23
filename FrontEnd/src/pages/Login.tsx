import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import '../styles/shared/FeaturesPanel.css';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (password === 'admin') {
        localStorage.setItem('token', 'fake-token-123');
        localStorage.setItem('userId', userId);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response === 'object'
      ) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Error al iniciar sesión'
        );
      } else {
        setError('Error al iniciar sesión');
      }
      console.error('Error de inicio de sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-circle circle-1"></div>
        <div className="gradient-circle circle-2"></div>
        <div className="gradient-circle circle-3"></div>
        <div className="connection-lines">
          {[...Array(10)].map((_, i) => (
            <div
              key={`line-${i}`}
              className="connection-line"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="login-content">
        <div className="login-header">
          <h1 className="login-title">
            SanderCoin<span className="register-symbol">®</span>
          </h1>
          <p className="login-subtitle">Tu portal a las finanzas del futuro</p>
        </div>

        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="userId">ID de Usuario</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Ingresa tu ID"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          <div className="register-link">
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </div>

        <div className="benefits-section">
            <div className="benefit-card">
                <div className="feature-icon">🔒</div>
                <div className="benefit-text">
                    <h3>Seguridad Avanzada</h3>
                    <p>Protección de última generación para tus activos digitales</p>
                </div>
            </div>
            
            <div className="benefit-card">
                <div className="feature-icon">📊</div>
                <div className="benefit-text">
                    <h3>Análisis en Tiempo Real</h3>
                    <p>Estadísticas y tendencias actualizadas al instante</p>
                </div>
            </div>
            
            <div className="benefit-card">
                <div className="feature-icon">💰</div>
                <div className="benefit-text">
                    <h3>Comisiones Mínimas</h3>
                    <p>Transacciones más económicas del mercado</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}