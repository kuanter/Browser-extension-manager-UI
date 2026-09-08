const toggleDarkModeBtn = document.getElementById('toggle-dark-mode-btn');
const extensionList = document.getElementById('extension-list');

toggleDarkModeBtn.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.documentElement.dataset.theme);
});

async function renderExtensions() {
    try{
        const response = await fetch('data.json');
        const extensions = await response.json();

        const htmlString = extensions.map(extension => {
            return ` 
            <li class="extension-item">
                <div class="extension-info">
                    <img
                    src="${extension.logo}"
                    alt="Dev Lens Icon"
                    class="extension-icon"
                    />
                    <div class="extension-text">
                    <h2 class="extension-name">${extension.name}</h2>
                    <p class="extension-description">
                        ${extension.description}
                    </p>
                    </div>
                </div>

                <div class="extension-buttons">
                    <button
                    class="remove-btn btn"
                    type="button"
                    aria-label="Remove extension"
                    >
                    Remove
                    </button>

                    <label class="toggle-switch">
                    <input type="checkbox" class="sr-only checkbox" ${extension.isActive ? 'checked' : ''}/>
                    <span class="toggle-slider"></span>
                    </label>
                </div>
            </li>`
        }).join('');

        extensionList.innerHTML = htmlString;
    }catch (error) {
        console.log(`Rendering extensions failed: ${error}`);
        extensionList.innerHTML = '<p>Failed to render extensions.</p>';
    }
}

renderExtensions();