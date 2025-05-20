import React, { useEffect, useState } from 'react';
import '../styles/AboutUs.css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
}

const AboutUs: React.FC = () => {
  const [animateNodes, setAnimateNodes] = useState<boolean>(false);
  
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Jonathan Erney Florez",
      role: "CEO & Fundadora",
      bio: "Experta en finanzas digitales con más de 10 años de experiencia en blockchain y desarrollo de criptomonedas."
    },
    {
      id: 2,
      name: "Pedro Pablo Valencia",
      role: "CTO",
      bio: "Ingeniero de software especializado en seguridad blockchain y arquitectura de sistemas distribuidos."
    },
    {
      id: 3,
      name: "Ingrid Alejandra Loaiza",
      role: "Directora de Operaciones",
      bio: "Especialista en operaciones financieras y regulación de activos digitales en mercados internacionales."
    },
    {
      id: 4,
      name: "Evelyn Salazar Murillo",
      role: "Jefe de Desarrollo",
      bio: "Desarrollador blockchain con experiencia creando soluciones innovadoras para fintech y criptomonedas."
    }
  ];

  const milestones = [
    { year: 2023, event: "Fundación de SanderCoin" },
    { year: 2023, event: "Lanzamiento de la versión beta" },
    { year: 2024, event: "Primera ronda de inversión exitosa" },
    { year: 2024, event: "Expansión a mercados internacionales" },
    { year: 2025, event: "Lanzamiento de nueva tecnología de consenso" }
  ];

  useEffect(() => {
    setAnimateNodes(true);
  }, []);

  return (
    <div className="about-container">
      <div className="node-background">
        {Array.from({ length: 15 }).map((_, index) => (
          <div 
            key={index}
            className={`node ${animateNodes ? 'animate' : ''}`}
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s` 
            }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, index) => (
          <div 
            key={`line-${index}`} 
            className={`node-line ${animateNodes ? 'animate' : ''}`}
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 3}s` 
            }}
          />
        ))}
      </div>

      <div className="about-content">
        <h1 className="about-title">Quiénes Somos</h1>
        
        <div className="about-section mission-section">
          <h2>Nuestra Misión</h2>
          <p>
            En SanderCoin, estamos revolucionando el futuro de las finanzas digitales mediante una tecnología 
            blockchain avanzada que prioriza la seguridad, velocidad y accesibilidad. Nuestra misión es democratizar 
            el acceso a las criptomonedas y crear un ecosistema financiero más inclusivo y transparente para todos.
          </p>
        </div>

        <div className="about-section vision-section">
          <h2>Nuestra Visión</h2>
          <p>
            Aspiramos a convertirnos en la plataforma líder de criptomonedas, reconocida mundialmente por nuestra 
            innovación tecnológica, seguridad inquebrantable y compromiso con la comunidad. Visualizamos un futuro 
            donde SanderCoin sea sinónimo de confianza y excelencia en el espacio de las finanzas digitales.
          </p>
        </div>

        <div className="about-section tech-section">
          <h2>Nuestra Tecnología</h2>
          <div className="tech-features">
            <div className="tech-feature">
              <div className="feature-icon security-icon"></div>
              <h3>Seguridad Avanzada</h3>
              <p>Protocolos de encriptación de última generación y verificación multi-capa para garantizar la seguridad de tus activos.</p>
            </div>
            <div className="tech-feature">
              <div className="feature-icon speed-icon"></div>
              <h3>Velocidad Superior</h3>
              <p>Algoritmos de consenso optimizados que permiten transacciones instantáneas con mínima latencia.</p>
            </div>
            <div className="tech-feature">
              <div className="feature-icon eco-icon"></div>
              <h3>Eficiencia Energética</h3>
              <p>Infraestructura diseñada para minimizar el consumo energético mientras maximiza el rendimiento.</p>
            </div>
          </div>
        </div>

        <div className="about-section team-section">
          <h2>Nuestro Equipo</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div className="team-member" key={member.id}>
                <div className="member-avatar">
                  {member.name.charAt(0)}
                </div>
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-section timeline-section">
          <h2>Nuestra Historia</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>{milestone.year}</h3>
                  <p>{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-section values-section">
          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Transparencia</h3>
              <p>Operamos con total transparencia en todas nuestras transacciones y decisiones empresariales.</p>
            </div>
            <div className="value-item">
              <h3>Innovación</h3>
              <p>Buscamos constantemente nuevas formas de mejorar y revolucionar la tecnología blockchain.</p>
            </div>
            <div className="value-item">
              <h3>Comunidad</h3>
              <p>Valoramos y escuchamos activamente a nuestra comunidad de usuarios e inversores.</p>
            </div>
            <div className="value-item">
              <h3>Seguridad</h3>
              <p>La protección de los activos y datos de nuestros usuarios es nuestra máxima prioridad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
