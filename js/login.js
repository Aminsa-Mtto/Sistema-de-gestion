
// Base de datos de usuarios
const usuarios = {
    'admin': {
        password: 'admin123',
        nombre: 'Administrador',
        rol: 'admin'
    },
    'usuario1': {
        password: 'usuario123',
        nombre: 'Usuario 1',
        rol: 'usuario'
    }
};

// Función para verificar sesión
function verificarSesion() {
    const session = localStorage.getItem('session');
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        
        if (now - sessionData.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('session');
            return false;
        }
        
        return sessionData;
    } catch {
        localStorage.removeItem('session');
        return false;
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;

    if (!username || !password) {
        showNotification('Por favor ingrese usuario y contraseña', 'error');
        return;
    }

    // Agregar esta línea
    showNotification('Iniciando sesión...', 'success');

    const user = usuarios[username];
    if (user && user.password === password) {
        // Usuario válido
        showNotification('¡Bienvenido al sistema!', 'success');
        
        // Guardar sesión
        const sessionData = {
            username: username,
            rol: user.rol,
            timestamp: Date.now()
        };
        
        localStorage.setItem('session', JSON.stringify(sessionData));
        
        // Redirigir al menú
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1000);
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
}
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error('No se encontró el elemento de notificación');
        return;
    }
    
    notification.className = `notification ${type} show`;
    notification.textContent = message;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
// Función para generar el menú
function generarMenu() {
    const sessionData = verificarSesion();
    if (!sessionData) {
        window.location.href = 'login.html';
        return;
    }
    
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    const menuItems = window.obtenerMenu(sessionData.rol);
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-page', item.id);
        
        card.innerHTML = `
            <div class="card-content">
                <i class="${item.icon}"></i>
                <h3>${item.texto}</h3>
                <p>Haz clic para acceder</p>
            </div>
        `;
        
        menuContainer.appendChild(card);
    });
    
    menuContainer.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const page = card.getAttribute('data-page');
            const sessionData = verificarSesion();
            if (sessionData) {
                window.location.href = page + '.html';
            }
        });
    });
}

// Configurar eventos solo cuando sea necesario
document.addEventListener('DOMContentLoaded', function() {
    // Solo verificar sesión si estamos en menu.html
    if (window.location.pathname.includes('menu.html')) {
        generarMenu();
    }
    
    // Configurar formulario de login solo si estamos en login.html
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }
});

// Función para redirigir
function redirect(page) {
    window.location.href = page;
}