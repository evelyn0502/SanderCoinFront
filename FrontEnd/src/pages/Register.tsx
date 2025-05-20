import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, verifyUser } from '../api/api';
import '../styles/Register.css';
import '../styles/Register.css';

export default function Register() {
    const [userId, setUserId] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
    const [registeredUserId, setRegisteredUserId] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await registerUser({ userId, email });
            setSuccess(true);
            setShowVerification(true);
            setRegisteredUserId(userId);
            setUserId('');
            setEmail('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
            console.error('Error de registro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await verifyUser({ userId: registeredUserId || userId, code: verificationCode });
            setVerificationSuccess(true);
            setVerificationCode('');
            // Redirigir al login después de verificación exitosa
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al verificar el código');
            console.error('Error de verificación:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Efectos de fondo */}
            <div className="register-background">
                <div className="gradient-circle circle-1"></div>
                <div className="gradient-circle circle-2"></div>
                <div className="gradient-circle circle-3"></div>
                
                {/* Líneas de conexión animadas */}
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
            
            <div className="register-content">
                <div className="register-header">
                    <h1 className="register-headline">Únete a la revolución de las finanzas digitales<span className="register-symbol">®</span></h1>
                    <p className="register-tagline">Sé parte del futuro con SanderCoin®</p>
                </div>
                
                <div className="register-card">
                    {!showVerification ? (
                        <>
                            <h2 className="register-title">Crear una cuenta</h2>
                            
                            {success && (
                                <div className="success-message">
                                    ¡Registro exitoso! Revisa tu correo para verificar tu cuenta.
                                </div>
                            )}
                            
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="register-form">
                                <div className="form-group">
                                    <label htmlFor="userId">ID de Usuario</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">👤</span>
                                        <input
                                            type="text"
                                            id="userId"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            placeholder="Crea un ID único"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Correo Electrónico</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">✉️</span>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="register-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Procesando...' : 'Registrarse'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="register-title">Verificar cuenta</h2>
                            
                            {verificationSuccess && (
                                <div className="success-message">
                                    ¡Verificación exitosa! Serás redirigido al inicio de sesión en unos segundos.
                                </div>
                            )}
                            
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            
                            {!verificationSuccess && (
                                <form onSubmit={handleVerification} className="register-form">
                                    <div className="form-group">
                                        <label htmlFor="userId">ID de Usuario</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">👤</span>
                                            <input
                                                type="text"
                                                id="userId"
                                                value={registeredUserId || userId}
                                                onChange={(e) => {
                                                    if (!registeredUserId) setUserId(e.target.value);
                                                }}
                                                placeholder="Tu ID de usuario"
                                                required
                                                disabled={loading || !!registeredUserId}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="verificationCode">Código de Verificación</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">🔐</span>
                                            <input
                                                type="text"
                                                id="verificationCode"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                placeholder="Ingresa el código recibido por correo"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="register-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'Verificando...' : 'Verificar Código'}
                                    </button>
                                </form>
                            )}
                            
                            {!verificationSuccess && (
                                <button 
                                    onClick={() => setShowVerification(false)} 
                                    className="back-button"
                                >
                                    Volver al registro
                                </button>
                            )}
                        </>
                    )}
                    
                    <div className="login-link">
                        ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
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