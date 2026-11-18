const modules = {
  j: {
    name: "Gestión de Encomiendas y Clientes",
    group: "Módulo J",
    className: "module-j",
    description: "Clientes, terminales, encomiendas, documentación, viajes y venta de pasajes.",
    flows: [
      ["j01", "D-J01", "Autenticación, perfil y roles", "Control de acceso y administración RBAC"],
      ["j02", "D-J02", "Terminales y tarifas", "Sucursales, ubigeo y matriz tarifaria"],
      ["j03", "D-J03", "Directorio de clientes", "Búsqueda y mantenimiento de personas"],
      ["j04", "D-J04", "Registro de encomiendas", "Paquetes, cálculo y pago simulado"],
      ["j05", "D-J05", "Documentación y clave", "Guías, comprobantes y validación"],
      ["j06", "D-J06", "Programación de viajes", "Consulta de salidas disponibles"],
      ["j07", "D-J07", "Venta y reserva de pasajes", "Selección gráfica de asientos"],
      ["j08", "D-J08", "Postventa y embarque", "Manifiesto y control de abordaje"]
    ]
  },
  k: {
    name: "Gestión de Transporte y Rutas",
    group: "Módulo K",
    className: "module-k",
    description: "Flota, conductores, rutas, servicios y asignación de recursos operativos.",
    flows: [
      ["k01", "D-K01", "Programación de servicios", "Asignación de vehículo, conductor y carga"],
      ["k02", "D-K02", "Vehículos y conductores", "Registro, disponibilidad y mantenimiento"],
      ["k03", "D-K03", "Rutas y paradas", "Catálogo de tramos y paradas intermedias"],
      ["k04", "D-K04", "Ciclo de vida del servicio", "Creación, ejecución y cierre operativo"]
    ]
  },
  i: {
    name: "Seguimiento, Entrega y Analítica",
    group: "Módulo I",
    className: "module-i",
    description: "Rastreo público, entregas seguras, eventos, incidencias y reportes analíticos.",
    flows: [
      ["i01", "D-I01", "Rastreo y entrega segura", "Seguimiento público y confirmación con clave"],
      ["i02", "D-I02", "Tablero analítico", "Indicadores y exportación de reportes"],
      ["i03", "D-I03", "Eventos de seguimiento", "Registro y anulación auditable"],
      ["i04", "D-I04", "Entrega fallida", "Tratamiento, reprogramación y devolución"]
    ]
  }
};

const routes = Object.fromEntries(Object.entries(modules).flatMap(([key, module]) => module.flows.map(flow => [flow[0], { moduleKey: key, module, flow }] )));
const app = document.querySelector("#app");
const navigation = document.querySelector("#navigation");
const breadcrumbs = document.querySelector("#breadcrumbs");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");

const icon = (value) => `<span class="nav-icon">${value}</span>`;
const badge = (text, kind = "") => `<span class="badge ${kind}">${text}</span>`;
const button = (text, kind = "primary") => `<button class="btn ${kind}" data-action="${text}">${text}</button>`;
const field = (label, value = "", type = "text", extra = "") => `<div class="field ${extra}"><label>${label}</label><input class="input" type="${type}" value="${value}" /></div>`;
const select = (label, values, extra = "") => `<div class="field ${extra}"><label>${label}</label><select class="input">${values.map(v => `<option>${v}</option>`).join("")}</select></div>`;

function renderNavigation() {
  navigation.innerHTML = `
    <div class="nav-label">General</div>
    <a class="nav-link" data-route="inicio" href="#/inicio">${icon("⌂")}<span>Panel general</span></a>
    ${Object.entries(modules).map(([key, module]) => `
      <div class="nav-label">${module.group}</div>
      <a class="nav-link" data-route="${key}" href="#/${key}">${icon(key.toUpperCase())}<span>${module.name}</span><em>${module.flows.length}</em></a>
    `).join("")}
  `;
}

