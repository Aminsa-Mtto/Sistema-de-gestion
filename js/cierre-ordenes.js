// Variables globales
let ordenesPendientes = [];
let modalCierreOrden = null;
let usuarioActual = {
    nombre: "Usuario Ejemplo",
    id: "123"
};

// Funciones auxiliares
function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.role = 'alert';
    alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    
    const container = document.querySelector('main');
    if (container) {
        container.insertBefore(alerta, container.firstChild);
    }
}

function getEstadoColor(estado) {
    switch(estado) {
        case 'pendiente': return 'warning';
        case 'en_proceso': return 'primary';
        case 'completada': return 'success';
        default: return 'light';
    }
}

// Funciones de inicialización
function inicializar() {
    try {
        // Verificar dependencias
        if (typeof bootstrap === 'undefined') {
            console.error('Bootstrap no está cargado');
            mostrarAlerta('Error: Bootstrap no está cargado. Por favor, asegúrese de incluir las bibliotecas necesarias.', 'danger');
            return;
        }

        // Inicializar modales
        inicializarModales();

        // Cargar datos iniciales
        cargarOrdenesPendientes();

        // Agregar eventos
        agregarEventos();
        
        // Verificar si hay nuevas órdenes al cargar la página
        const nuevaOrden = localStorage.getItem('nuevaOrden');
        if (nuevaOrden) {
            const orden = JSON.parse(nuevaOrden);
            ordenesPendientes.push(orden);
            actualizarTabla();
            localStorage.removeItem('nuevaOrden');
        }
    } catch (error) {
        console.error('Error al inicializar:', error);
        mostrarAlerta('Error al inicializar la página. Por favor, recargue.', 'danger');
    }
}

// Funciones de modales
function inicializarModales() {
    try {
        const modalElement = document.getElementById('modalCierreOrden');
        if (!modalElement) {
            console.error('Modal no encontrado');
            return;
        }

        modalCierreOrden = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false,
            focus: true
        });

        modalElement.addEventListener('shown.bs.modal', function (e) {
            console.log('Modal mostrado');
        });

        modalElement.addEventListener('hidden.bs.modal', function (e) {
            console.log('Modal oculto');
            const form = document.getElementById('formCierreOrden');
            if (form) {
                form.reset();
            }
        });

    } catch (error) {
        console.error('Error al inicializar modal:', error);
        mostrarAlerta('Error al inicializar el modal. Por favor, recargue.', 'danger');
    }
}

// Funciones de datos
function cargarOrdenesPendientes() {
    // Simulación de carga de datos
    setTimeout(() => {
        ordenesPendientes = [
            {
                id: "C0001",
                actividad: "Preventivo",
                area: "cromo",
                equipo: "Línea de cromado #1",
                fecha: new Date().toLocaleDateString(),
                hora: new Date().toLocaleTimeString(),
                estado: "pendiente"
            }
        ];
        actualizarTabla();
    }, 500);
}

