// Función para verificar la sesión
function verificarSesion() {
    const session = localStorage.getItem('session');
    if (!session) {
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        if (!sessionData.username || !sessionData.rol) {
            localStorage.removeItem('session');
            return false;
        }
        
        const now = Date.now();
        const sessionAge = now - sessionData.timestamp;
        
        if (sessionAge > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('session');
            return false;
        }
        
        return true;
    } catch {
        localStorage.removeItem('session');
        return false;
    }
}

// Función para generar el menú
function generarMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) {
        return;
    }
    
    menuContainer.innerHTML = '';
    
    // Obtener el rol del usuario de la sesión
    const session = localStorage.getItem('session');
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    const sessionData = JSON.parse(session);
    const role = sessionData.rol;
    
    const menuItems = window.obtenerMenu(role);
    
    if (!menuItems || menuItems.length === 0) {
        return;
    }
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-page', item.id);
        
        card.innerHTML = `
            <div class="card-content">
                <i class="${item.icon}"></i>
                <h3>${item.texto}</h3>
               
            </div>
        `;
        
        menuContainer.appendChild(card);
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (verificarSesion()) {
                window.location.href = item.id + '.html';
            }
        });
    });
}
function logout() {
    // Eliminar la sesión
    localStorage.removeItem('session');
    
    // Redirigir al login
    window.location.href = 'login.html';
}

// Agregar el evento al botón de cierre de sesión
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.user-info button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});
// Evento de carga del DOM
document.addEventListener('DOMContentLoaded', generarMenu);