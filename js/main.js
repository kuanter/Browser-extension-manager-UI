const toggleDarkModeBtn = document.getElementById('toggle-dark-mode-btn');
const extensionList = document.getElementById('extension-list');
const filters = document.getElementById('filters');
let allExtensions = [];

async function fetchExtensions(){
    try{
        const response = await fetch("data.json");
        allExtensions = await response.json();
        console.log(allExtensions);
    }catch(error){
        console.log("ERROR: fetch data.json");
    }
}

function renderExtensions(filteredExtensions = allExtensions) {
    if(!filteredExtensions){
        extensionList.innerHTML = "Sorry, we can't fetch your extensions";
        return;
    }

    const htmlString = filteredExtensions.map(extension => {
        return ` 
        <li class="extension-item">
            <div class="extension-info">
                <img
                src="${extension.logo}"
                alt="${extension.name} logo"
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
                data-name="${extension.name}"
                >
                Remove
                </button>

                <label class="toggle-switch">
                <input type="checkbox" class="sr-only checkbox" data-name="${extension.name}" ${extension.isActive ? 'checked' : ''}/>
                <span class="toggle-slider"></span>
                </label>
            </div>
        </li>`
    }).join('');

    extensionList.innerHTML = htmlString;
}

function getFilteredExtensions(status) {
    if(status === "all") return allExtensions;
    
    if(status === "active") return allExtensions.filter(extension => extension.isActive === true);
    
    if(status === "inactive")  return allExtensions.filter(extension => extension.isActive === false);
}

toggleDarkModeBtn.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.documentElement.dataset.theme);
});

extensionList.addEventListener('change', (event) => {
    if (event.target.classList.contains('checkbox')) {
        const extensionName = event.target.dataset.name;
        const extensionStatus = event.target.checked;

        const index = allExtensions.findIndex(extension => extension.name === extensionName);
        allExtensions[index].isActive = extensionStatus;

        console.log(`[UI TEST]: PATCH: Extension: ${extensionName}, Status: ${extensionStatus}`);
    }
});

extensionList.addEventListener('click', (event) => {
    if(event.target.classList.contains("remove-btn")){    
        const extensionName = event.target.dataset.name;
        allExtensions = allExtensions.filter(extension => extension.name !== extensionName);
        
        const checkedFilterBtn = document.querySelector('.filter-btn:checked');
        const currFilter = getFilteredExtensions(checkedFilterBtn.dataset.status);
        renderExtensions(currFilter);
       
        console.log(`DELETE: ${extensionName} has been deleted`)
    }
});

filters.addEventListener('change', (event) => {
    if (event.target.classList.contains('filter-btn')) {
        const filteredExtensions = getFilteredExtensions(event.target.dataset.status);
        renderExtensions(filteredExtensions);
    }       
});

async function initApp() {
    await fetchExtensions();
    renderExtensions();
}

initApp();