// Funciones de UI
function actualizarTabla() {
    try {
        const tbody = document.getElementById('ordenesTable').getElementsByTagName('tbody')[0];
        if (!tbody) {
            console.error('Tabla no encontrada');
            return;
        }

        tbody.innerHTML = '';

        ordenesPendientes.forEach(orden => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${orden.id}</td>
                <td>${orden.actividad}</td>
                <td>${orden.area}</td>
                <td>${orden.equipo}</td>
                <td>${orden.fecha} ${orden.hora}</td>
                <td><span class="badge bg-${getEstadoColor(orden.estado)}">${orden.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="abrirModalCierre('${orden.id}')">
                        <i class="fas fa-check"></i> Cerrar
                    </button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error al actualizar tabla:', error);
    }
}

function abrirModalCierre(id) {
    try {
        const orden = ordenesPendientes.find(o => o.id === id);
        if (!orden) {
            mostrarAlerta('Error: Orden no encontrada.', 'danger');
            return;
        }

        const form = document.getElementById('formCierreOrden');
        if (!form) {
            console.error('Formulario no encontrado');
            mostrarAlerta('Error: No se encontró el formulario de cierre.', 'danger');
            return;
        }

        // Llenar los campos del formulario
        document.getElementById('ordenId').value = orden.id;
        document.getElementById('ordenIdInfo').value = orden.id;
        document.getElementById('actividadInfo').value = orden.actividad;
        document.getElementById('areaInfo').value = orden.area;
        document.getElementById('equipoInfo').value = orden.equipo;

        // Establecer fecha y hora actuales
        const now = new Date();
        document.getElementById('fechaCierre').value = now.toISOString().split('T')[0];
        document.getElementById('horaCierre').value = now.toTimeString().split(' ')[0];

        // Mostrar el modal
        if (modalCierreOrden) {
            modalCierreOrden.show();
        } else {
            console.error('Modal no inicializado');
            mostrarAlerta('Error: Modal no inicializado correctamente.', 'danger');
        }
    } catch (error) {
        console.error('Error al abrir modal:', error);
        mostrarAlerta('Error al abrir el modal. Por favor, inténtelo nuevamente.', 'danger');
    }
}

// Funciones de eventos
function agregarEventos() {
    const form = document.getElementById('formCierreOrden');
    if (form) {
        // Agregar evento submit
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCierre();
        });

        // Agregar evento click al botón de cerrar
        const closeButton = form.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                form.reset();
            });
        }
    }

    // Evento de escucha de LocalStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'nuevaOrden') {
            const nuevaOrden = JSON.parse(e.newValue);
            ordenesPendientes.push(nuevaOrden);
            actualizarTabla();
        }
    });
}

// Función principal de guardar cierre
function guardarCierre() {
    try {
        console.log('Iniciando proceso de guardar cierre');
        
        const form = document.getElementById('formCierreOrden');
        if (!form) {
            console.error('Formulario no encontrado');
            mostrarAlerta('Error: No se encontró el formulario de cierre.', 'danger');
            return;
        }

        const ordenId = document.getElementById('ordenId').value;
        if (!ordenId) {
            console.error('ID de orden no encontrado');
            mostrarAlerta('Error: No se encontró el ID de la orden.', 'danger');
            return;
        }

        const cierre = {
            ordenId: ordenId,
            fechaCierre: document.getElementById('fechaCierre').value,
            horaCierre: document.getElementById('horaCierre').value,
            realizadoPor: document.getElementById('realizadoPor').value,
            estado: document.getElementById('estadoCierre').value,
            descripcionRealizada: document.getElementById('descripcionRealizada').value,
            refacciones: document.getElementById('refacciones').value,
            observaciones: document.getElementById('observaciones').value,
            fechaRegistro: new Date().toISOString()
        };

        console.log('Datos del cierre:', cierre);

        // Validar campos requeridos
        if (!cierre.fechaCierre || !cierre.horaCierre || !cierre.realizadoPor ||
            !cierre.estado || !cierre.descripcionRealizada) {
            console.error('Campos requeridos faltantes');
            mostrarAlerta('Por favor, complete todos los campos requeridos.', 'warning');
            return;
        }

        // Buscar la orden en el array
        const orden = ordenesPendientes.find(o => o.id === ordenId);
        if (!orden) {
            console.error('Orden no encontrada');
            mostrarAlerta('Error: Orden no encontrada.', 'danger');
            return;
        }

        // Actualizar la orden
        orden.estado = cierre.estado;
        orden.fechaCierre = cierre.fechaCierre;
        orden.horaCierre = cierre.horaCierre;
        orden.realizadoPor = cierre.realizadoPor;
        orden.descripcionRealizada = cierre.descripcionRealizada;
        orden.refacciones = cierre.refacciones;
        orden.observaciones = cierre.observaciones;

        console.log('Orden actualizada:', orden);

        // Actualizar la tabla
        actualizarTabla();

        // Notificar a la página de generación
        localStorage.setItem('ordenActualizada', JSON.stringify(cierre));

        // Cerrar el modal
        if (modalCierreOrden) {
            modalCierreOrden.hide();
        } else {
            console.error('Modal no inicializado');
        }

        // Limpiar el formulario
        form.reset();

        // Mostrar mensaje de éxito
        mostrarAlerta('Cierre de orden registrado exitosamente.', 'success');

    } catch (error) {
        console.error('Error al guardar cierre:', error);
        mostrarAlerta('Error al guardar el cierre de la orden. Por favor, inténtelo nuevamente.', 'danger');
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializar);

// Variables globales
let ordenesPendientes = [];
let ordenesFiltradas = []; // Nueva variable para mantener las órdenes filtradas
let modalCierreOrden = null;
let usuarioActual = {
    nombre: "Usuario Ejemplo",
    id: "123"
};

// Funciones de filtrado
function filtrarOrdenes() {
    try {
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const area = document.getElementById('filtroArea').value.toLowerCase();
        const estado = document.getElementById('filtroEstado').value.toLowerCase();
        
        console.log('Filtrando con:', { busqueda, area, estado });

        ordenesFiltradas = ordenesPendientes.filter(orden => {
            // Convertir todos los valores a minúsculas para comparación
            const id = orden.id.toLowerCase();
            const actividad = orden.actividad.toLowerCase();
            const areaOrden = orden.area.toLowerCase();
            const equipo = orden.equipo.toLowerCase();
            const estadoOrden = orden.estado.toLowerCase();

            // Filtrar por búsqueda
            const matchesBusqueda = 
                id.includes(busqueda) ||
                actividad.includes(busqueda) ||
                areaOrden.includes(busqueda) ||
                equipo.includes(busqueda);

            // Filtrar por área
            const matchesArea = area === 'todas' || areaOrden === area;

            // Filtrar por estado
            const matchesEstado = estado === 'todos' || estadoOrden === estado;

            return matchesBusqueda && matchesArea && matchesEstado;
        });

        console.log('Órdenes filtradas:', ordenesFiltradas);
        actualizarTabla();
    } catch (error) {
        console.error('Error al filtrar órdenes:', error);
        mostrarAlerta('Error al filtrar las órdenes. Por favor, inténtelo nuevamente.', 'danger');
    }
}

// Agregar eventos de filtrado
function agregarEventos() {
    // ... código existente ...

    // Eventos de filtrado
    document.getElementById('busqueda').addEventListener('input', filtrarOrdenes);
    document.getElementById('filtroArea').addEventListener('change', filtrarOrdenes);
    document.getElementById('filtroEstado').addEventListener('change', filtrarOrdenes);

    // Evento de escucha de LocalStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'nuevaOrden') {
            const nuevaOrden = JSON.parse(e.newValue);
            ordenesPendientes.push(nuevaOrden);
            ordenesFiltradas = [...ordenesPendientes]; // Actualizar órdenes filtradas
            actualizarTabla();
        }
    });
}