function heading(eyebrow, title, description, actions = "") {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="lead">${description}</p></div>${actions ? `<div class="button-row">${actions}</div>` : ""}</div>`;
}

function metric(label, value, note, color = "blue", symbol = "↗") {
  const palette = color === "teal" ? "--metric-color:var(--teal);--metric-soft:var(--teal-soft)" : color === "violet" ? "--metric-color:var(--violet);--metric-soft:var(--violet-soft)" : color === "amber" ? "--metric-color:var(--amber);--metric-soft:#fff4dc" : "";
  return `<article class="card metric" style="${palette}"><div class="metric-top"><span>${label}</span><span class="metric-icon">${symbol}</span></div><div class="metric-value">${value}</div><small>${note}</small></article>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function renderHome() {
  return `${heading("Centro de operaciones", "Buenos días, Ana", "Resumen operativo del Sistema de Gestión de Transporte y Encomiendas con IA.", button("Nuevo registro"))}
    <div class="grid cols-4">
      ${metric("Encomiendas activas", "1,284", '<span class="up">+8.2%</span> frente al mes anterior')}
      ${metric("Servicios en ruta", "38", "6 próximos a destino", "teal", "●")}
      ${metric("Entregas a tiempo", "94.6%", '<span class="up">+2.1%</span> esta semana', "violet", "✓")}
      ${metric("Alertas operativas", "7", "2 requieren atención", "amber", "!")}
    </div>
    <div class="grid cols-3" style="margin-top:18px">
      <article class="card span-2"><div class="card-header"><div><h2>Actividad de entregas</h2><p>Últimos siete días</p></div>${badge("Actualizado", "blue")}</div><div class="chart">${[54,72,66,85,79,94,88].map((h,i)=>`<div class="bar" style="--h:${h}%" data-label="${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i]}"></div>`).join("")}</div><div style="height:26px"></div></article>
      <article class="card"><div class="card-header"><div><h2>Estado de módulos</h2><p>Servicios integrados</p></div></div><div class="card-body timeline">
        ${Object.values(modules).map((m,i)=>`<div class="timeline-item"><span class="timeline-dot">${m.group.slice(-1)}</span><div><h3>${m.name}</h3><p>Operativo · ${m.flows.length} flujos</p></div>${badge(i===1?'98.7%':'99.9%', i===1?'amber':'')}</div>`).join("")}
      </div></article>
    </div>
    <article class="card" style="margin-top:18px"><div class="card-header"><div><h2>Operaciones recientes</h2><p>Movimientos sincronizados entre los tres módulos</p></div><button class="btn">Ver todo</button></div>
      ${table(["Código","Operación","Ruta","Responsable","Estado"],[
        ['<span class="cell-title">ENC-10482</span><span class="cell-sub">Hace 8 min</span>','Encomienda registrada','Lima → Arequipa','María Paredes',badge('En tránsito','blue')],
        ['<span class="cell-title">SRV-0284</span><span class="cell-sub">Hace 21 min</span>','Servicio iniciado','Lima → Ica','Carlos Núñez',badge('En curso')],
        ['<span class="cell-title">ENC-10479</span><span class="cell-sub">Hace 37 min</span>','Entrega confirmada','Cusco → Puno','Jorge Salas',badge('Entregado')],
        ['<span class="cell-title">SRV-0281</span><span class="cell-sub">Hace 1 h</span>','Recurso asignado','Trujillo → Lima','Ana García',badge('Programado','amber')]
      ])}
    </article>`;
}

function renderModule(key) {
  const module = modules[key];
  return `<article class="card module-hero ${module.className}"><div class="eyebrow">${module.group}</div><h1>${module.name}</h1><p class="lead">${module.description}</p></article>
    <div class="page-heading" style="margin-top:28px;margin-bottom:14px"><div><h2>Interfaces del módulo</h2><p class="lead">Flujos definidos en los diagramas IFML del capítulo 11.</p></div></div>
    <div class="flow-grid ${module.className}">${module.flows.map(([route,code,title,desc])=>`<a class="flow-card" href="#/${route}"><span class="flow-code">${code}</span><h3>${title}</h3><p>${desc}</p></a>`).join("")}</div>`;
}

function authView() {
  return `<article class="card login-preview"><div class="login-art"><h2>Gestiona cada envío con precisión y confianza</h2><p>Una plataforma integrada para conectar clientes, flota y seguimiento en tiempo real.</p></div><div class="login-form"><h2>Bienvenido</h2><p>Ingresa tus credenciales para continuar</p>${field("Correo electrónico","administrador@integra.pe","email")}${field("Contraseña","Integra2026","password")}<button class="btn primary" data-action="Iniciar sesión">Iniciar sesión</button></div></article>`;
}

function terminalsView() {
  return `<article class="card"><div class="toolbar"><input class="input" placeholder="Buscar terminal o ciudad..." /><select class="input"><option>Todas las regiones</option><option>Lima</option><option>Arequipa</option></select><select class="input"><option>Todos los estados</option><option>Activo</option><option>Inactivo</option></select>${button("Nueva terminal")}</div>${table(["Terminal","Ubicación","Contacto","Tarifa base","Estado"],[
    ['<span class="cell-title">Terminal Lima Norte</span><span class="cell-sub">TER-001</span>','Independencia, Lima','01 523 8041','S/ 8.50',badge('Activo')],
    ['<span class="cell-title">Terminal Arequipa</span><span class="cell-sub">TER-006</span>','Cercado, Arequipa','054 281 320','S/ 10.00',badge('Activo')],
    ['<span class="cell-title">Agencia Ica Centro</span><span class="cell-sub">TER-011</span>','Ica, Ica','056 214 978','S/ 7.50',badge('Mantenimiento','amber')]
  ])}</article>`;
}

function clientsView() {
  return `<article class="card"><div class="toolbar"><input class="input" placeholder="Buscar por DNI, RUC o nombre..." /><select class="input"><option>Persona natural</option><option>Persona jurídica</option></select><select class="input"><option>Activos</option><option>Inactivos</option></select>${button("Nuevo cliente")}</div>${table(["Cliente","Documento","Contacto","Última operación","Estado"],[
    ['<span class="cell-title">Valeria Mendoza Ruiz</span><span class="cell-sub">Cliente desde 2024</span>','DNI 74291836','987 420 118','16 nov 2026',badge('Activo')],
    ['<span class="cell-title">Comercial Andina SAC</span><span class="cell-sub">Cuenta empresarial</span>','RUC 20608475219','contacto@andina.pe','15 nov 2026',badge('Activo')],
    ['<span class="cell-title">Renato Flores Vega</span><span class="cell-sub">Cliente desde 2025</span>','DNI 70851462','965 113 087','02 oct 2026',badge('Inactivo','gray')]
  ])}</article>`;
}

function shipmentView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Nueva encomienda</h2><p>Datos del envío y del paquete</p></div>${badge('Borrador','gray')}</div><div class="card-body"><div class="form-grid">${select("Remitente",["Valeria Mendoza · DNI 74291836","Comercial Andina SAC"])}${select("Destinatario",["Diego Torres · DNI 48120573","Lucía Campos · DNI 72519046"])}${select("Origen",["Lima Norte","Lima Centro"])}${select("Destino",["Arequipa","Ica","Cusco"])}${field("Peso total","4.80","number")}${field("Valor declarado","180.00","number")}${field("Descripción del contenido","Documentos y accesorios","text","wide")}</div></div></article><article class="card"><div class="card-header"><h2>Resumen</h2></div><div class="card-body"><p class="lead">Tarifa estimada</p><div class="metric-value">S/ 34.50</div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><div class="button-row">${button("Guardar y cobrar")}</div></div></article></div>`;
}

function documentsView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Documentos de ENC-10482</h2><p>Generados el 18 nov 2026, 11:42</p></div>${button("Descargar PDF")}</div><div class="card-body"><div style="padding:26px;border:1px solid var(--line);border-radius:12px;background:#fcfcfd"><div class="eyebrow">Guía de remisión electrónica</div><h2 style="margin:8px 0 18px">T001-00010482</h2><div class="form-grid"><p><small>Remitente</small><br><strong>Valeria Mendoza Ruiz</strong></p><p><small>Destinatario</small><br><strong>Diego Torres Vega</strong></p><p><small>Origen</small><br><strong>Lima Norte</strong></p><p><small>Destino</small><br><strong>Arequipa</strong></p></div></div></div></article><article class="card"><div class="card-header"><h2>Validar entrega</h2></div><div class="card-body">${field("Clave de seguridad","••••••","password")}<div style="height:12px"></div>${button("Validar clave","teal")}<p class="lead" style="font-size:10px">La clave se compara de forma segura con el hash registrado.</p></div></article></div>`;
}

