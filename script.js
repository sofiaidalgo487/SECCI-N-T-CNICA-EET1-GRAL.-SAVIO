/* ============================================================
   SECCIÓN TÉCNICA DE INFORMÁTICA — ENET N°1 PALPALA
   Lógica de acceso (front-end) y búsqueda de equipos.

   IMPORTANTE PARA QUIEN MANTENGA ESTA PÁGINA:
   La validación de correo institucional que sigue es un filtro
   de front-end, pensado como capa básica de uso interno. NO
   reemplaza una autenticación real. Para un control de acceso
   serio (verificar que el correo exista, pertenezca a un
   docente activo, etc.) esto debe conectarse a un backend o a
   un proveedor de identidad (por ej. inicio de sesión con la
   cuenta institucional de Google/Microsoft).
   ============================================================ */

const DOMINIO_INSTITUCIONAL = "@eet1saviopalpala.edu.ar";
const SESSION_KEY = "sti_sesion_usuario";

/* ---------------- datos de ejemplo del inventario ----------------
   Reemplazar por los equipos reales del taller, o por una carga
   dinámica (fetch a un JSON / API) cuando haya backend disponible. */
const INVENTARIO = [
  {
    id: "906784",
    aula: "Taller de Informática — Puesto 1",
    estado: "operativo",
    cpu: "Intel Core i3-10100",
    ram: "8 GB DDR4",
    disco: "SSD 240 GB",
    so: "Windows 10 Pro",
    inventario: "INV-2021-114",
    fecha: "12/03/2026",
    obs: "Sin observaciones."
  },
  {
    id: "906785",
    aula: "Taller de Informática — Puesto 2",
    estado: "revision",
    cpu: "Intel Core i3-10100",
    ram: "4 GB DDR4",
    disco: "HDD 500 GB",
    so: "Windows 10 Pro",
    inventario: "INV-2021-115",
    fecha: "05/08/2026",
    obs: "Lentitud reportada por 5° año. Pendiente ampliar RAM."
  },
  {
    id: "906786",
    aula: "Taller de Informática — Puesto 3",
    estado: "operativo",
    cpu: "AMD Ryzen 3 3200G",
    ram: "8 GB DDR4",
    disco: "SSD 240 GB",
    so: "Ubuntu 22.04 LTS",
    inventario: "INV-2022-031",
    fecha: "20/07/2026",
    obs: "Dual boot habilitado para Electrónica."
  },
  {
    id: "906787",
    aula: "Sala de Proyectos",
    estado: "fuera de servicio",
    cpu: "Intel Core i3-4130",
    ram: "4 GB DDR3",
    disco: "HDD 500 GB",
    so: "Windows 10 Pro",
    inventario: "INV-2018-009",
    fecha: "14/02/2026",
    obs: "Fuente de alimentación dañada. Esperando repuesto."
  },
  {
    id: "906788",
    aula: "Taller de Informática — Puesto 5",
    estado: "operativo",
    cpu: "Intel Core i5-10400",
    ram: "16 GB DDR4",
    disco: "SSD 480 GB",
    so: "Windows 11 Pro",
    inventario: "INV-2023-002",
    fecha: "18/08/2026",
    obs: "Equipo destinado a diseño asistido (CAD)."
  },
  {
    id: "906789",
    aula: "Biblioteca",
    estado: "operativo",
    cpu: "Intel Celeron N4020",
    ram: "4 GB DDR4",
    disco: "eMMC 64 GB",
    so: "Windows 10 Pro",
    inventario: "INV-2020-077",
    fecha: "02/06/2026",
    obs: "Uso exclusivo de consulta y catálogo."
  }
];

const ESTADOS = {
  "operativo":        { label: "Operativo",         clase: "ok"   },
  "revision":          { label: "En revisión",       clase: "warn" },
  "fuera de servicio": { label: "Fuera de servicio", clase: "off"  }
};

/* ---------------- referencias al DOM ---------------- */
const gateView      = document.getElementById("gateView");
const appView        = document.getElementById("appView");
const gateForm       = document.getElementById("gateForm");
const emailInput     = document.getElementById("emailInput");
const gateMessage    = document.getElementById("gateMessage");
const sessionEmail   = document.getElementById("sessionEmail");
const roleBadge      = document.getElementById("roleBadge");
const logoutBtn      = document.getElementById("logoutBtn");
const headerStatus   = document.getElementById("headerStatus");
const headerStatusText = document.getElementById("headerStatusText");

