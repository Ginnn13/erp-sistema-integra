/* Lógica de interfaz – Grupo J. HTML + CSS + JS con datos mock (js/data.js). */
const $ = (s, r = document) => r.querySelector(s);
const S = { user: null, viaje: null, sel: null, tab: {}, q: {} };
const PERMISOS = {
  Administrador: ["inicio","perfil","roles","terminales","tarifas","clientes","encomiendas","estado","documentos","clave","viajes","programar","asientos","pasajes","manifiesto","embarque","reservas"],
  Vendedor: ["inicio","perfil","clientes","encomiendas","estado","documentos","viajes","asientos","pasajes","reservas"],
  Conductor: ["inicio","perfil","estado","clave","viajes","manifiesto","embarque"]
};
const MENU = [
  ["General", [["inicio","🏠","Inicio"],["perfil","👤","Mi perfil"],["roles","🔑","Roles y usuarios"]]],
  ["Administración", [["terminales","🏢","Terminales"],["tarifas","💲","Tarifas"]]],
  ["Clientes", [["clientes","👥","Clientes"]]],
  ["Encomiendas", [["encomiendas","📦","Encomiendas"],["estado","📍","Estado y conductor"],["documentos","🧾","Documentos"],["clave","🔐","Clave de entrega"]]],
  ["Pasajes", [["viajes","🚌","Viajes disponibles"],["programar","🗓️","Programar viaje"],["asientos","💺","Asientos y venta"],["pasajes","🎫","Historial de pasajes"],["reservas","⏳","Reservas por vencer"],["manifiesto","📋","Manifiesto"],["embarque","✅","Control de embarque"]]]
];
const badge = e => { const m = { "Pagado":"ok","Entregada":"ok","Emitido":"ok","Activo":"ok","Programado":"info","En tránsito":"info","Registrada":"gr","Pendiente":"warn","Reservado":"warn","En almacén destino":"warn","Anulado":"err","Inactivo":"err" }; return `<span class="badge b-${m[e]||"gr"}">${e}</span>`; };
const money = n => "S/ " + Number(n).toFixed(2);
const toast = t => { const e = $("#toast"); e.textContent = t; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 2600); };
const ini = n => n.split(" ").slice(0, 2).map(x => x[0]).join("");
const go = r => { location.hash = "#/" + r; };
const ruta = () => (location.hash.replace("#/", "") || "login").split("/");

/* ---------- Modal ---------- */
function modal(html) { $("#modal-root").innerHTML = `<div class="ov" onclick="if(event.target===this)cerrar()"><div class="modal" role="dialog">${html}</div></div>`; }
function cerrar() { $("#modal-root").innerHTML = ""; }