function tripsView() {
  return `<article class="card"><div class="toolbar"><select class="input"><option>Lima</option><option>Ica</option></select><select class="input"><option>Arequipa</option><option>Cusco</option></select><input class="input" type="date" value="2026-11-20" />${button("Buscar viajes")}</div>${table(["Salida","Ruta","Servicio","Disponibilidad","Tarifa"],[
    ['<span class="cell-title">07:30</span><span class="cell-sub">20 nov 2026</span>','Lima → Arequipa','Bus cama · SRV-0291',badge('18 asientos'),'<strong>S/ 85.00</strong>'],
    ['<span class="cell-title">16:45</span><span class="cell-sub">20 nov 2026</span>','Lima → Arequipa','Bus cama · SRV-0294',badge('9 asientos','amber'),'<strong>S/ 92.00</strong>'],
    ['<span class="cell-title">21:15</span><span class="cell-sub">20 nov 2026</span>','Lima → Arequipa','Suite · SRV-0298',badge('24 asientos'),'<strong>S/ 110.00</strong>']
  ])}</article>`;
}

function seatsView() {
  const seats = Array.from({length:35},(_,i)=> i%5===2 ? '<span class="seat"></span>' : `<button class="seat ${[1,6,8,16,21].includes(i)?'occupied':i===13?'selected':''}">${i+1-Math.floor(i/5)}</button>`).join("");
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Selecciona un asiento</h2><p>Servicio SRV-0291 · Lima a Arequipa</p></div>${badge('18 disponibles')}</div><div class="seat-map">${seats}</div></article><article class="card"><div class="card-header"><h2>Resumen del pasaje</h2></div><div class="card-body"><p class="lead">Asiento seleccionado</p><div class="metric-value">12</div><p><strong>Bus cama</strong><br><small>20 nov · 07:30</small></p><p><strong>S/ 85.00</strong></p>${button("Continuar con pasajero")}</div></article></div>`;
}

function postSaleView() {
  return `<article class="card"><div class="toolbar"><input class="input" placeholder="Buscar boleto o pasajero..." /><select class="input"><option>Todos los viajes</option><option>SRV-0291</option></select><select class="input"><option>Todos los estados</option><option>Emitido</option></select>${button("Generar manifiesto")}</div>${table(["Boleto","Pasajero","Viaje","Asiento","Embarque"],[
    ['<span class="cell-title">BOL-74210</span>','Valeria Mendoza','SRV-0291 · 07:30','12',badge('Confirmado')],
    ['<span class="cell-title">BOL-74211</span>','Diego Torres','SRV-0291 · 07:30','14',badge('Pendiente','amber')],
    ['<span class="cell-title">BOL-74214</span>','Lucía Campos','SRV-0291 · 07:30','18',badge('Confirmado')]
  ])}</article>`;
}

function servicesView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="toolbar"><input class="input" placeholder="Buscar servicio..." /><select class="input"><option>Programados</option><option>En curso</option></select><input class="input" type="date" value="2026-11-20" />${button("Nuevo servicio","teal")}</div>${table(["Servicio","Ruta","Salida","Recursos","Estado"],[
    ['<span class="cell-title">SRV-0291</span>','Lima → Arequipa','20 nov · 07:30','BUS-018 · Carlos Núñez',badge('Programado','blue')],
    ['<span class="cell-title">SRV-0289</span>','Lima → Ica','19 nov · 14:00','BUS-011 · Jorge Salas',badge('En curso')],
    ['<span class="cell-title">SRV-0287</span>','Trujillo → Lima','19 nov · 08:15','BUS-024 · Raúl Ponce',badge('Carga pendiente','amber')]
  ])}</article><article class="card"><div class="card-header"><h2>Manifiesto de carga</h2></div><div class="card-body"><p class="lead">SRV-0291</p><div class="metric-value">28</div><p class="lead">encomiendas · 186.4 kg</p><div class="progress"><span style="width:74%"></span></div><p class="lead" style="font-size:10px">74% de capacidad utilizada</p>${button("Generar manifiesto","teal")}</div></article></div>`;
}

