// Загружаем токен из CSS
function getTokenFromCSS() {
    const styles = document.documentElement.style;
    const tokenValue = styles.getPropertyValue('--dropbox-token').trim().replace(/["']/g, '');
    
    if (!tokenValue || tokenValue === '') {
        console.error('Токен не найден в token.css');
        return null;
    }
    return tokenValue;
}

// Проверка подключения к Dropbox
async function checkDropboxConnection(token) {
    try {
        const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}

// Инициализация приложения
async function initApp() {
    const token = getTokenFromCSS();
    const authStatus = document.getElementById('auth-status');
    
    if (!token) {
        authStatus.innerHTML = '<p class="error">Ошибка: токен не найден в token.css</p>';
        return;
    }

    authStatus.innerHTML = '<p>Проверка токена...</p>';
    
    const isConnected = await checkDropboxConnection(token);
    
    if (isConnected) {
        authStatus.innerHTML = '<p class="success">Успешное подключение!</p>';
        setTimeout(() => {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            // Здесь инициализация основного приложения
        }, 1000);
    } else {
        authStatus.innerHTML = `
            <p class="error">Ошибка подключения к Dropbox</p>
            <p>Проверьте токен в token.css</p>
        `;
    }
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', initApp);