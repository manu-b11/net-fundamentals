const tcp = {
  title: "TCP",
  subtitle: "Transmission Control Protocol",
  items: [
    { label: "Orientado a conexión", dim: "requiere establecer sesión" },
    { label: "Entrega garantizada", dim: "confirma recepción de cada paquete" },
    { label: "Orden preservado", dim: "reensambla los datos en secuencia" },
    {
      label: "Control de flujo",
      dim: "evita saturar al receptor regulando la cantidad de datos enviados",
    },
    {
      label: "Control de errores",
      dim: "detecta pérdidas y retransmite segmentos cuando es necesario",
    },
    {
      label: "Uso típico",
      dim: "web, correo, transferencia de archivos y conexiones donde importa la integridad",
    },
  ],
};

const udp = {
  title: "UDP",
  subtitle: "User Datagram Protocol",
  items: [
    { label: "Sin conexión", dim: "envía directo, sin negociar sesión" },
    { label: "Sin confirmación", dim: "no verifica que el paquete llegue" },
    { label: "Menor latencia", dim: "prioriza velocidad sobre fiabilidad" },
    {
      label: "Sin retransmisión automática",
      dim: "si un datagrama se pierde, UDP continúa sin esperar",
    },
    {
      label: "Menor sobrecarga",
      dim: "usa una cabecera más simple que TCP y consume menos recursos",
    },
    {
      label: "Uso típico",
      dim: "video en vivo, VoIP, juegos en línea, DNS y tráfico en tiempo real",
    },
  ],
};

function ProtoColumn({ data }) {
  return (
    <div className="proto-col">
      <h3>{data.title}</h3>
      <div className="sub">{data.subtitle}</div>
      <ul>
        {data.items.map((item) => (
          <li key={item.label}>
            {item.label}
            <span className="dim">{item.dim}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TcpUdp() {
  return (
    <div className="proto-split">
      <ProtoColumn data={tcp} />
      <ProtoColumn data={udp} />
    </div>
  );
}

export default TcpUdp;