function resourcesView() {
  return `<article class="card"><div class="toolbar"><input class="input" placeholder="Buscar placa, DNI o nombre..." /><select class="input"><option>Todos los recursos</option><option>Vehículos</option><option>Conductores</option></select><select class="input"><option>Disponibles</option><option>Asignados</option></select>${button("Registrar recurso","teal")}</div>${table(["Recurso","Tipo","Información","Disponibilidad","Estado"],[
    ['<span class="cell-title">BUS-018 · B8R-921</span><span class="cell-sub">Volvo 9700</span>','Vehículo','48 asientos · 2023',badge('Disponible'),badge('Activo')],
    ['<span class="cell-title">Carlos Núñez</span><span class="cell-sub">DNI 46120857</span>','Conductor','Licencia AIII-c',badge('Asignado','blue'),badge('Activo')],
    ['<span class="cell-title">BUS-007 · C2Q-118</span><span class="cell-sub">Mercedes O500</span>','Vehículo','44 asientos · 2021',badge('Mantenimiento','amber'),badge('Activo')]
  ])}</article>`;
}

function routesView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Ruta Lima - Arequipa</h2><p>RUT-006 · 1,012 km · 16 h 20 min</p></div>${badge('Activa')}</div><div class="route-line">${[['Lima','00:00'],['Ica','04:10'],['Nazca','07:20'],['Camaná','13:40'],['Arequipa','16:20']].map(s=>`<div class="stop"><i></i><strong>${s[0]}</strong><small>${s[1]}</small></div>`).join("")}</div></article><article class="card"><div class="card-header"><h2>Editar ruta</h2></div><div class="card-body">${select('Origen',['Lima'])}${select('Destino',['Arequipa'])}<div style="height:14px"></div>${button('Guardar cambios','teal')}</div></article></div>`;
}

function lifecycleView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Estado del servicio SRV-0289</h2><p>Lima → Ica · 19 nov 2026</p></div>${badge('En curso')}</div><div class="card-body timeline">
    ${[['1','Servicio creado','18 nov · 09:20'],['2','Recursos asignados','18 nov · 11:45'],['3','Manifiesto confirmado','19 nov · 13:32'],['4','Servicio iniciado','19 nov · 14:04']].map((x,i)=>`<div class="timeline-item"><span class="timeline-dot">${i<3?'✓':x[0]}</span><div><h3>${x[1]}</h3><p>Registrado por ${i===3?'Carlos Núñez':'Ana García'}</p></div><time>${x[2]}</time></div>`).join("")}
  </div></article><article class="card"><div class="card-header"><h2>Control operativo</h2></div><div class="card-body"><p class="lead">Próxima acción</p><h2>Finalizar servicio</h2><p class="lead">Confirma la llegada y libera los recursos asignados.</p>${button('Finalizar servicio','teal')}<div style="height:8px"></div>${button('Reportar incidencia','danger')}</div></article></div>`;
}

