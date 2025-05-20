import { useEffect, useState } from 'react';
import { getBlockchainStatistics } from '../api/api';
import '../styles/Home.css';

export default function Home() {
    const [stats, setStats] = useState<any>(null);
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [, setPrevPhrase] = useState(0);

    const phrases = [
        "Revolucionando el futuro de las finanzas digitales",
        "Seguridad blockchain al alcance de todos",
        "Tu puerta de entrada al mundo cripto"
    ];

    useEffect(() => {
        getBlockchainStatistics()
        .then((res) => setStats(res.data))
        .catch((err) => console.error('Error al obtener datos:', err));

        const interval = setInterval(() => {
            setPrevPhrase(currentPhrase);
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        }, 8000); // 8 segundos

        return () => clearInterval(interval);
    }, [currentPhrase]);

    return (
        <div className="home-container">
            {/* Sección Hero */}
            <section className="hero-section">
                <div className="particles">
                    {/* Partículas originales */}
                    {[...Array(12)].map((_, i) => (
                        <div 
                            key={`particle-${i}`}
                            className="particle"
                            style={{
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: Math.random() * 0.5 + 0.3
                            }}
                        />
                    ))}
                    
                    {/* Nuevas monedas animadas */}
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={`coin-${i}`}
                            className="coin-particle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 2}s`,
                                width: `${Math.random() * 15 + 10}px`,
                                height: `${Math.random() * 15 + 10}px`
                            }}
                        />
                    ))}
                </div>
                
                <div className="phrase-container">
                    <h1 className="dynamic-phrase" key={currentPhrase}>
                        {phrases[currentPhrase]}
                    </h1>
                    <p className="subphrase">Descubre el poder de SanderCoin®</p>
                    <button className="cta-button">Explorar</button>
                </div>
            </section>

            {/* Sección de Cards con línea de conexión */}
            <section className="image-section">
                <div className="full-width-image">
                    <div className="info-cards">
                        <div className="info-card">
                            <h3>Transacciones Instantáneas</h3>
                            <p>0.001 SND de comisión</p>
                            {stats && <span>{stats.totalTransactions} TX hoy</span>}
                        </div>
                        <div className="info-card">
                            <h3>Valor en Tiempo Real</h3>
                            <p>Actualizado cada minuto</p>
                            {stats && <span>${stats.tokenValue.toFixed(4)}</span>}
                        </div>
                        <div className="info-card">
                            <h3>Comunidad Activa</h3>
                            <p>Únete a nuestros usuarios</p>
                            {stats && <span>{stats.activeUsers}+ miembros</span>}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección FAQ */}
            <section className="faq-section">
                <h2>Preguntas Frecuentes</h2>
                <div className="faq-container">
                    <div className="faq-item">
                        <h3>¿Cómo compro SanderCoin?</h3>
                        <p>Puedes adquirir SND a través de nuestro exchange oficial o en plataformas asociadas usando USD o otras criptomonedas.</p>
                    </div>
                    <div className="faq-item">
                        <h3>¿Qué hace único a SanderCoin?</h3>
                        <p>Nuestra tecnología de consenso avanzada permite transacciones más rápidas y seguras que las blockchains tradicionales.</p>
                    </div>
                    <div className="faq-item">
                        <h3>¿Es seguro invertir en SND?</h3>
                        <p>Como toda criptomoneda, tiene volatilidad, pero nuestra tecnología y equipo garantizan la seguridad de tus activos.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}