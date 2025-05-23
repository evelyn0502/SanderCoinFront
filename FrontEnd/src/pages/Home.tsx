import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlockchainStatistics } from '../api/blockchainApi';
import '../styles/Home.css';

interface BlockchainStats {
  totalTransactions: number;
  tokenValue: number;
  activeUsers: number;
}

const PHRASES = [
  "Revolucionando el futuro de las finanzas digitales",
  "Seguridad blockchain al alcance de todos",
  "Tu puerta de entrada al mundo cripto"
];

export default function Home() {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getBlockchainStatistics()
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Error al obtener datos:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % PHRASES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        key: `particle-${i}`,
        style: {
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5 + 0.3
        }
      })),
    []
  );

  const coins = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        key: `coin-${i}`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 2}s`,
          width: `${Math.random() * 15 + 10}px`,
          height: `${Math.random() * 15 + 10}px`
        }
      })),
    []
  );

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="particles">
          {particles.map((particle) => (
            <div key={particle.key} className="particle" style={particle.style} />
          ))}
          {coins.map((coin) => (
            <div key={coin.key} className="coin-particle" style={coin.style} />
          ))}
        </div>
        <div className="phrase-container">
          <h1 className="dynamic-phrase" key={currentPhrase}>
            {PHRASES[currentPhrase]}
          </h1>
          <p className="subphrase">Descubre el poder de SanderCoin</p>
          <button
          className="cta-button"
          onClick={() => navigate('/aboutus')} // <-- AGREGA ESTE onClick
          >
          Explorar
          </button>
        </div>
      </section>

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

      <section className="faq-section">
        <h2>Preguntas Frecuentes</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>¿Cómo compro SanderCoin?</h3>
            <p>
              Puedes adquirir SND a través de nuestro exchange oficial o en plataformas asociadas usando USD o otras criptomonedas.
            </p>
          </div>
          <div className="faq-item">
            <h3>¿Qué hace único a SanderCoin?</h3>
            <p>
              Nuestra tecnología de consenso avanzada permite transacciones más rápidas y seguras que las blockchains tradicionales.
            </p>
          </div>
          <div className="faq-item">
            <h3>¿Es seguro invertir en SND?</h3>
            <p>
              Como toda criptomoneda, tiene volatilidad, pero nuestra tecnología y equipo garantizan la seguridad de tus activos.
            </p>
          </div>
          <div className="faq-item">
            <h3>¿Qué es SND?</h3>
            <p>
              SND es la abreviación oficial de SanderCoin, nuestra criptomoneda. Al igual que Bitcoin se abrevia como BTC o Ethereum como ETH, hemos adoptado SND como el símbolo ticker de SanderCoin para facilitar su identificación en exchanges, wallets y plataformas de trading.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}