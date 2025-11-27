// Inicializar variables globales
let ordenesTrabajo = [];
let modalNuevaOrden = null;
let modalDetalles = null;
let usuarioActual = {
    nombre: "Usuario Ejemplo", // Esto debería venir de la sesión
    id: "123" // Esto debería venir de la sesión
};
let graficaArea = null;
let graficaEstado = null;

// Función para cargar las órdenes desde localStorage
function cargarOrdenes() {
    try {
        const ordenesGuardadas = localStorage.getItem('ordenesTrabajo');
        if (ordenesGuardadas) {
            ordenesTrabajo = JSON.parse(ordenesGuardadas);
            actualizarTabla();
            actualizarGraficaOrdenesArea();
            actualizarGraficaEstadoOrdenes();
        }
    } catch (error) {
        console.error('Error al cargar las órdenes desde localStorage:', error);
    }
}

// Función para guardar las órdenes en localStorage
function guardarOrdenes() {
    try {
        localStorage.setItem('ordenesTrabajo', JSON.stringify(ordenesTrabajo));
        // Disparar evento personalizado para notificar a otras pestañas
        window.dispatchEvent(new Event('ordenesActualizadas'));
    } catch (error) {
        console.error('Error al guardar las órdenes en localStorage:', error);
    }
}


// Función para crear una nueva orden de trabajo
function crearOrdenTrabajo() {
    const form = document.getElementById('formOrdenTrabajo');
    
    if (!form.actividad.value.trim() || !form.area.value.trim() || !form.descripcion.value.trim() || 
        !form.equipo.value.trim()) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    const areasValidas = ['cromo', 'zinc', 'doblad', 'servicios', 'tratamiento'];
    if (!areasValidas.includes(form.area.value.toLowerCase())) {
        alert('Área no válida. Por favor, seleccione una área válida.');
        return;
    }

    try {
        const now = new Date();
        const orden = {
            id: generarIdOrden(form.area.value),
            actividad: form.actividad.value.trim(),
            area: form.area.value.trim(),
            descripcion: form.descripcion.value.trim(),
            equipo: form.equipo.value.trim(),
            reportadoPor: usuarioActual.nombre,
            fecha: now.toLocaleDateString(),
            hora: now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            // Nota: Los archivos no se pueden almacenar directamente en localStorage
            // Se puede implementar una solución alternativa como almacenar solo los nombres
            archivos: form.archivos.files.length > 0 ? 
                Array.from(form.archivos.files).map(file => file.name) : [],
            referencias: form.referencias.value.trim(),
            estado: 'pendiente',
            fechaCreacion: now.toISOString()
        };

        if (ordenesTrabajo.some(o => o.id === orden.id)) {
            alert('Error: El ID de la orden ya existe');
            return;
        }

        ordenesTrabajo.push(orden);
        guardarOrdenes(); // Guardar en localStorage
        actualizarTabla();
        actualizarGraficaOrdenesArea();
        actualizarGraficaEstadoOrdenes();
        
        if (modalNuevaOrden) {
            modalNuevaOrden.hide();
        }
        
        form.reset();
        
        const nowReset = new Date();
        form.reportadoPor.value = usuarioActual.nombre;
        form.fecha.value = nowReset.toLocaleDateString();
        form.hora.value = nowReset.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        alert('Orden creada exitosamente');
    } catch (error) {
        console.error('Error al crear la orden:', error);
        alert('Error al crear la orden. Por favor, inténtelo nuevamente.');
    }
}

// Función para cerrar una orden
function cerrarOrden(id) {
    const orden = ordenesTrabajo.find(o => o.id === id);
    if (orden) {
        orden.estado = 'completada';
        guardarOrdenes(); // Guardar cambios en localStorage
        actualizarTabla();
        actualizarGraficaOrdenesArea();
        actualizarGraficaEstadoOrdenes();
    }
}


// Evento para cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Cargar órdenes existentes al iniciar
        cargarOrdenes();

        // Verificar que Bootstrap esté cargado
        if (typeof bootstrap === 'undefined') {
            console.error('Bootstrap no está cargado');
            alert('Error: Bootstrap no está cargado. Por favor, asegúrese de incluir las bibliotecas necesarias.');
            return;
        }


    } catch (error) {
        console.error('Error al inicializar el sistema:', error);
        alert('Error al inicializar el sistema. Por favor, recargue la página.');
    }
});

// Escuchar cambios en localStorage desde otras pestañas
window.addEventListener('storage', function(e) {
    if (e.key === 'ordenesTrabajo') {
        // Recargar las órdenes cuando haya cambios desde otra pestaña
        cargarOrdenes();
    }
});

// Escuchar evento personalizado para actualizar las órdenes
window.addEventListener('ordenesActualizadas', function() {
    // Recargar las órdenes cuando se dispare el evento personalizado
    cargarOrdenes();
});

document.addEventListener('DOMContentLoaded', function() {
    const btnNuevaOrden = document.getElementById('btnNuevaOrden');
    if (btnNuevaOrden) {
        btnNuevaOrden.addEventListener('click', function() {
            // Redirigir a formato-ordenes.html
            window.location.href = 'formato-ordenes.html';
        });
    } else {
        console.error('No se encontró el botón de nueva orden');
    }
});