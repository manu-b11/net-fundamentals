import { useEffect, useRef } from "react";

const layers = [
  {
    num: 7,
    name: "Aplicación",
    en: "Application",
    desc: "Interfaz directa con el usuario y las aplicaciones de software (HTTP, FTP, SMTP).",
  },
  {
    num: 6,
    name: "Presentación",
    en: "Presentation",
    desc: "Traducción, formato, compresión y cifrado/descifrado de datos (SSL/TLS, JPEG, ASCII).",
  },
  {
    num: 5,
    name: "Sesión",
    en: "Session",
    desc: "Apertura, control y cierre de sesiones de comunicación entre hosts (NetBIOS, RPC).",
  },
  {
    num: 4,
    name: "Transporte",
    en: "Transport",
    desc: "Control de flujo, segmentación y entrega confiable o rápida de extremo a extremo (TCP, UDP).",
  },
  {
    num: 3,
    name: "Red",
    en: "Network",
    desc: "Enrutamiento de paquetes y direccionamiento lógico IP a través de múltiples redes (IP, ICMP, OSPF).",
  },
  {
    num: 2,
    name: "Enlace de datos",
    en: "Data Link",
    desc: "Direccionamiento físico MAC, control de acceso al medio y detección de errores locales (Ethernet, Wi-Fi).",
  },
  {
    num: 1,
    name: "Física",
    en: "Physical",
    desc: "Transmisión de bits crudos a través del medio físico: cables de cobre, fibra óptica o ondas de radio.",
  },
];

const stackColors = [
  { i: 7, c1: "#15303b", c2: "#1b3b47" },
  { i: 6, c1: "#1a3d4c", c2: "#214b5c" },
  { i: 5, c1: "#1f4a5c", c2: "#275b6e" },
  { i: 4, c1: "#24586d", c2: "#2d6b83" },
  { i: 3, c1: "#29657e", c2: "#337b98" },
  { i: 2, c1: "#2e7390", c2: "#3a8dad" },
  { i: 1, c1: "#3480a1", c2: "#4fd1a5" },
];

function OsiModel() {
  const stackRef = useRef(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const handleStackMove = (e) => {
    if (reduceMotionRef.current) return;
    const el = stackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 16;
    const ry = (px - 0.5) * 20;
    el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const handleStackLeave = () => {
    const el = stackRef.current;
    if (el) el.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  const handleLayerEnter = (e, i) => {
    if (reduceMotionRef.current) return;
    const el = e.currentTarget;
    const baseZ = i * 10;
    el.style.setProperty(
      "transform",
      `translateX(0) translateZ(${baseZ + 24}px) scale(1.035)`,
      "important",
    );
    el.style.setProperty("filter", "brightness(1.16)", "important");
  };

  const handleLayerLeave = (e) => {
    const el = e.currentTarget;
    el.style.removeProperty("transform");
    el.style.removeProperty("filter");
  };

  return (
    <section id="osi">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="section-index mono">03</span>
          <span style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            Estructura en capas
          </span>
        </div>
        <h2>Modelo OSI</h2>
        <p className="section-intro">
          El modelo de interconexión de sistemas abiertos (OSI) divide la
          comunicación de red en 7 capas abstractas. Cada capa cumple una
          función específica, se comunica únicamente con sus capas adyacentes y
          encapsula los datos antes de pasarlos hacia abajo o hacia arriba.
        </p>

        <div className="osi-container">
          <div className="osi-wrap">
            {layers.map((layer) => (
              <div className="osi-layer" key={layer.num}>
                <div className="osi-num">{layer.num}</div>
                <div className="osi-name">
                  {layer.name} <span className="osi-en">{layer.en}</span>
                </div>
                <div className="osi-desc">{layer.desc}</div>
              </div>
            ))}
          </div>

          <div className="osi-visual-panel">
            <h3>Pila de encapsulamiento OSI</h3>
            <p>
              Cuando un dato es enviado desde la Capa 7 hasta la Capa 1, cada
              capa añade su propia cabecera (encapsulamiento). En recepción, el
              proceso se invierte (desencapsulamiento).
            </p>

            <div className="osi-3d-wrap">
              <div
                className="osi-css-stack"
                ref={stackRef}
                onMouseMove={handleStackMove}
                onMouseLeave={handleStackLeave}
                aria-hidden="true"
              >
                {stackColors.map((s) => {
                  const layer = layers.find((l) => l.num === s.i);
                  return (
                    <div
                      className="osi-css-layer"
                      key={s.i}
                      style={{
                        "--i": s.i,
                        "--layer-c1": s.c1,
                        "--layer-c2": s.c2,
                      }}
                      onMouseEnter={(e) => handleLayerEnter(e, s.i)}
                      onMouseLeave={handleLayerLeave}
                    >
                      <b>{s.i}</b>
                      <span>{layer.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="osi-flow-note">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
              <span>Encapsulamiento descendente (Transmisor)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OsiModel;