/* ---------- Validación ---------- */
function validar(form) {
  let ok = true;
  form.querySelectorAll("[data-req]").forEach(i => {
    const f = i.closest(".f"); let v = i.value.trim(), bad = !v;
    if (!bad && i.dataset.pat) bad = !new RegExp(i.dataset.pat).test(v);
    f.classList.toggle("bad", bad); if (bad) ok = false;
  });
  return ok;
}
const campo = (l, n, o = {}) => `<div class="f"><label>${l}</label><input name="${n}" type="${o.t||"text"}" value="${o.v??""}" placeholder="${o.p||""}" ${o.req!==false?"data-req":""} ${o.pat?`data-pat="${o.pat}"`:""} ${o.ro?"readonly":""}><div class="err">${o.e||"Campo obligatorio"}</div></div>`;
const sel = (l, n, opts, v) => `<div class="f"><label>${l}</label><select name="${n}">${opts.map(([k, t]) => `<option value="${k}" ${k==v?"selected":""}>${t}</option>`).join("")}</select></div>`;
const tabla = (cols, filas, onclick) => `<div class="tw"><table class="resp"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${filas.map(f=>`<tr ${onclick?`class="cl" onclick="${onclick(f)}"`:""}>${f.cells.map((c,i)=>`<td data-l="${cols[i]}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const head = (t, sub, acc = "", mig = "") => `<div class="crumb">${mig}</div><div class="head"><div><h1>${t}</h1><p>${sub}</p></div><div class="row">${acc}</div></div>`;

/* ---------- Shell ---------- */
function shell(r, cuerpo) {
  const p = PERMISOS[S.user.rol];
  const menu = MENU.map(([g, items]) => { const v = items.filter(i => p.includes(i[0])); return v.length ? `<h6>${g}</h6>` + v.map(([k, ic, t]) => `<a href="#/${k}" class="${r===k?"on":""}">${ic} ${t}</a>`).join("") : ""; }).join("");
  return `<div class="shell"><aside class="side" id="side"><div class="brand"><i>T</i><div>TransAndes ERP<small>Encomiendas y Clientes · Grupo J</small></div></div>${menu}<h6>Sesión</h6><a href="#/login">⏻ Cerrar sesión</a></aside>
  <div class="main"><header class="top"><button class="burger" aria-label="Menú" onclick="$('#side').classList.toggle('open')">☰</button><b>${S.user.sucursal.split(" – ")[0]}</b><span class="sp"></span><span class="chip">${S.user.rol}</span><span class="who">${S.user.nombre}</span><div class="avatar">${ini(S.user.nombre)}</div></header><main class="content">${cuerpo}</main></div></div>`;
}

/* ---------- Pantallas ---------- */
const V = {};
V.login = () => `<div class="login"><section class="hero"><h1>Sistema de Gestión de Transporte y Encomiendas</h1><p>Módulo Gestión de Encomiendas y Clientes. Registre envíos, venda pasajes y controle la entrega con clave segura.</p></section>
<section class="box"><form id="fl" novalidate><h1 style="margin-bottom:.3rem">Iniciar sesión</h1><p style="color:var(--gris);margin-top:0">Ingrese con su cuenta institucional</p>
<div id="lerr" class="alert al-warn" style="display:none">Credenciales incorrectas. Verifique su correo y contraseña.</div>
${campo("Correo electrónico","correo",{t:"email",p:"usuario@transandes.pe",pat:"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",e:"Ingrese un correo válido"})}
${campo("Contraseña","clave",{t:"password",p:"••••••••"})}
<button class="btn" style="width:100%">Ingresar</button>
<div class="demo"><b>Demo:</b> admin@ / vendedor@ / conductor@ <i>transandes.pe</i> · contraseña <b>123456</b></div></form></section></div>`;
V.login.init = () => { $("#fl").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const f = new FormData(e.target); const u = DB.usuarios.find(x => x.correo === f.get("correo") && x.activo); if (u && f.get("clave") === "123456") { S.user = u; go("inicio"); } else $("#lerr").style.display = "block"; }; };

V.inicio = () => {
  const r = S.user.rol, e = DB.encomiendas;
  const kp = r === "Conductor" ? [["Entregas asignadas", e.filter(x=>x.conductor===S.user.nombre&&x.estado!=="Entregada").length],["Viajes hoy",2],["Pasajeros por abordar",12],["Claves por validar",3]]
    : [["Encomiendas activas", e.filter(x=>x.estado!=="Entregada").length],["Pagos pendientes", e.filter(x=>x.pago==="Pendiente").length],["Viajes programados", DB.viajes.length],["Pasajes emitidos hoy", 18]];
  const acc = { Administrador:[["terminales","Administrar terminales"],["roles","Gestionar roles"],["programar","Programar viaje"],["tarifas","Configurar tarifas"]], Vendedor:[["encomiendas","Nueva encomienda"],["asientos","Vender pasaje"],["clientes","Buscar cliente"],["reservas","Ver reservas"]], Conductor:[["clave","Validar clave"],["manifiesto","Ver manifiesto"],["embarque","Control de embarque"],["estado","Mis encomiendas"]] }[r];
  return head(`Hola, ${S.user.nombre.split(" ")[0]} 👋`, `Resumen de hoy · perfil ${r}`) +
  `<div class="grid g4 kp">${kp.map(([t,n])=>`<div class="card kpi"><b>${n}</b><span>${t}</span></div>`).join("")}</div>
  <div class="card"><h2>Accesos directos</h2><div class="row">${acc.map(([k,t])=>`<a class="btn sec" href="#/${k}">${t}</a>`).join("")}</div></div>
  <div class="card"><h2>Últimas encomiendas</h2>${tabla(["Código","Origen → Destino","Estado","Pago"], e.slice(0,4).map(x=>({id:x.id,cells:[x.cod,`${suc(x.origen)} → ${suc(x.destino)}`,badge(x.estado),badge(x.pago)]})))}</div>`;
};

V.denegado = () => head("Acceso denegado","No tiene permisos para esta funcionalidad") + `<div class="card" style="text-align:center;padding:2.5rem"><div style="font-size:3rem">🚫</div><h2>Su rol (${S.user.rol}) no puede acceder a esta pantalla</h2><p style="color:var(--gris)">Solicite el permiso al Administrador del sistema.</p><a class="btn" href="#/inicio">Volver al inicio</a></div>`;
V.expirada = () => `<div class="login"><section class="hero"><h1>Sesión expirada</h1><p>Por seguridad, su sesión se cerró tras 15 minutos de inactividad.</p></section><section class="box"><div style="max-width:370px"><div class="alert al-warn">Su sesión ha expirado. Vuelva a ingresar para continuar.</div><a class="btn" href="#/login">Ir al login</a></div></section></div>`;

V.perfil = () => head("Mi perfil","Datos del usuario y seguridad","<button class='btn sec' onclick='modPass()'>Cambiar contraseña</button>") +
 `<div class="grid g2"><div class="card"><h2>Datos personales</h2><form id="fp" novalidate>${campo("Nombre completo","n",{v:S.user.nombre})}${campo("Correo","c",{v:S.user.correo,ro:true})}${campo("Teléfono","t",{v:"945 000 111",pat:"^[0-9 ]{9,12}$",e:"Ingrese un teléfono válido"})}<button class="btn">Guardar cambios</button></form></div>
 <div class="card"><h2>Cuenta</h2><dl><dt>Rol</dt><dd>${badge("Activo")} ${S.user.rol}</dd><dt>Sucursal</dt><dd>${S.user.sucursal}</dd><dt>Último acceso</dt><dd>18/11/2026 17:40</dd></dl></div></div>`;
V.perfil.init = () => { $("#fp").onsubmit = e => { e.preventDefault(); if (validar(e.target)) toast("Perfil actualizado correctamente"); }; };
function modPass() { modal(`<h2>Cambiar contraseña</h2><form id="fm" novalidate>${campo("Contraseña actual","a",{t:"password"})}${campo("Nueva contraseña","b",{t:"password",pat:".{8,}",e:"Mínimo 8 caracteres"})}${campo("Confirmar nueva contraseña","c",{t:"password"})}<div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Actualizar</button></div></form>`);
  $("#fm").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const f = new FormData(e.target); if (f.get("b") !== f.get("c")) { e.target.c.closest(".f").classList.add("bad"); e.target.c.nextElementSibling.textContent = "Las contraseñas no coinciden"; return; } cerrar(); toast("Contraseña actualizada"); }; }

V.roles = () => head("Roles y usuarios","Asignación y retiro de roles (solo Administrador)") + `<div class="card">${tabla(["Usuario","Correo","Rol","Estado","Acción"], DB.usuarios.map(u=>({cells:[`<b>${u.nombre}</b>`,u.correo,`<span class="chip">${u.rol}</span>`,badge(u.activo?"Activo":"Inactivo"),`<button class="btn sm sec" onclick="modRol(${u.id})">Cambiar rol</button>`]})))}</div>`;
function modRol(id) { const u = DB.usuarios.find(x => x.id === id); modal(`<h2>Asignar rol</h2><p>${u.nombre}</p><form id="fr">${sel("Rol","rol",["Administrador","Vendedor","Conductor"].map(x=>[x,x]),u.rol)}<div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Guardar</button></div></form>`); $("#fr").onsubmit = e => { e.preventDefault(); u.rol = e.target.rol.value; cerrar(); toast("Rol actualizado"); render(); }; }

V.terminales = () => head("Terminales","Red de sucursales y terminales","<button class='btn' onclick='modTerm()'>+ Nuevo terminal</button>") + `<div class="card">${tabla(["Terminal","Ubigeo","Departamento","Dirección","Estado","Acción"], DB.terminales.map(t=>({cells:[`<b>${t.nombre}</b>`,t.ubigeo,t.dep,t.dir,badge(t.activo?"Activo":"Inactivo"),`<button class="btn sm sec" onclick="modTerm(${t.id})">Editar</button> <button class="btn sm gh" onclick="togTerm(${t.id})">${t.activo?"Desactivar":"Activar"}</button>`]})))}</div>`;
function togTerm(id) { const t = DB.terminales.find(x => x.id === id); t.activo = !t.activo; toast("Estado del terminal actualizado"); render(); }
function modTerm(id) { const t = DB.terminales.find(x => x.id === id) || { nombre: "", ubigeo: "", dir: "", dep: "" }; modal(`<h2>${id?"Editar":"Registrar"} terminal</h2><form id="ft" novalidate>${campo("Nombre","nombre",{v:t.nombre})}${campo("Ubigeo (6 dígitos)","ubigeo",{v:t.ubigeo,pat:"^[0-9]{6}$",e:"Ubigeo de 6 dígitos"})}${campo("Dirección","dir",{v:t.dir})}<div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Guardar</button></div></form>`); $("#ft").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const f = Object.fromEntries(new FormData(e.target)); if (id) Object.assign(t, f); else DB.terminales.push({ id: Date.now(), dep: "—", activo: true, ...f }); cerrar(); toast("Terminal guardado"); render(); }; }

V.tarifas = () => head("Tarifas de encomiendas","Matriz por tramo y rango de peso","<button class='btn' onclick='modTar()'>+ Nueva tarifa</button>") + `<div class="card">${tabla(["Tramo","Peso desde (kg)","Peso hasta (kg)","Tarifa"], DB.tarifas.map(t=>({cells:[`<b>${t.tramo}</b>`,t.desde,t.hasta,money(t.precio)]})))}</div>`;
function modTar() { modal(`<h2>Nueva tarifa</h2><form id="ftr" novalidate>${sel("Origen","o",DB.terminales.map(t=>[t.id,suc(t.id)]))}${sel("Destino","d",DB.terminales.map(t=>[t.id,suc(t.id)]),2)}<div class="form-grid">${campo("Peso desde (kg)","a",{t:"number"})}${campo("Peso hasta (kg)","b",{t:"number"})}</div>${campo("Tarifa (S/)","p",{t:"number"})}<div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Guardar tarifa</button></div></form>`); $("#ftr").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const f = e.target; if (+f.a.value >= +f.b.value) { toast("El peso inicial debe ser menor al final"); return; } DB.tarifas.push({ id: Date.now(), tramo: `${suc(+f.o.value)} → ${suc(+f.d.value)}`, desde: +f.a.value, hasta: +f.b.value, precio: +f.p.value }); cerrar(); toast("Tarifa guardada"); render(); }; }

/* Clientes */
V.clientes = () => { const q = (S.q.cli || "").toLowerCase(), est = S.q.est || "todos";
  const f = DB.clientes.filter(c => (est === "todos" || (est === "activo") === c.activo) && (c.doc.includes(q) || c.nombre.toLowerCase().includes(q)));
  return head("Clientes","Directorio de personas naturales y jurídicas","<button class='btn' onclick='modCli()'>+ Nuevo cliente</button>") +
  `<div class="card"><div class="grid g3"><div class="f"><label>Buscar por DNI, RUC o nombre</label><input id="bq" value="${S.q.cli||""}" placeholder="Ej. 72145896"></div><div class="f"><label>Estado</label><select id="be"><option value="todos">Todos</option><option value="activo" ${est==="activo"?"selected":""}>Activos</option><option value="inactivo" ${est==="inactivo"?"selected":""}>Inactivos</option></select></div></div>
  ${f.length?tabla(["Tipo","Documento","Nombre / Razón social","Teléfono","Estado"], f.map(c=>({id:c.id,cells:[c.tipo==="N"?"Natural":"Jurídico",c.doc,`<b>${c.nombre}</b>`,c.tel,badge(c.activo?"Activo":"Inactivo")]})),x=>`detCli(${x.id})`):`<div class="alert al-info">No se encontraron clientes con esos filtros.</div>`}</div>`; };
V.clientes.init = () => { $("#bq").oninput = e => { S.q.cli = e.target.value; render(true); }; $("#be").onchange = e => { S.q.est = e.target.value; render(); }; };
function detCli(id) { const c = cli(id), n = DB.encomiendas.filter(e => e.rem === id || e.dest === id);
  modal(`<h2>${c.nombre}</h2><dl><dt>Tipo</dt><dd>${c.tipo==="N"?"Persona natural (DNI)":"Persona jurídica (RUC)"}</dd><dt>Documento</dt><dd>${c.doc}</dd><dt>Teléfono</dt><dd>${c.tel}</dd><dt>Correo</dt><dd>${c.correo}</dd><dt>Estado</dt><dd>${badge(c.activo?"Activo":"Inactivo")}</dd><dt>Encomiendas</dt><dd>${n.length} asociadas</dd></dl>
  <div class="row end"><button class="btn gh" onclick="cerrar()">Cerrar</button><button class="btn sec" onclick="togCli(${id})">${c.activo?"Desactivar":"Activar"}</button><button class="btn" onclick="modCli(${id})">Editar</button></div>`); }
function togCli(id) { const c = cli(id); c.activo = !c.activo; cerrar(); toast("Estado actualizado (historial conservado)"); render(); }
function modCli(id) { const c = id ? cli(id) : { tipo: "N", doc: "", nombre: "", tel: "", correo: "" };
  modal(`<h2>${id?"Editar":"Registrar"} cliente</h2><form id="fc" novalidate>${sel("Tipo de cliente","tipo",[["N","Persona natural (DNI)"],["J","Persona jurídica (RUC)"]],c.tipo)}
  <div id="docw">${campo("DNI","doc",{v:c.doc,pat:"^[0-9]{8}$",e:"El DNI debe tener 8 dígitos"})}</div>${campo("Nombre / Razón social","nombre",{v:c.nombre})}${campo("Teléfono","tel",{v:c.tel})}${campo("Correo","correo",{v:c.correo,t:"email",pat:"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",e:"Correo no válido"})}
  <div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Guardar</button></div></form>`);
  const sw = () => { const j = $("#fc").tipo.value === "J"; $("#docw").innerHTML = campo(j ? "RUC" : "DNI", "doc", { v: c.doc, pat: j ? "^[0-9]{11}$" : "^[0-9]{8}$", e: j ? "El RUC debe tener 11 dígitos" : "El DNI debe tener 8 dígitos" }); };
  $("#fc").tipo.onchange = sw; sw();
  $("#fc").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const f = Object.fromEntries(new FormData(e.target)); if (!id && DB.clientes.some(x => x.doc === f.doc)) { toast("Ya existe un cliente con ese documento"); return; } if (id) Object.assign(c, f); else DB.clientes.push({ id: Date.now(), activo: true, ...f }); cerrar(); toast("Cliente guardado correctamente"); render(); }; }

/* Encomiendas */
V.encomiendas = () => { const tb = S.tab.enc || "todas"; const l = DB.encomiendas.filter(e => tb === "todas" || e.estado === tb);
  return head("Encomiendas","Bandeja general de envíos","<button class='btn' onclick='modEnc()'>+ Nueva encomienda</button>") +
  `<div class="tabs">${["todas","Registrada","En tránsito","En almacén destino","Entregada"].map(t=>`<button class="${tb===t?"on":""}" onclick="S.tab.enc='${t}';render()">${t==="todas"?"Todas":t}</button>`).join("")}</div>
  <div class="card">${tabla(["Código","Remitente","Destinatario","Ruta","Peso","Monto","Estado","Pago"], l.map(e=>({id:e.id,cells:[`<b>${e.cod}</b>`,cli(e.rem).nombre,cli(e.dest).nombre,`${suc(e.origen)} → ${suc(e.destino)}`,e.peso+" kg",money(e.monto),badge(e.estado),badge(e.pago)]})),x=>`detEnc(${x.id})`)}</div>`; };
function detEnc(id) { const e = DB.encomiendas.find(x => x.id === id);
  modal(`<h2>${e.cod}</h2><dl><dt>Remitente</dt><dd>${cli(e.rem).nombre}</dd><dt>Destinatario</dt><dd>${cli(e.dest).nombre}</dd><dt>Ruta</dt><dd>${suc(e.origen)} → ${suc(e.destino)}</dd><dt>Peso total</dt><dd>${e.peso} kg</dd><dt>Monto</dt><dd>${money(e.monto)}</dd><dt>Estado</dt><dd>${badge(e.estado)}</dd><dt>Pago</dt><dd>${badge(e.pago)}</dd></dl>
  <div class="row end"><button class="btn gh" onclick="cerrar()">Cerrar</button>${e.pago==="Pendiente"?`<button class="btn" onclick="modPago(${id})">Cobrar</button><button class="btn dan" onclick="delEnc(${id})">Eliminar</button>`:`<button class="btn sec" onclick="S.q.doc=${id};cerrar();go('documentos')">Ver documentos</button>`}</div>`); }
function delEnc(id) { DB.encomiendas = DB.encomiendas.filter(e => e.id !== id); cerrar(); toast("Encomienda eliminada"); render(); }
let PAQ = [];
function modEnc() { PAQ = [{ d: "Caja mediana", p: 5, l: 40, a: 30, h: 30 }];
  const act = DB.clientes.filter(c => c.activo).map(c => [c.id, `${c.nombre} (${c.doc})`]);
  modal(`<h2>Nueva encomienda</h2><form id="fe" novalidate>${sel("Remitente","rem",act)}${sel("Destinatario","dest",act,2)}<div class="form-grid">${sel("Origen","o",DB.terminales.filter(t=>t.activo).map(t=>[t.id,suc(t.id)]))}${sel("Destino","d",DB.terminales.filter(t=>t.activo).map(t=>[t.id,suc(t.id)]),3)}</div>
  <h2 style="margin-top:.6rem">Paquetes</h2><div id="paq"></div><button type="button" class="btn sm sec" onclick="addPaq()">+ Agregar paquete</button>
  <div class="alert al-info" style="margin-top:1rem" id="tot"></div><div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Registrar y cobrar</button></div></form>`);
  pintaPaq(); $("#fe").onsubmit = e => { e.preventDefault(); const f = e.target; if (f.rem.value === f.dest.value) return toast("Remitente y destinatario deben ser distintos"); if (f.o.value === f.d.value) return toast("Origen y destino deben ser distintos"); if (PAQ.some(p => !p.p || p.p <= 0)) return toast("Complete el peso de cada paquete"); const t = totalEnc(); const n = { id: 1000 + DB.encomiendas.length + 1, cod: "ENC-2026-" + (1000 + DB.encomiendas.length + 1), rem: +f.rem.value, dest: +f.dest.value, origen: +f.o.value, destino: +f.d.value, estado: "Registrada", pago: "Pendiente", monto: t.monto, peso: t.peso, clave: "—", conductor: "Sin asignar", fecha: "2026-11-18" }; DB.encomiendas.unshift(n); modPago(n.id); render(); }; }
function totalEnc() { const peso = PAQ.reduce((s, p) => s + (+p.p || 0), 0), vol = PAQ.reduce((s, p) => s + ((p.l * p.a * p.h) / 6000), 0), fact = Math.max(peso, vol); return { peso: +peso.toFixed(1), vol: +vol.toFixed(1), monto: fact <= 5 ? 15 : fact <= 20 ? 28 : 45 }; }
function pintaPaq() { $("#paq").innerHTML = PAQ.map((p, i) => `<div class="card" style="padding:.7rem"><div class="form-grid"><div class="f"><label>Descripción</label><input value="${p.d}" onchange="PAQ[${i}].d=this.value"></div><div class="f"><label>Peso (kg)</label><input type="number" value="${p.p}" onchange="PAQ[${i}].p=+this.value;pintaTot()"></div></div><div class="row"><div class="f" style="flex:1"><label>Largo cm</label><input type="number" value="${p.l}" onchange="PAQ[${i}].l=+this.value;pintaTot()"></div><div class="f" style="flex:1"><label>Ancho</label><input type="number" value="${p.a}" onchange="PAQ[${i}].a=+this.value;pintaTot()"></div><div class="f" style="flex:1"><label>Alto</label><input type="number" value="${p.h}" onchange="PAQ[${i}].h=+this.value;pintaTot()"></div>${PAQ.length>1?`<button type="button" class="btn sm gh" onclick="PAQ.splice(${i},1);pintaPaq()">Quitar</button>`:""}</div></div>`).join(""); pintaTot(); }
function pintaTot() { const t = totalEnc(); $("#tot").innerHTML = `<b>${PAQ.length}</b> paquete(s) · Peso total <b>${t.peso} kg</b> · Peso volumétrico <b>${t.vol} kg</b> · Monto estimado <b>${money(t.monto)}</b>`; }
function addPaq() { PAQ.push({ d: "", p: 1, l: 20, a: 20, h: 20 }); pintaPaq(); }
function modPago(id) { const e = DB.encomiendas.find(x => x.id === id);
  modal(`<h2>Cobro simulado</h2><div class="alert al-warn">Pago simulado: no se realiza ningún cargo real.</div><dl><dt>Encomienda</dt><dd>${e.cod}</dd><dt>Total a pagar</dt><dd><b>${money(e.monto)}</b></dd></dl><form id="fpg" style="margin-top:1rem">${sel("Método de pago","m",[["Efectivo","Efectivo"],["Tarjeta","Tarjeta (simulado)"],["Yape","Yape / Plin (simulado)"]])}<div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Pagar después</button><button class="btn">Confirmar pago</button></div></form>`);
  $("#fpg").onsubmit = ev => { ev.preventDefault(); e.pago = "Pagado"; e.clave = Math.floor(10 + Math.random() * 89) + "K-" + Math.floor(1 + Math.random() * 8) + "M" + Math.floor(1 + Math.random() * 8);
    modal(`<h2>✅ Pago registrado</h2><p>La encomienda <b>${e.cod}</b> fue pagada. Entregue esta clave al destinatario:</p><div class="big-key">${e.clave}</div><div class="row end"><button class="btn sec" onclick="S.q.doc=${id};cerrar();go('documentos')">Ver guía y boleta</button><button class="btn" onclick="cerrar();render()">Listo</button></div>`); }; }

V.estado = () => { const id = S.q.est2 || DB.encomiendas[0].id; const e = DB.encomiendas.find(x => x.id == id), h = DB.historial[id] || [[e.fecha + " 08:00", e.estado, suc(e.origen)]];
  return head("Estado de la encomienda","Seguimiento y conductor asignado") + `<div class="card"><div class="f"><label>Encomienda</label><select id="se">${DB.encomiendas.map(x=>`<option value="${x.id}" ${x.id==id?"selected":""}>${x.cod}</option>`).join("")}</select></div></div>
  <div class="grid g2"><div class="card"><h2>Resumen</h2><dl><dt>Código</dt><dd>${e.cod}</dd><dt>Estado</dt><dd>${badge(e.estado)}</dd><dt>Ruta</dt><dd>${suc(e.origen)} → ${suc(e.destino)}</dd><dt>Conductor</dt><dd>${e.conductor}</dd><dt>Pago</dt><dd>${badge(e.pago)}</dd></dl></div>
  <div class="card"><h2>Historial de estados</h2><ul class="tl">${h.map(x=>`<li><b>${x[1]}</b><br><small>${x[0]} · ${x[2]}</small></li>`).join("")}</ul></div></div>`; };
V.estado.init = () => { $("#se").onchange = e => { S.q.est2 = e.target.value; render(); }; };

V.documentos = () => { const id = S.q.doc || DB.encomiendas[0].id; const e = DB.encomiendas.find(x => x.id == id);
  return head("Documentos de encomienda","Guía de remisión y comprobante simulados","<button class='btn sec' onclick='window.print()'>🖨️ Imprimir</button>") +
  `<div class="card"><div class="f"><label>Seleccione encomienda</label><select id="sd">${DB.encomiendas.map(x=>`<option value="${x.id}" ${x.id==id?"selected":""}>${x.cod}</option>`).join("")}</select></div></div>
  <div class="grid g2"><div class="doc"><span class="mk">SIMULADO</span><h2>Guía de remisión</h2><dl><dt>N.°</dt><dd>GR-${e.id}</dd><dt>Remitente</dt><dd>${cli(e.rem).nombre}</dd><dt>Destinatario</dt><dd>${cli(e.dest).nombre}</dd><dt>Origen</dt><dd>${suc(e.origen)}</dd><dt>Destino</dt><dd>${suc(e.destino)}</dd><dt>Peso</dt><dd>${e.peso} kg</dd></dl></div>
  <div class="doc"><span class="mk">SIMULADO</span><h2>Boleta electrónica</h2><dl><dt>N.°</dt><dd>B001-${e.id}</dd><dt>Cliente</dt><dd>${cli(e.rem).nombre}</dd><dt>Servicio</dt><dd>Envío de encomienda</dd><dt>Total</dt><dd><b>${money(e.monto)}</b></dd><dt>Pago</dt><dd>${badge(e.pago)}</dd></dl></div></div>`; };
V.documentos.init = () => { $("#sd").onchange = e => { S.q.doc = e.target.value; render(); }; };

V.clave = () => { const esV = S.user.rol !== "Conductor"; const l = DB.encomiendas.filter(e => e.pago === "Pagado" && e.estado !== "Entregada");
  return head("Clave de entrega","Consulta y validación de la clave secreta") +
  `<div class="grid g2">${esV?`<div class="card"><h2>Consultar clave</h2>${tabla(["Código","Clave"], DB.encomiendas.filter(e=>e.pago==="Pagado").map(e=>({cells:[e.cod,`<b style="font-family:monospace">${e.clave}</b>`]})))}</div>`:""}
  <div class="card"><h2>Validar y confirmar entrega</h2><form id="fk" novalidate><div class="f"><label>Encomienda</label><select name="e">${l.map(e=>`<option value="${e.id}">${e.cod} · ${cli(e.dest).nombre}</option>`).join("")}</select></div>${campo("Clave de entrega","k",{p:"Ej. 48K-2M9",e:"Ingrese la clave"})}<button class="btn">Validar y confirmar entrega</button></form><div id="rk" style="margin-top:1rem"></div></div></div>`; };
V.clave.init = () => { $("#fk").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const en = DB.encomiendas.find(x => x.id == e.target.e.value); if (e.target.k.value.trim().toUpperCase() === en.clave) { en.estado = "Entregada"; $("#rk").innerHTML = `<div class="alert al-ok">✅ Clave correcta. Entrega confirmada para ${en.cod}.</div>`; } else $("#rk").innerHTML = `<div class="alert al-warn" style="background:var(--errbg);color:var(--err)">❌ Clave incorrecta. La entrega no fue confirmada.</div>`; }; };

/* Viajes */
V.viajes = () => { const q = S.q.v || { o: 1, d: 3, f: "2026-11-20" }; const r = DB.viajes.filter(v => v.origen == q.o && v.destino == q.d && v.fecha === q.f);
  const ops = DB.terminales.map(t => [t.id, suc(t.id)]);
  return head("Viajes disponibles","Búsqueda de salidas para atención en ventanilla") +
  `<div class="card"><form id="fv" class="grid g4">${sel("Origen","o",ops,q.o)}${sel("Destino","d",ops,q.d)}<div class="f"><label>Fecha</label><input type="date" name="f" value="${q.f}"></div><div class="f"><label>&nbsp;</label><button class="btn" style="width:100%">Buscar</button></div></form></div>
  ${r.length?`<div class="grid g2">${r.map(v=>`<div class="card"><div class="row" style="justify-content:space-between"><h2>${suc(v.origen)} → ${suc(v.destino)}</h2>${badge(v.estado)}</div><dl><dt>Salida</dt><dd>${v.fecha} · ${v.hora}</dd><dt>Bus</dt><dd>${v.bus}</dd><dt>Conductor</dt><dd>${v.cond}</dd><dt>Tarifa</dt><dd><b>${money(v.precio)}</b></dd><dt>Asientos libres</dt><dd>${v.libres}</dd></dl>${S.user.rol==="Vendedor"||S.user.rol==="Administrador"?`<div class="row end"><button class="btn" onclick="S.viaje=${v.id};S.sel=null;go('asientos')">Elegir asientos</button></div>`:""}</div>`).join("")}</div>`:`<div class="alert al-info">No hay viajes programados para esa búsqueda. Pruebe Trujillo → Lima el 20/11/2026.</div>`}`; };
V.viajes.init = () => { $("#fv").onsubmit = e => { e.preventDefault(); const f = e.target; S.q.v = { o: +f.o.value, d: +f.d.value, f: f.f.value }; render(); }; };

V.programar = () => head("Programar viaje","Salida interprovincial (vehículo y conductor del Módulo K)") + `<div class="grid g2"><div class="card"><form id="fpv" novalidate>${sel("Origen","o",DB.terminales.map(t=>[t.id,suc(t.id)]))}${sel("Destino","d",DB.terminales.map(t=>[t.id,suc(t.id)]),3)}<div class="form-grid"><div class="f"><label>Fecha</label><input type="date" name="f" data-req value="2026-11-22"><div class="err">Seleccione fecha</div></div><div class="f"><label>Hora</label><input type="time" name="h" data-req value="21:00"><div class="err">Seleccione hora</div></div></div>${sel("Vehículo","b",["Mercedes Marcopolo – ABC-123","Volvo B8R – XYZ-908","Scania K360 – QWE-441"].map(x=>[x,x]))}${sel("Conductor","c",DB.usuarios.filter(u=>u.rol==="Conductor"&&u.activo).map(u=>[u.nombre,u.nombre]))}${campo("Tarifa del pasaje (S/)","p",{t:"number",v:65})}<button class="btn">Programar salida</button></form></div>
<div class="card"><h2>Salidas programadas</h2>${tabla(["Ruta","Fecha","Estado"], DB.viajes.map(v=>({cells:[`${suc(v.origen)} → ${suc(v.destino)}`,v.fecha+" "+v.hora,badge(v.estado)]})))}</div></div>`;
V.programar.init = () => { $("#fpv").onsubmit = e => { e.preventDefault(); const f = e.target; if (!validar(f)) return; if (f.o.value === f.d.value) return toast("Origen y destino deben ser distintos"); DB.viajes.push({ id: Date.now(), origen: +f.o.value, destino: +f.d.value, fecha: f.f.value, hora: f.h.value, bus: f.b.value, cond: f.c.value, precio: +f.p.value, libres: 36, estado: "Programado" }); toast("Salida programada correctamente"); render(); }; };

/* Asientos */
V.asientos = () => { const v = DB.viajes.find(x => x.id === (S.viaje || 501));
  const oc = DB.asientosOcupados, re = DB.asientosReservados; let seats = "";
  for (let i = 0; i < 9; i++) { const base = i * 4; for (let j = 1; j <= 4; j++) { const n = base + j; if (j === 3) seats += `<span></span>`; const c = oc.includes(n) ? "oc" : re.includes(n) ? "re" : S.sel === n ? "sel" : ""; seats += `<button class="seat ${c}" ${c==="oc"||c==="re"?"disabled":""} onclick="S.sel=${n};render()" aria-label="Asiento ${n}">${n}</button>`; } }
  return head("Asientos y venta de pasajes",`${suc(v.origen)} → ${suc(v.destino)} · ${v.fecha} ${v.hora}`) +
  `<div class="grid g2"><div class="card"><div class="bus"><div class="vol">🛞 Conductor</div><div class="seats">${seats.replace(/(<span><\/span>)/g,"<span></span>")}</div></div>
  <div class="leyenda"><span><i style="background:#dcfce7;border:2px solid #86efac"></i>Libre</span><span><i style="background:#fee2e2;border:2px solid #fca5a5"></i>Ocupado</span><span><i style="background:#fef3c7;border:2px solid #fcd34d"></i>Reservado</span><span><i style="background:var(--azul)"></i>Seleccionado</span></div></div>
  <div class="card"><h2>Resumen</h2>${S.sel?`<dl><dt>Asiento</dt><dd><b>${S.sel}</b> (bloqueado 5 min)</dd><dt>Tarifa</dt><dd>${money(v.precio)}</dd></dl><form id="fvt" novalidate style="margin-top:1rem">${sel("Cliente / pasajero pagador","c",DB.clientes.filter(c=>c.activo).map(c=>[c.id,`${c.nombre} (${c.doc})`]))}<div class="row"><button class="btn" name="a" value="v">Vender y emitir boleto</button><button class="btn sec" name="a" value="r" type="button" id="brs">Reservar con plazo</button></div></form>`:`<div class="alert al-info">Seleccione un asiento libre del croquis para continuar.</div>`}</div></div>`; };
V.asientos.init = () => { const f = $("#fvt"); if (!f) return; const v = DB.viajes.find(x => x.id === (S.viaje || 501)); const fin = (tipo) => { const c = cli(+f.c.value); DB.asientosOcupados.length; DB.pasajes.unshift({ id: Date.now(), cod: "PAS-" + (9006 + DB.pasajes.length), viaje: v.id, pasajero: c.nombre, doc: c.doc, asiento: S.sel, estado: tipo === "v" ? "Emitido" : "Reservado", monto: v.precio, embarcado: false, vence: "2026-11-19 18:00" }); (tipo === "v" ? DB.asientosOcupados : DB.asientosReservados).push(S.sel); const as = S.sel; S.sel = null; modal(`<h2>${tipo==="v"?"🎫 Boleto emitido":"⏳ Reserva registrada"}</h2><div class="doc" style="margin-bottom:1rem"><span class="mk">SIMULADO</span><dl><dt>Pasajero</dt><dd>${c.nombre}</dd><dt>Viaje</dt><dd>${suc(v.origen)} → ${suc(v.destino)}</dd><dt>Salida</dt><dd>${v.fecha} ${v.hora}</dd><dt>Asiento</dt><dd>${as}</dd><dt>Monto</dt><dd>${money(v.precio)}</dd>${tipo==="r"?"<dt>Vigencia</dt><dd>hasta 19/11/2026 18:00</dd>":""}</dl></div><div class="row end"><button class="btn" onclick="cerrar();render()">Aceptar</button></div>`); }; f.onsubmit = e => { e.preventDefault(); fin("v"); }; $("#brs").onclick = () => fin("r"); };

/* Pasajes */
V.pasajes = () => { const q = (S.q.p || "").toLowerCase(); const l = DB.pasajes.filter(p => p.pasajero.toLowerCase().includes(q) || p.cod.toLowerCase().includes(q) || String(p.viaje) === q);
  return head("Historial de pasajes","Consulta y operaciones post-venta") + `<div class="card"><div class="f"><label>Buscar por pasajero, código o N.° de viaje</label><input id="pq" value="${S.q.p||""}" placeholder="Ej. Torres"></div>${tabla(["Código","Pasajero","Viaje","Asiento","Monto","Estado","Acción"], l.map(p=>({cells:[`<b>${p.cod}</b>`,p.pasajero,"#"+p.viaje,p.asiento,money(p.monto),badge(p.estado),p.estado==="Anulado"?"—":`<button class="btn sm sec" onclick="modPas(${p.id})">Gestionar</button>`]})))}</div>`; };
V.pasajes.init = () => { $("#pq").oninput = e => { S.q.p = e.target.value; render(true); }; };
function modPas(id) { const p = DB.pasajes.find(x => x.id === id);
  modal(`<h2>${p.cod}</h2><dl><dt>Pasajero</dt><dd>${p.pasajero}</dd><dt>Asiento</dt><dd>${p.asiento}</dd><dt>Estado</dt><dd>${badge(p.estado)}</dd></dl><h2 style="margin-top:1rem">Operación</h2><form id="fpp">${sel("Acción","a",[["pos","Postergar a otra fecha"],["tra","Transferir titularidad"],["anu","Anular y liberar asiento"]])}<div id="ex"></div><div class="row end"><button type="button" class="btn gh" onclick="cerrar()">Cancelar</button><button class="btn">Aplicar</button></div></form>`);
  const f = $("#fpp"), ex = () => { ex.v = f.a.value; $("#ex").innerHTML = ex.v === "pos" ? `<div class="f"><label>Nueva fecha</label><input type="date" value="2026-11-25"></div>` : ex.v === "tra" ? `<div class="f"><label>Nuevo titular</label><select>${DB.clientes.filter(c=>c.activo).map(c=>`<option>${c.nombre}</option>`).join("")}</select></div>` : `<div class="alert al-warn">El asiento quedará libre para la venta.</div>`; }; f.a.onchange = ex; ex();
  f.onsubmit = e => { e.preventDefault(); if (f.a.value === "anu") { p.estado = "Anulado"; DB.asientosOcupados = DB.asientosOcupados.filter(x => x !== p.asiento); } cerrar(); toast("Operación registrada"); render(); }; }

V.reservas = () => { const l = DB.pasajes.filter(p => p.estado === "Reservado");
  return head("Reservas por vencer","Reservas con plazo de vigencia activo") + `<div class="alert al-warn">⏰ Las reservas se liberan automáticamente al vencer su plazo.</div><div class="card">${l.length?tabla(["Código","Pasajero","Asiento","Vence","Acción"], l.map(p=>({cells:[`<b>${p.cod}</b>`,p.pasajero,p.asiento,p.vence||"—",`<button class="btn sm" onclick="conf(${p.id})">Confirmar venta</button> <button class="btn sm gh" onclick="libr(${p.id})">Liberar</button>`]}))):`<div class="alert al-info">No hay reservas pendientes.</div>`}</div>`; };
function conf(id) { DB.pasajes.find(p => p.id === id).estado = "Emitido"; toast("Reserva convertida en venta"); render(); }
function libr(id) { const p = DB.pasajes.find(x => x.id === id); p.estado = "Anulado"; DB.asientosReservados = DB.asientosReservados.filter(a => a !== p.asiento); toast("Reserva liberada"); render(); }

V.manifiesto = () => { const vid = +(S.q.m || 501); const v = DB.viajes.find(x => x.id === vid), l = DB.pasajes.filter(p => p.viaje === vid && p.estado === "Emitido");
  return head("Manifiesto de pasajeros","Listado oficial previo a la salida","<button class='btn sec' onclick='window.print()'>🖨️ Imprimir</button>") + `<div class="card"><div class="f"><label>Viaje</label><select id="sm">${DB.viajes.map(x=>`<option value="${x.id}" ${x.id===vid?"selected":""}>${suc(x.origen)} → ${suc(x.destino)} · ${x.fecha} ${x.hora}</option>`).join("")}</select></div></div>
  <div class="doc"><span class="mk">SIMULADO</span><h2>Manifiesto de pasajeros</h2><p style="color:var(--gris)">${v.bus} · Conductor: ${v.cond}</p>${l.length?tabla(["Asiento","Pasajero","Documento","Boleto"], l.map(p=>({cells:[p.asiento,p.pasajero,p.doc,p.cod]}))):"<div class='alert al-info'>Sin pasajes emitidos para este viaje.</div>"}<p><b>Total pasajeros:</b> ${l.length}</p></div>`; };
V.manifiesto.init = () => { $("#sm").onchange = e => { S.q.m = e.target.value; render(); }; };

V.embarque = () => { const l = DB.pasajes.filter(p => p.viaje === 501 && p.estado === "Emitido");
  return head("Control de embarque","Validación de boletos · Trujillo → Lima 20/11 21:30") + `<div class="grid g2"><div class="card"><h2>Validar boleto</h2><form id="fb" novalidate>${campo("Código de boleto","c",{p:"PAS-9001",e:"Ingrese el código"})}<button class="btn">Validar y registrar abordaje</button></form><div id="rb" style="margin-top:1rem"></div></div>
  <div class="card"><h2>Pasajeros (${l.filter(p=>p.embarcado).length}/${l.length} embarcados)</h2>${tabla(["Asiento","Pasajero","Abordaje"], l.map(p=>({cells:[p.asiento,p.pasajero,badge(p.embarcado?"Entregada":"Pendiente").replace("Entregada","Embarcó")]})))}</div></div>`; };
V.embarque.init = () => { $("#fb").onsubmit = e => { e.preventDefault(); if (!validar(e.target)) return; const p = DB.pasajes.find(x => x.cod === e.target.c.value.trim().toUpperCase()); const r = $("#rb"); if (!p || p.estado !== "Emitido") r.innerHTML = `<div class="alert" style="background:var(--errbg);color:var(--err)">❌ Boleto no válido, anulado o inexistente.</div>`; else if (p.embarcado) r.innerHTML = `<div class="alert al-warn">Este boleto ya fue usado para abordar.</div>`; else { p.embarcado = true; r.innerHTML = `<div class="alert al-ok">✅ ${p.pasajero} · asiento ${p.asiento}. Abordaje registrado.</div>`; setTimeout(() => render(), 1200); } }; };

/* ---------- Router ---------- */
function render(keepFocus) {
  const [r] = ruta(); const foco = keepFocus && document.activeElement?.id, pos = foco && document.activeElement.selectionStart;
  if (r === "login" || r === "expirada") { S.user = r === "login" ? null : S.user; $("#app").innerHTML = V[r](); V[r].init?.(); return; }
  if (!S.user) return go("login");
  if (!V[r]) return go("inicio");
  const ok = PERMISOS[S.user.rol].includes(r) || r === "denegado";
  const key = ok ? r : "denegado";
  $("#app").innerHTML = shell(r, V[key]()); V[key].init?.();
  if (foco) { const el = $("#" + foco); el.focus(); el.setSelectionRange?.(pos, pos); }
}
window.addEventListener("hashchange", () => { cerrar(); render(); window.scrollTo(0, 0); });
render();
