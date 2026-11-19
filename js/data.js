/* Datos mock – Módulo Gestión de Encomiendas y Clientes (Grupo J). Sin backend. */
const DB = {
  usuarios: [
    { id: 1, nombre: "Carla Mendoza Ruiz", correo: "admin@transandes.pe", rol: "Administrador", sucursal: "Trujillo – Terminal Terrestre", activo: true },
    { id: 2, nombre: "Luis Paredes Vega", correo: "vendedor@transandes.pe", rol: "Vendedor", sucursal: "Trujillo – Terminal Terrestre", activo: true },
    { id: 3, nombre: "Jorge Salazar Díaz", correo: "conductor@transandes.pe", rol: "Conductor", sucursal: "Chiclayo – Terminal Norte", activo: true },
    { id: 4, nombre: "Rosa Quispe León", correo: "rquispe@transandes.pe", rol: "Vendedor", sucursal: "Chiclayo – Terminal Norte", activo: true },
    { id: 5, nombre: "Mario Castro Peña", correo: "mcastro@transandes.pe", rol: "Conductor", sucursal: "Lima – Plaza Norte", activo: false }
  ],
  terminales: [
    { id: 1, nombre: "Trujillo – Terminal Terrestre", ubigeo: "130101", dep: "La Libertad", dir: "Av. América Sur 2650", activo: true },
    { id: 2, nombre: "Chiclayo – Terminal Norte", ubigeo: "140101", dep: "Lambayeque", dir: "Av. Bolognesi 1100", activo: true },
    { id: 3, nombre: "Lima – Plaza Norte", ubigeo: "150132", dep: "Lima", dir: "Av. Túpac Amaru 210", activo: true },
    { id: 4, nombre: "Piura – Terminal Piura", ubigeo: "200101", dep: "Piura", dir: "Av. Sánchez Cerro 1300", activo: true },
    { id: 5, nombre: "Cajamarca – Terminal Sur", ubigeo: "060101", dep: "Cajamarca", dir: "Jr. Atahualpa 890", activo: false }
  ],
  tarifas: [
    { id: 1, tramo: "Trujillo → Lima", desde: 0, hasta: 5, precio: 18 },
    { id: 2, tramo: "Trujillo → Lima", desde: 5.01, hasta: 20, precio: 35 },
    { id: 3, tramo: "Trujillo → Chiclayo", desde: 0, hasta: 5, precio: 12 },
    { id: 4, tramo: "Trujillo → Chiclayo", desde: 5.01, hasta: 20, precio: 22 },
    { id: 5, tramo: "Trujillo → Piura", desde: 0, hasta: 5, precio: 15 },
    { id: 6, tramo: "Lima → Trujillo", desde: 0, hasta: 5, precio: 18 }
  ],
  clientes: [
    { id: 1, tipo: "N", doc: "72145896", nombre: "Ana Lucía Torres Rojas", tel: "945 123 456", correo: "ana.torres@mail.com", activo: true },
    { id: 2, tipo: "N", doc: "46321587", nombre: "Pedro Gamarra Linares", tel: "956 777 210", correo: "pgamarra@mail.com", activo: true },
    { id: 3, tipo: "J", doc: "20601234567", nombre: "Distribuidora Norte SAC", tel: "044 258 900", correo: "ventas@distnorte.pe", activo: true },
    { id: 4, tipo: "N", doc: "70218843", nombre: "María Fernanda Chávez", tel: "921 340 118", correo: "mfchavez@mail.com", activo: false },
    { id: 5, tipo: "J", doc: "20555123890", nombre: "Agroexport Virú EIRL", tel: "044 301 455", correo: "contacto@agrovirú.pe", activo: true },
    { id: 6, tipo: "N", doc: "41987654", nombre: "Julio César Benites Ulloa", tel: "987 654 321", correo: "jbenites@mail.com", activo: true }
  ],
  encomiendas: [
    { id: 1001, cod: "ENC-2026-1001", rem: 1, dest: 2, origen: 1, destino: 3, estado: "En tránsito", pago: "Pagado", monto: 35, peso: 12.4, clave: "48K-2M9", conductor: "Jorge Salazar Díaz", fecha: "2026-11-16" },
    { id: 1002, cod: "ENC-2026-1002", rem: 3, dest: 5, origen: 1, destino: 2, estado: "Registrada", pago: "Pendiente", monto: 22, peso: 8.0, clave: "—", conductor: "Sin asignar", fecha: "2026-11-17" },
    { id: 1003, cod: "ENC-2026-1003", rem: 6, dest: 1, origen: 3, destino: 1, estado: "Entregada", pago: "Pagado", monto: 18, peso: 3.2, clave: "77P-1X5", conductor: "Jorge Salazar Díaz", fecha: "2026-11-14" },
    { id: 1004, cod: "ENC-2026-1004", rem: 2, dest: 3, origen: 1, destino: 4, estado: "En almacén destino", pago: "Pagado", monto: 15, peso: 4.5, clave: "19Q-8T3", conductor: "Mario Castro Peña", fecha: "2026-11-15" },
    { id: 1005, cod: "ENC-2026-1005", rem: 5, dest: 3, origen: 1, destino: 3, estado: "Registrada", pago: "Pendiente", monto: 35, peso: 17.9, clave: "—", conductor: "Sin asignar", fecha: "2026-11-18" }
  ],
  historial: {
    1001: [["2026-11-16 08:10", "Registrada", "Terminal Trujillo"], ["2026-11-16 21:30", "En tránsito", "Salida Trujillo → Lima"]],
    1003: [["2026-11-14 09:00", "Registrada", "Plaza Norte"], ["2026-11-14 22:00", "En tránsito", "Salida Lima → Trujillo"], ["2026-11-15 07:40", "Entregada", "Receptor: Ana Torres"]]
  },
  viajes: [
    { id: 501, origen: 1, destino: 3, fecha: "2026-11-20", hora: "21:30", bus: "Mercedes Marcopolo – ABC-123", cond: "Jorge Salazar Díaz", precio: 65, libres: 18, estado: "Programado" },
    { id: 502, origen: 1, destino: 3, fecha: "2026-11-20", hora: "23:00", bus: "Volvo B8R – XYZ-908", cond: "Mario Castro Peña", precio: 80, libres: 9, estado: "Programado" },
    { id: 503, origen: 1, destino: 2, fecha: "2026-11-20", hora: "08:00", bus: "Scania K360 – QWE-441", cond: "Jorge Salazar Díaz", precio: 25, libres: 27, estado: "Programado" },
    { id: 504, origen: 3, destino: 1, fecha: "2026-11-21", hora: "22:00", bus: "Mercedes Marcopolo – ABC-123", cond: "Jorge Salazar Díaz", precio: 65, libres: 31, estado: "Programado" }
  ],
  asientosOcupados: [1, 2, 5, 6, 9, 12, 15, 16, 20, 21, 22, 27, 30, 33],
  asientosReservados: [3, 4, 18, 24],
  pasajes: [
    { id: 9001, cod: "PAS-9001", viaje: 501, pasajero: "Ana Lucía Torres Rojas", doc: "72145896", asiento: 7, estado: "Emitido", monto: 65, embarcado: false },
    { id: 9002, cod: "PAS-9002", viaje: 501, pasajero: "Pedro Gamarra Linares", doc: "46321587", asiento: 8, estado: "Emitido", monto: 65, embarcado: true },
    { id: 9003, cod: "PAS-9003", viaje: 501, pasajero: "Julio César Benites", doc: "41987654", asiento: 10, estado: "Reservado", monto: 65, embarcado: false, vence: "2026-11-19 18:00" },
    { id: 9004, cod: "PAS-9004", viaje: 502, pasajero: "María F. Chávez", doc: "70218843", asiento: 14, estado: "Anulado", monto: 80, embarcado: false },
    { id: 9005, cod: "PAS-9005", viaje: 503, pasajero: "Rosa Díaz Palma", doc: "43001122", asiento: 3, estado: "Emitido", monto: 25, embarcado: false }
  ]
};
const suc = id => DB.terminales.find(t => t.id === id)?.nombre.split(" – ")[0] ?? "—";
const cli = id => DB.clientes.find(c => c.id === id);