const searchForm     = document.getElementById("searchForm");
const searchInput    = document.getElementById("searchInput");
const searchFeedback = document.getElementById("searchFeedback");
const resultCard     = document.getElementById("resultCard");
const inventoryBody  = document.getElementById("inventoryBody");

/* ---------------- acceso institucional ---------------- */
const ROLES = {
  alumno:  { label: "Alumno",  clase: "role-alumno",  puedeEditar: false },
  docente: { label: "Docente", clase: "role-docente", puedeEditar: true  }
};

let sesionActual = null; // { email, rol }

function esCorreoInstitucional(correo){
  const limpio = correo.trim().toLowerCase();
  return limpio.endsWith(DOMINIO_INSTITUCIONAL) && limpio.length > DOMINIO_INSTITUCIONAL.length;
}

function rolSeleccionadoEnFormulario(){
  const marcado = gateForm.querySelector('input[name="rol"]:checked');
  return marcado ? marcado.value : "alumno";
}

function iniciarSesion(correo, rol){
  const sesion = { email: correo, rol: rol };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
  mostrarApp(sesion);
}

function cerrarSesion(){
  sessionStorage.removeItem(SESSION_KEY);
  sesionActual = null;
  gateView.classList.remove("hidden");
  appView.classList.add("hidden");
  gateMessage.textContent = "";
  gateMessage.className = "gate-message";
  emailInput.value = "";
  headerStatus.classList.remove("online");
  headerStatusText.textContent = "Acceso restringido";
}

function mostrarApp(sesion){
  sesionActual = sesion;
  const rolInfo = ROLES[sesion.rol] || ROLES.alumno;

  gateView.classList.add("hidden");
  appView.classList.remove("hidden");
  sessionEmail.textContent = sesion.email;

  roleBadge.textContent = rolInfo.label;
  roleBadge.className = "badge " + rolInfo.clase;

  headerStatus.classList.add("online");
  headerStatusText.textContent = rolInfo.puedeEditar ? "Sesión docente — edición habilitada" : "Sesión alumno — solo lectura";

  document.querySelectorAll(".docente-only").forEach(el => {
    el.classList.toggle("hidden", !rolInfo.puedeEditar);
  });

  resultCard.classList.add("hidden");
  renderTabla();

  /* si se entró desde un enlace de NFC (?id=PC-014), abrir esa ficha directo */
  if (idPendienteDesdeURL) {
    const equipo = buscarEquipo(idPendienteDesdeURL);
    idPendienteDesdeURL = null;
    if (equipo) {
      searchInput.value = equipo.id;
      mostrarResultado(equipo);
    }
  }
}

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const correo = emailInput.value;
  const rol = rolSeleccionadoEnFormulario();

  if (!correo || !correo.includes("@")) {
    gateMessage.textContent = "Ingresá una dirección de correo válida.";
    gateMessage.className = "gate-message error";
    return;
  }

  if (!esCorreoInstitucional(correo)) {
    gateMessage.textContent = `Acceso denegado: usá tu correo institucional (${DOMINIO_INSTITUCIONAL}).`;
    gateMessage.className = "gate-message error";
    return;
  }

  gateMessage.textContent = "Acceso concedido. Cargando panel...";
  gateMessage.className = "gate-message ok";
  setTimeout(() => iniciarSesion(correo.trim(), rol), 350);
});

logoutBtn.addEventListener("click", cerrarSesion);

/* al cargar, respetar sesión previa de la pestaña */
window.addEventListener("DOMContentLoaded", () => {
  if (idPendienteDesdeURL) {
    gateMessage.textContent = `Vas a ver la ficha de ${idPendienteDesdeURL} apenas ingreses.`;
    gateMessage.className = "gate-message ok";
  }

  const guardada = sessionStorage.getItem(SESSION_KEY);
  if (!guardada) return;
  try {
    const sesion = JSON.parse(guardada);
    if (sesion && sesion.email && esCorreoInstitucional(sesion.email) && ROLES[sesion.rol]) {
      mostrarApp(sesion);
    }
  } catch (err) {
    sessionStorage.removeItem(SESSION_KEY);
  }
});