function trackingView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Rastrea tu encomienda</h2><p>Consulta segura sin exponer datos personales</p></div></div><div class="card-body"><div style="display:flex;gap:10px"><input class="input" value="ENC-10482" />${button('Consultar')}</div><div class="route-line" style="margin-top:24px">${[['Lima','Recibido'],['Ica','En ruta'],['Camaná','Próximo'],['Arequipa','Destino']].map((s,i)=>`<div class="stop"><i style="${i>1?'background:#ccd4e2;box-shadow:0 0 0 2px #ccd4e2':''}"></i><strong>${s[0]}</strong><small>${s[1]}</small></div>`).join("")}</div></div></article><article class="card"><div class="card-header"><h2>Entrega estimada</h2></div><div class="card-body"><div class="metric-value">20 nov</div><p class="lead">Entre 14:00 y 18:00</p>${badge('Riesgo bajo')}<hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><p class="lead">Último evento</p><strong>Salida de centro de distribución</strong><p class="lead">Ica · Hoy, 10:42</p></div></article></div>`;
}

function analyticsView() {
  return `<div class="grid cols-4">
      ${metric("Encomiendas procesadas", "1,284", '<span class="up">+8.2%</span> frente al mes anterior')}
      ${metric("Entregas a tiempo", "94.6%", '<span class="up">+2.1%</span> esta semana', "teal", "✓")}
      ${metric("Tiempo medio", "18.4 h", "−1.6 h frente al periodo anterior", "violet", "◷")}
      ${metric("Incidencias", "3.2%", "41 casos en el periodo", "amber", "!")}
    </div>
    <div class="grid cols-3" style="margin-top:18px">
      <article class="card span-2"><div class="card-header"><div><h2>Entregas por día</h2><p>Rendimiento de los últimos siete días</p></div>${badge("Actualizado", "blue")}</div><div class="chart">${[54,72,66,85,79,94,88].map((h,i)=>`<div class="bar" style="--h:${h}%" data-label="${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i]}"></div>`).join("")}</div><div style="height:26px"></div></article>
      <article class="card"><div class="card-header"><div><h2>Cumplimiento por ruta</h2><p>Entregas dentro del plazo</p></div></div><div class="card-body timeline">
        ${[['LI','Lima - Ica','97.8%'],['LA','Lima - Arequipa','94.1%'],['TC','Trujillo - Chiclayo','91.6%']].map((x,i)=>`<div class="timeline-item"><span class="timeline-dot">${x[0]}</span><div><h3>${x[1]}</h3><p>${i+1}° en rendimiento</p></div>${badge(x[2], i===2?'amber':'')}</div>`).join("")}
      </div></article>
    </div>
    <article class="card" style="margin-top:18px"><div class="card-header"><div><h2>Detalle de encomiendas</h2><p>Resultados según los filtros activos</p></div>${button("Exportar PDF")}${button("Exportar XLSX", "teal")}</div>
      ${table(["Código","Ruta","Fecha de entrega","Tiempo","Resultado"],[
        ['<span class="cell-title">ENC-10482</span>','Lima → Arequipa','20 nov 2026','17.2 h',badge('A tiempo')],
        ['<span class="cell-title">ENC-10479</span>','Cusco → Puno','18 nov 2026','11.8 h',badge('A tiempo')],
        ['<span class="cell-title">ENC-10463</span>','Lima → Ica','17 nov 2026','7.4 h',badge('Con demora','amber')]
      ])}
    </article>`;
}

function eventsView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Historial de ENC-10482</h2><p>Registro inmutable y auditable</p></div>${button('Nuevo evento')}</div><div class="card-body timeline">
    ${[['✓','En tránsito','Salida del centro de distribución de Ica','Hoy · 10:42'],['✓','En ruta','Servicio SRV-0289 iniciado','Hoy · 06:12'],['✓','Clasificado','Ingreso a almacén Lima Norte','Ayer · 20:35'],['✓','Registrado','Encomienda recibida en ventanilla','Ayer · 17:08']].map(x=>`<div class="timeline-item"><span class="timeline-dot">${x[0]}</span><div><h3>${x[1]}</h3><p>${x[2]}</p></div><time>${x[3]}</time></div>`).join("")}
  </div></article><article class="card"><div class="card-header"><h2>Registrar evento</h2></div><div class="card-body">${select('Nuevo estado',['Llegó a destino','En reparto','Entregado'])}${select('Sucursal',['Arequipa','Ica'])}${field('Observación','Recepción conforme')}<div style="height:14px"></div>${button('Validar y registrar')}</div></article></div>`;
}

