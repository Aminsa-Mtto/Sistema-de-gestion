window.permisos = {
    'admin': {
        dashboard: true,
        reportes: true,
        usuarios: true,
        configuracion: true,
        equipos: true,
        mantenimiento: true,
        documentos: true,
ordenestrabajo: true
    },
    'usuario': {
        dashboard: true,
        reportes: true,
        usuarios: false,
        configuracion: false,
        equipos: true,
        mantenimiento: true,
        documentos: true,
ordenestrabajo: true
    }
};

window.verificarPermiso = function(usuario, seccion) {
    const permisosUsuario = window.permisos[usuario] || {};
    return permisosUsuario[seccion] || false;
};

window.obtenerMenu = function(usuario) {
    const menuItems = [];
    const permisosUsuario = window.permisos[usuario] || {};
    
    if (window.verificarPermiso(usuario, 'dashboard')) {
        menuItems.push({id: 'dashboard', icon: 'fas fa-chart-bar', texto: 'Dashboard'});
    }
    if (window.verificarPermiso(usuario, 'reportes')) {
        menuItems.push({id: 'reportes', icon: 'fas fa-chart-line', texto: 'Reportes'});
    }
    if (window.verificarPermiso(usuario, 'equipos')) {
        menuItems.push({id: 'equipos', icon: 'fas fa-tools', texto: 'Equipos'});
    }
    if (window.verificarPermiso(usuario, 'mantenimiento')) {
        menuItems.push({id: 'mantenimiento', icon: 'fas fa-wrench', texto: 'Mantenimiento'});
    }
    if (window.verificarPermiso(usuario, 'documentos')) {
        menuItems.push({id: 'documentos', icon: 'fas fa-file', texto: 'Documentos'});
    }
 if (window.verificarPermiso(usuario, 'ordenestrabajo')) {
        menuItems.push({id: 'ordenes-trabajo', icon: 'fas fa-tasks', texto: 'OT'});
}
    if (window.verificarPermiso(usuario, 'usuarios')) {
        menuItems.push({id: 'usuarios', icon: 'fas fa-users', texto: 'Usuarios'});
    }
    if (window.verificarPermiso(usuario, 'configuracion')) {
        menuItems.push({id: 'configuracion', icon: 'fas fa-cog', texto: 'Configuración'});
    }
    return menuItems;
};