/* ---------------- enlaces directos por equipo (para NFC) ----------------
   Cada ID de equipo tiene un enlace único con el formato:
     https://tu-sitio/index.html?id=PC-014
   Ese enlace es el que se graba en la etiqueta NFC pegada al gabinete.
   Al abrirse (por el navegador o al acercar el celular al tag), la página:
     1) si no hay sesión, muestra el acceso institucional como siempre,
     2) apenas se loguea el usuario, busca automáticamente ese equipo
        y abre su ficha.
   El enlace se arma con location.origin + pathname, así funciona igual
   sin importar en qué dominio/carpeta esté publicado el sitio. */
function construirEnlaceEquipo(id){
  const base = location.origin + location.pathname;
  return `${base}?id=${encodeURIComponent(id)}`;
}

function obtenerIdDesdeURL(){
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  return id ? id.trim() : null;
}

async function copiarAlPortapapeles(texto){
  try{
    await navigator.clipboard.writeText(texto);
    return true;
  }catch(err){
    /* respaldo por si el navegador bloquea la API de portapapeles */
    try{
      const temp = document.createElement("textarea");
      temp.value = texto;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.focus();
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      return true;
    }catch(err2){
      return false;
    }
  }
}

let idPendienteDesdeURL = obtenerIdDesdeURL();

/* ---------------- búsqueda por ID ---------------- */
function normalizarId(valor){
  return valor.trim().toUpperCase().replace(/\s+/g, "");
}

function buscarEquipo(idBuscado){
  const idNorm = normalizarId(idBuscado);
  return INVENTARIO.find(e => normalizarId(e.id) === idNorm);
}

let equipoEnFicha = null; // id del equipo mostrado actualmente en la ficha

const editBtn        = document.getElementById("editBtn");
const editActions     = document.getElementById("editActions");
const saveEditBtn     = document.getElementById("saveEditBtn");
const cancelEditBtn   = document.getElementById("cancelEditBtn");
const readOnlyNote    = document.getElementById("readOnlyNote");
const editEstadoSel   = document.getElementById("editEstado");
const editObsArea     = document.getElementById("editObs");
const resultEstadoEl  = document.getElementById("resultEstado");
const resultObsEl     = document.getElementById("resultObs");
const resultLinkInput = document.getElementById("resultLink");
const copyLinkBtn     = document.getElementById("copyLinkBtn");
const linkCopyFeedback = document.getElementById("linkCopyFeedback");

function puedeEditar(){
  return !!sesionActual && ROLES[sesionActual.rol] && ROLES[sesionActual.rol].puedeEditar;
}

