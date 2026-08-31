function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <h1>Cómo viaja la información entre dos dispositivos</h1>
          <p className="lead">
            Una guía de referencia sobre los tres pilares de la comunicación en
            red: los puertos que identifican cada servicio, los protocolos que
            definen las reglas, y el modelo OSI que organiza todo el proceso en
            capas.
          </p>
          <div className="hero-stats">
            <div>
              <div className="num">65.536</div>
              <div className="label">puertos lógicos disponibles</div>
            </div>
            <div>
              <div className="num">7</div>
              <div className="label">capas del modelo OSI</div>
            </div>
            <div>
              <div className="num">2</div>
              <div className="label">protocolos de transporte: TCP / UDP</div>
            </div>
          </div>
        </div>

        <div className="packet-viz">
          <div className="title-row">
            <span>ORIGEN · 192.168.1.14</span>
            <span>DESTINO · 93.184.216.34</span>
          </div>
          <svg className="path-svg" viewBox="0 0 320 140">
            <defs>
              <path id="wire" d="M20,70 C90,10 230,130 300,70" fill="none" />
            </defs>
            <circle cx="20" cy="70" r="5" fill="#4FD1A5" />
            <circle cx="300" cy="70" r="5" fill="#FF7A50" />
            <path
              d="M20,70 C90,10 230,130 300,70"
              fill="none"
              stroke="#2A4A56"
              strokeWidth="1.4"
              strokeDasharray="3 5"
            />
            <circle r="4" fill="#4FD1A5">
              <animateMotion dur="3.2s" repeatCount="indefinite">
                <mpath href="#wire" />
              </animateMotion>
            </circle>
            <text
              x="14"
              y="94"
              fill="#93ADB2"
              fontFamily="JetBrains Mono, monospace"
              fontSize="10"
            >
              host local
            </text>
            <text
              x="248"
              y="94"
              fill="#93ADB2"
              fontFamily="JetBrains Mono, monospace"
              fontSize="10"
            >
              servidor :443
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Hero;
