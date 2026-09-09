// ==========================================                                                          
// 1. GLOBAL STATE & DOM ELEMENTS                                                                      
// ==========================================  

const toggleDarkModeBtn = document.getElementById('toggle-dark-mode-btn');
const extensionList = document.getElementById('extension-list');
const filters = document.getElementById('filters');
let allExtensions = [];

// ==========================================                                                          
// 2. FUNCTIONS                                                                       
// ========================================== 

/*Fetch extension from data.json*/
async function fetchExtensions(){
    try{
        const response = await fetch("data.json");
        allExtensions = await response.json();
        console.log(allExtensions);
    }catch(error){
        console.log("ERROR: fetch data.json");
    }
}

/** 
    Render extension items dynamically
    @param {Array} filteredExtensions - your filtered extensions or dafault allExtensions
*/
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


/** 
    Filter extension items by status
    @param {string} status - can be "all", "active" or "inactive"
*/
function getFilteredExtensions(status) {
    if(status === "all") return allExtensions;
    
    if(status === "active") return allExtensions.filter(extension => extension.isActive === true);
    
    if(status === "inactive")  return allExtensions.filter(extension => extension.isActive === false);
}

// ==========================================                                                          
// 3. EVENT LISTENERS                                                                                  
// ==========================================  

toggleDarkModeBtn.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.documentElement.dataset.theme);
});

extensionList.addEventListener('change', (event) => {
    if (event.target.classList.contains('checkbox')) {
        const extensionName = event.target.dataset.name;
        const extensionStatus = event.target.checked;

        // Update status in allExtensions without using renderExtensions()
        const index = allExtensions.findIndex(extension => extension.name === extensionName);
        allExtensions[index].isActive = extensionStatus;

        console.log(`[UI TEST]: PATCH: Extension: ${extensionName}, Status: ${extensionStatus}`);
    }
});

extensionList.addEventListener('click', (event) => {
    if(event.target.classList.contains("remove-btn")){    
        const extensionName = event.target.dataset.name;
        allExtensions = allExtensions.filter(extension => extension.name !== extensionName);
        
        //Remove extension from DOM without using renderExtensions()
        event.target.closest('.extension-item').remove();
       
        console.log(`DELETE: ${extensionName} has been deleted`)
    }
});

filters.addEventListener('change', (event) => {
    if (event.target.classList.contains('filter-btn')) {
        const filteredExtensions = getFilteredExtensions(event.target.dataset.status);
        renderExtensions(filteredExtensions);
    }       
});

// ==========================================
// 4. INITIALIZATION
// ==========================================

async function initApp() {
    await fetchExtensions();
    renderExtensions();
}

initApp();