function failedDeliveryView() {
  return `<div class="grid cols-3"><article class="card span-2"><div class="card-header"><div><h2>Intentos de entrega</h2><p>ENC-10394 · Arequipa</p></div>${badge('Requiere tratamiento','red')}</div>${table(['Intento','Fecha','Motivo','Responsable','Estado'],[
    ['<strong>#1</strong>','17 nov · 16:40','Dirección no localizada','Carlos Núñez',badge('Fallido','red')],
    ['<strong>#2</strong>','18 nov · 11:15','Destinatario ausente','Carlos Núñez',badge('Fallido','red')]
  ])}</article><article class="card"><div class="card-header"><h2>Resolver incidencia</h2></div><div class="card-body">${select('Tratamiento',['Reprogramar entrega','Devolver a origen'])}${field('Nueva fecha','2026-11-20','date')}${field('Observación','Coordinado con destinatario')}<div style="height:14px"></div>${button('Confirmar tratamiento')}</div></article></div>`;
}

const viewRenderers = { j01: authView, j02: terminalsView, j03: clientsView, j04: shipmentView, j05: documentsView, j06: tripsView, j07: seatsView, j08: postSaleView, k01: servicesView, k02: resourcesView, k03: routesView, k04: lifecycleView, i01: trackingView, i02: analyticsView, i03: eventsView, i04: failedDeliveryView };