// Actualizar la función actualizarTabla para usar ordenesFiltradas
function actualizarTabla() {
    try {
        const tbody = document.getElementById('ordenesTable').getElementsByTagName('tbody')[0];
        if (!tbody) {
            console.error('Tabla no encontrada');
            return;
        }

        tbody.innerHTML = '';

        // Usar ordenesFiltradas en lugar de ordenesPendientes
        ordenesFiltradas.forEach(orden => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${orden.id}</td>
                <td>${orden.actividad}</td>
                <td>${orden.area}</td>
                <td>${orden.equipo}</td>
                <td>${orden.fecha} ${orden.hora}</td>
                <td><span class="badge bg-${getEstadoColor(orden.estado)}">${orden.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="abrirModalCierre('${orden.id}')">
                        <i class="fas fa-check"></i> Cerrar
                    </button>
                </td>
            `;
        });

        // Actualizar estadísticas
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error al actualizar tabla:', error);
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const estadisticas = {
        total: ordenesFiltradas.length,
        pendientes: ordenesFiltradas.filter(o => o.estado === 'pendiente').length,
        enProceso: ordenesFiltradas.filter(o => o.estado === 'en_proceso').length,
        completadas: ordenesFiltradas.filter(o => o.estado === 'completada').length
    };

    document.getElementById('total').textContent = estadisticas.total;
    document.getElementById('pendientes').textContent = estadisticas.pendientes;
    document.getElementById('enProceso').textContent = estadisticas.enProceso;
    document.getElementById('completadas').textContent = estadisticas.completadas;
}