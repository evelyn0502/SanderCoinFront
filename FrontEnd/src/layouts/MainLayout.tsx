import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/SanderCoin.png';
import '../styles/MainLayout.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Verificar el estado de autenticación cuando el componente se monta y cuando cambia la ubicación
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const auth = localStorage.getItem('isAuthenticated') === 'true';
            setIsAuthenticated(!!token || auth);
        };

        checkAuthStatus();
        
        // Este evento personalizado se disparará desde la página de login después del inicio de sesión exitoso
        window.addEventListener('auth-change', checkAuthStatus);
        
        return () => {
            window.removeEventListener('auth-change', checkAuthStatus);
        };
    }, [location.pathname]); // Re-verificar cuando cambie la ruta

    // Verificar si el usuario intenta acceder a rutas protegidas sin estar autenticado
    useEffect(() => {
        const protectedRoutes = ['/comprar', '/vender', '/transferir', '/historial'];
        if (protectedRoutes.includes(location.pathname) && !isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [location.pathname, isAuthenticated, navigate]);

    const toggleGroup = (group: string) => {
        setOpenGroup(openGroup === group ? null : group);
    };

    // Función para manejar clics en rutas protegidas
    const handleProtectedRoute = (e: React.MouseEvent, route: string) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login', { state: { from: route } });
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        navigate('/');
        
        // Disparar evento de cambio de autenticación
        window.dispatchEvent(new Event('auth-change'));
        
        // Opcional: Mostrar mensaje de sesión cerrada exitosamente
    };

    // Cerrar menú al cambiar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1100) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [mobileMenuOpen]);

    const renderTransactionLinks = () => (
        <>
            <Link 
                to="/Payment" 
                onClick={(e) => handleProtectedRoute(e, '/comprar')}
                className={!isAuthenticated ? 'disabled-link' : ''}
            >
                Comprar {!isAuthenticated && <span className="lock-icon">🔒</span>}
            </Link>
            <Link 
                to="/Sell" 
                onClick={(e) => handleProtectedRoute(e, '/vender')}
                className={!isAuthenticated ? 'disabled-link' : ''}
            >
                Vender {!isAuthenticated && <span className="lock-icon">🔒</span>}
            </Link>
            <Link 
                to="/Transfer" 
                onClick={(e) => handleProtectedRoute(e, '/transferir')}
                className={!isAuthenticated ? 'disabled-link' : ''}
            >
                Transferir {!isAuthenticated && <span className="lock-icon">🔒</span>}
            </Link>
            {/*<Link 
                to="/historial" 
                onClick={(e) => handleProtectedRoute(e, '/historial')}
                className={!isAuthenticated ? 'disabled-link' : ''}
            >
                Historial {!isAuthenticated && <span className="lock-icon">🔒</span>}
            </Link>*/}
        </>
    );

    return (
        <div className="layout-container">
            <header className="header">
                <div className="logo-container">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="SanderCoin Logo"
                            className="logo"
                        />
                    </Link>
                </div>
                
                {/* Navegación Desktop */}
                <nav className="nav-desktop">
                    <Link to="/" className='nav-start'>Inicio</Link>
                    <div className="nav-group">
                        <div className="nav-group-title">
                            Transacciones {!isAuthenticated && <span className="lock-icon">🔒</span>} <span>▾</span>
                        </div>
                        <div className="nav-group-items">
                            {renderTransactionLinks()}
                        </div>
                    </div> 
                    <div className="nav-group">
                        <div className="nav-group-title">
                            Nosotros <span>▾</span>
                        </div>
                        <div className="nav-group-items">
                            <Link to="/AboutUs">Quiénes somos</Link>
                            {/*<Link to="/team">Equipo</Link>*/}
                        </div>
                    </div>
                    
                    {isAuthenticated ? (
                        <>
                            <div className="user-menu nav-group">
                                <div className="nav-group-title">
                                    Mi Cuenta <span>▾</span>
                                </div>
                                <div className="nav-group-items">
                                    {/*<Link to="/perfil">Mi Perfil</Link>
                                    <Link to="/configuracion">Configuración</Link>*/}
                                    <button onClick={handleLogout} className="logout-button-menu">Cerrar Sesión</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="Button-one">Registrarse</Link>
                            <Link to="/login" className="Button-two">Iniciar Sesión</Link>
                        </>
                    )}
                </nav>
                    
                {/* Botón Hamburguesa */}
                <button 
                    className="hamburger" 
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Abrir menú"
                >
                    ☰
                </button>
            </header>

            {/* Overlay y Navegación Móvil */}
            <div className={`nav-overlay ${mobileMenuOpen ? 'show' : ''}`} 
                onClick={() => setMobileMenuOpen(false)} />
            
            <nav className={`nav-mobile ${mobileMenuOpen ? 'show' : ''}`}>
                <button 
                    className="close-btn" 
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Cerrar menú"
                >
                    ✕
                </button>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
                
                <div className="nav-group-mobile">
                    <div 
                        className="nav-group-title-mobile"
                        onClick={() => toggleGroup('transacciones')}
                    >
                        Transacciones {!isAuthenticated && <span className="lock-icon">🔒</span>} <span>{openGroup === 'transacciones' ? '▴' : '▾'}</span>
                    </div>
                    <div className={`nav-group-items-mobile ${openGroup === 'transacciones' ? 'open' : ''}`}>
                        {renderTransactionLinks()}
                    </div>
                </div>
                
                <div className="nav-group-mobile">
                    <div 
                        className="nav-group-title-mobile"
                        onClick={() => toggleGroup('nosotros')}
                    >
                        Nosotros <span>{openGroup === 'nosotros' ? '▴' : '▾'}</span>
                    </div>
                    <div className={`nav-group-items-mobile ${openGroup === 'nosotros' ? 'open' : ''}`}>
                        <Link to="/AboutUs" onClick={() => setMobileMenuOpen(false)}>Quiénes somos</Link>
                        {/*<Link to="/team" onClick={() => setMobileMenuOpen(false)}>Equipo</Link>*/}
                    </div>
                </div>
                
                {isAuthenticated ? (
                    <div className="nav-group-mobile">
                        <div 
                            className="nav-group-title-mobile"
                            onClick={() => toggleGroup('cuenta')}
                        >
                            Mi Cuenta <span>{openGroup === 'cuenta' ? '▴' : '▾'}</span>
                        </div>
                        <div className={`nav-group-items-mobile ${openGroup === 'cuenta' ? 'open' : ''}`}>
                           {/*} <Link to="/perfil" onClick={() => setMobileMenuOpen(false)}>Mi Perfil</Link>
                            <Link to="/configuracion" onClick={() => setMobileMenuOpen(false)}>Configuración</Link>*/}
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }} 
                                className="logout-button-mobile"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                    </>
                )}
            </nav>

            <main className="content">{children}</main>
            
            <footer className="footer">
                © 2025 SanderCoin App. Todos los derechos reservados.
            </footer>
        </div>
    );
}