import TcpUdp from "./TcpUdp";

const protocols = [
  {
    name: "HTTP / HTTPS",
    desc: "HTTP define cómo un navegador y un servidor web solicitan y entregan páginas, imágenes, archivos y datos. HTTPS añade cifrado mediante TLS, protegiendo la información frente a lectura o manipulación en tránsito.",
  },
  {
    name: "DNS",
    desc: "Domain Name System actúa como la guía telefónica de internet, traduciendo nombres de dominio legibles (ej. ej.com) en direcciones IP numéricas que las máquinas usan para enrutar paquetes.",
  },
  {
    name: "FTP / SFTP",
    desc: "Protocolos diseñados para la transferencia masiva de archivos entre sistemas. SFTP opera sobre SSH aportando cifrado de extremo a extremo, mientras que FTP tradicional opera en texto plano.",
  },
  {
    name: "SMTP / IMAP / POP3",
    desc: "Conjunto de protocolos de correo electrónico. SMTP gestiona el envío saliente entre servidores, mientras que IMAP y POP3 permiten a los clientes recuperar y gestionar los mensajes desde el buzón.",
  },
  {
    name: "DHCP",
    desc: "Dynamic Host Configuration Protocol automatiza la asignación de direcciones IP, máscara de subred, puerta de enlace y servidores DNS a los dispositivos que se conectan a una red local.",
  },
  {
    name: "SSH / Telnet",
    desc: "SSH permite la administración remota segura de equipos mediante línea de comandos cifrada. Telnet cumple un propósito similar pero sin cifrado, estando hoy en día obsoleto por seguridad.",
  },
];

function Protocols() {
  return (
    <section
      id="protocolos"
      style={{
        background: "var(--bg-alt)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="section-index mono">02</span>
          <span style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            Reglas de comunicación
          </span>
        </div>
        <h2>Protocolos de red</h2>
        <p className="section-intro">
          Un protocolo es el conjunto de reglas que define cómo se formatean,
          envían y reciben los datos entre dos dispositivos. Sin un protocolo
          compartido, dos equipos no pueden interpretarse mutuamente, sin
          importar qué tan buena sea la conexión física.
        </p>

        <TcpUdp />

        <div className="proto-grid">
          {protocols.map((p) => (
            <div className="proto-item" key={p.name}>
              <div className="name">{p.name}</div>
              <div className="desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Protocols;