function mostrarResultado(equipo){
  equipoEnFicha = equipo.id;
  const estadoInfo = ESTADOS[equipo.estado] || { label: equipo.estado, clase: "" };

  document.getElementById("resultAula").textContent = equipo.aula;
  document.getElementById("resultId").textContent = equipo.id;
  resultEstadoEl.textContent = estadoInfo.label;
  resultEstadoEl.className = "badge " + estadoInfo.clase;

  document.getElementById("resultCpu").textContent = equipo.cpu;
  document.getElementById("resultRam").textContent = equipo.ram;
  document.getElementById("resultDisk").textContent = equipo.disco;
  document.getElementById("resultSo").textContent = equipo.so;
  document.getElementById("resultInv").textContent = equipo.inventario;
  document.getElementById("resultFecha").textContent = equipo.fecha;
  resultObsEl.textContent = equipo.obs;

  const enlace = construirEnlaceEquipo(equipo.id);
  resultLinkInput.value = enlace;
  linkCopyFeedback.textContent = "";

  /* deja el ID en la URL de la pestaña, así el enlace se puede compartir
     o copiar directo desde la barra del navegador también */
  const nuevaURL = `${location.pathname}?id=${encodeURIComponent(equipo.id)}`;
  history.replaceState(null, "", nuevaURL);

  desactivarModoEdicion();
  editBtn.classList.toggle("hidden", !puedeEditar());
  readOnlyNote.classList.toggle("hidden", puedeEditar());

  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function activarModoEdicion(){
  if (!puedeEditar() || !equipoEnFicha) return;
  const equipo = buscarEquipo(equipoEnFicha);
  if (!equipo) return;

  editEstadoSel.value = equipo.estado;
  editObsArea.value = equipo.obs;

  resultEstadoEl.classList.add("hidden");
  editEstadoSel.classList.remove("hidden");
  resultObsEl.classList.add("hidden");
  editObsArea.classList.remove("hidden");

  editBtn.classList.add("hidden");
  editActions.classList.remove("hidden");
}

function desactivarModoEdicion(){
  resultEstadoEl.classList.remove("hidden");
  editEstadoSel.classList.add("hidden");
  resultObsEl.classList.remove("hidden");
  editObsArea.classList.add("hidden");
  editActions.classList.add("hidden");
  if (puedeEditar()) editBtn.classList.remove("hidden");
}

copyLinkBtn.addEventListener("click", async () => {
  const ok = await copiarAlPortapapeles(resultLinkInput.value);
  linkCopyFeedback.textContent = ok
    ? "Enlace copiado. Ya podés grabarlo en la etiqueta NFC."
    : "No se pudo copiar automáticamente. Seleccioná el texto y copialo manualmente.";
});

editBtn.addEventListener("click", activarModoEdicion);
cancelEditBtn.addEventListener("click", () => {
  const equipo = buscarEquipo(equipoEnFicha);
  if (equipo) mostrarResultado(equipo);
});

saveEditBtn.addEventListener("click", () => {
  if (!puedeEditar() || !equipoEnFicha) return;
  const equipo = buscarEquipo(equipoEnFicha);
  if (!equipo) return;

  equipo.estado = editEstadoSel.value;
  equipo.obs = editObsArea.value.trim() || "Sin observaciones.";

  mostrarResultado(equipo);
  renderTabla();
  searchFeedback.textContent = `Ficha de ${equipo.id} actualizada.`;
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const valor = searchInput.value;

  if (!valor.trim()) {
    searchFeedback.textContent = "Ingresá un ID para buscar.";
    resultCard.classList.add("hidden");
    return;
  }

  const equipo = buscarEquipo(valor);
  if (!equipo) {
    searchFeedback.textContent = `No se encontró ningún equipo con ID "${valor.trim()}".`;
    resultCard.classList.add("hidden");
    return;
  }

  searchFeedback.textContent = "";
  mostrarResultado(equipo);
});

/* ---------------- tabla general ---------------- */
function renderTabla(){
  inventoryBody.innerHTML = "";
  const permiteEditar = puedeEditar();

  INVENTARIO.forEach(equipo => {
    const estadoInfo = ESTADOS[equipo.estado] || { label: equipo.estado, clase: "" };
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${equipo.id}</td>
      <td>${equipo.aula}</td>
      <td><span class="badge ${estadoInfo.clase}">${estadoInfo.label}</span></td>
      <td>${equipo.cpu}</td>
      <td>${equipo.ram}</td>
      <td>${equipo.so}</td>
      <td><button type="button" class="table-link-btn" data-id="${equipo.id}">Copiar enlace</button></td>
      ${permiteEditar ? '<td class="docente-only"><button type="button" class="table-edit-btn">Editar</button></td>' : ""}
    `;
    fila.addEventListener("click", () => {
      searchInput.value = equipo.id;
      searchFeedback.textContent = "";
      mostrarResultado(equipo);
      if (permiteEditar) setTimeout(activarModoEdicion, 0);
    });

    const linkBtn = fila.querySelector(".table-link-btn");
    linkBtn.addEventListener("click", async (ev) => {
      ev.stopPropagation(); // que no dispare también el click de la fila
      const enlace = construirEnlaceEquipo(equipo.id);
      const ok = await copiarAlPortapapeles(enlace);
      const original = linkBtn.textContent;
      linkBtn.textContent = ok ? "¡Copiado!" : "No se pudo copiar";
      setTimeout(() => { linkBtn.textContent = original; }, 1800);
    });

    inventoryBody.appendChild(fila);
  });
}