function renderFlow(route) {
  const { module, flow } = routes[route];
  return `${heading(`${module.group} · ${flow[1]}`, flow[2], flow[3], `<a class="btn" href="#/${routes[route].moduleKey}">Ver módulo</a>`)}${viewRenderers[route]()}`;
}

function getRoute() { return location.hash.replace(/^#\//, "") || "inicio"; }

function render() {
  const route = getRoute();
  if (route === "inicio") app.innerHTML = renderHome();
  else if (modules[route]) app.innerHTML = renderModule(route);
  else if (routes[route]) app.innerHTML = renderFlow(route);
  else { location.hash = "#/inicio"; return; }

  const activeModule = routes[route]?.moduleKey || route;
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.route === activeModule || (route === "inicio" && link.dataset.route === "inicio")));
  breadcrumbs.innerHTML = route === "inicio" ? "<strong>Panel general</strong>" : routes[route] ? `${routes[route].module.group} &nbsp;/&nbsp; <strong>${routes[route].flow[2]}</strong>` : `<strong>${modules[route].group}</strong>`;
  sidebar.classList.remove("open"); overlay.classList.remove("show");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = `${message}: acción simulada correctamente`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("click", event => {
  const action = event.target.closest("[data-action]");
  if (action) showToast(action.dataset.action);
});
document.querySelector("#menuButton").addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("show"); });
overlay.addEventListener("click", () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); });
window.addEventListener("hashchange", render);
renderNavigation();
render();
