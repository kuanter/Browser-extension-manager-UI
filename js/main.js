const toggleDarkModeBtn = document.getElementById('toggle-dark-mode-btn');


toggleDarkModeBtn.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.documentElement.dataset.theme);
});