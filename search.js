function createSearchResultsContainer() {
    let existing = document.getElementById('search-results');
    if (existing) {
        existing.innerHTML = '';
        return existing;
    }

    const container = document.createElement('main');
    container.id = 'search-results';
    container.className = 'search-results';
    const header = document.querySelector('header');
    if (header && header.parentNode) {
        header.parentNode.insertBefore(container, header.nextSibling);
    } else {
        document.body.insertBefore(container, document.body.firstChild);
    }
    return container;
}

function hidePageContent() {
    document.querySelectorAll('main.page-content').forEach((main) => {
        main.style.display = 'none';
    });
}

function showPageContent() {
    document.querySelectorAll('main.page-content').forEach((main) => {
        main.style.display = '';
    });
    const existing = document.getElementById('search-results');
    if (existing) {
        existing.remove();
    }
}

function renderGameGrid(games, target, headingText) {
    target.innerHTML = '';

    if (!games.length) {
        const message = document.createElement('p');
        message.textContent = 'No games found';
        message.style.color = '#b0b8d6';
        target.appendChild(message);
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'game-grid';

    games.forEach((game) => {
        const card = document.createElement('a');
        card.className = 'game-card game-card-link';
        card.href = game.link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        const title = document.createElement('div');
        title.className = 'game-card-title';
        title.textContent = game.name;

        const status = document.createElement('div');
        status.className = 'game-card-status';
        status.textContent = 'Work in progress!';
        status.style.display = 'none';

        const img = document.createElement('img');
        img.alt = game.name;
        img.onerror = () => {
            img.onerror = null;
            img.src = 'assets/wip.png';
            status.style.display = 'block';
        };
        img.src = game.image || 'assets/wip.png';
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(status);

        grid.appendChild(card);
    });

    target.appendChild(grid);
}

function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    const gamesList = typeof allGames !== 'undefined' ? allGames : (window.allGames || []);
    const results = gamesList.filter((game) => {
        return game.name.toLowerCase().includes(normalized);
    });

    hidePageContent();
    const resultsContainer = createSearchResultsContainer();
    renderGameGrid(results, resultsContainer, `Search results for "${query}"`);
}

function debounce(fn, delay = 150) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function handleSearch(event) {
    event.preventDefault();
    const input = document.getElementById('site-search');
    if (!input) {
        return;
    }
    const query = input.value.trim();
    if (!query) {
        showPageContent();
        return;
    }
    renderSearchResults(query);
}

function handleSearchInput(event) {
    const query = event.target.value.trim();
    if (!query) {
        showPageContent();
        return;
    }
    renderSearchResults(query);
}

function initializeGamesPage() {
    const gridTarget = document.getElementById('game-grid');
    const gamesList = typeof allGames !== 'undefined' ? allGames : (window.allGames || []);
    if (!gridTarget || !gamesList.length) {
        return;
    }
    renderGameGrid(gamesList, gridTarget, 'All Games');
}

window.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('site-search');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearchInput, 150));
    }
    initializeGamesPage();
});
