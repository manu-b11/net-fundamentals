const ranges = [
  {
    range: "0 – 1023",
    title: "Puertos conocidos",
    desc: "Reservados para servicios estándar de internet: web, correo, transferencia de archivos, resolución de nombres.",
  },
  {
    range: "1024 – 49151",
    title: "Puertos registrados",
    desc: "Asignados a aplicaciones específicas de fabricantes de software, sin ser exclusivos del sistema operativo.",
  },
  {
    range: "49152 – 65535",
    title: "Puertos dinámicos",
    desc: "Asignados temporalmente por el sistema operativo al iniciar una conexión saliente.",
  },
];

const ports = [
  {
    port: "20 / 21",
    service: "FTP",
    protocol: "TCP",
    use: "Transferencia de archivos",
  },
  { port: "22", service: "SSH", protocol: "TCP", use: "Acceso remoto seguro" },
  {
    port: "23",
    service: "Telnet",
    protocol: "TCP",
    use: "Acceso remoto sin cifrado",
  },
  {
    port: "25",
    service: "SMTP",
    protocol: "TCP",
    use: "Envío de correo electrónico",
  },
  {
    port: "53",
    service: "DNS",
    protocol: "TCP / UDP",
    use: "Resolución de nombres de dominio",
  },
  {
    port: "80",
    service: "HTTP",
    protocol: "TCP",
    use: "Navegación web sin cifrar",
  },
  {
    port: "110",
    service: "POP3",
    protocol: "TCP",
    use: "Recepción de correo electrónico",
  },
  {
    port: "143",
    service: "IMAP",
    protocol: "TCP",
    use: "Gestión de correo en servidor",
  },
  {
    port: "443",
    service: "HTTPS",
    protocol: "TCP",
    use: "Navegación web cifrada",
  },
  {
    port: "3306",
    service: "MySQL",
    protocol: "TCP",
    use: "Conexión a bases de datos",
  },
];

function PortTable() {
  return (
    <section id="puertos">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="section-index mono">01</span>
          <span style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            Identificación de servicios
          </span>
        </div>
        <h2>Puertos lógicos</h2>
        <p className="section-intro">
          Un puerto lógico es un número de 16 bits que identifica qué proceso o
          servicio, dentro de un mismo dispositivo, debe recibir un paquete de
          datos. Mientras la dirección IP ubica al equipo en la red, el puerto
          ubica al servicio dentro de ese equipo.
        </p>

        <div className="range-cards">
          {ranges.map((r) => (
            <div className="range-card" key={r.range}>
              <div className="range mono">{r.range}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="port-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Puerto</th>
                <th>Servicio</th>
                <th>Protocolo de transporte</th>
                <th>Uso</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((p) => (
                <tr key={p.port}>
                  <td className="port-num">{p.port}</td>
                  <td>{p.service}</td>
                  <td className="proto-tag">{p.protocol}</td>
                  <td>{p.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default PortTable;
