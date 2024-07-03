document.addEventListener('DOMContentLoaded', () => {
    const catalogItems = [
        { id: 3, imgSrc: '../img/OIP.jpg', title: 'Hololive', filter: 'VTuber' },
        { id: 2, imgSrc: '../img/anime.webp', title: 'ANIME', filter: 'Anime' },
        { id: 1, imgSrc: '../img/hololive.webp', title: 'HOLOLIVE', filter: 'VTuber' },
        { id: 4, imgSrc: '../img/OIP.jpg', title: 'Título de la Imagen 1', filter: 'Pop' },
        { id: 5, imgSrc: '../img/OIP.jpg', title: 'Hololive', filter: 'VTuber' },
        { id: 6, imgSrc: '../img/OIP.jpg', title: 'ANIME', filter: 'Anime' },
        { id: 7, imgSrc: '../img/OIP.jpg', title: 'HOLOLIVE', filter: 'VTuber' },
        { id: 8, imgSrc: '../img/OIP.jpg', title: 'Título de la Imagen 1', filter: 'Pop' },
        { id: 9, imgSrc: '../img/OIP.jpg', title: 'Hololive', filter: 'VTuber' },
        { id: 10, imgSrc: '../img/OIP.jpg', title: 'ANIME', filter: 'Anime' },
        { id: 11, imgSrc: '../img/OIP.jpg', title: 'HOLOLIVE', filter: 'VTuber' },
        { id: 12, imgSrc: '../img/OIP.jpg', title: 'Título de la Imagen 1', filter: 'Pop' },
        { id: 13, imgSrc: '../img/OIP.jpg', title: 'Hololive', filter: 'VTuber' },
        { id: 14, imgSrc: '../img/OIP.jpg', title: 'ANIME', filter: 'Anime' },
        { id: 15, imgSrc: '../img/OIP.jpg', title: 'HOLOLIVE', filter: 'VTuber' },
        { id: 16, imgSrc: '../img/OIP.jpg', title: 'Título de la Imagen 1', filter: 'Pop' },
        { id: 17, imgSrc: '../img/OIP.jpg', title: 'Hololive', filter: 'VTuber' },
        { id: 18, imgSrc: '../img/OIP.jpg', title: 'ANIME', filter: 'Anime' },
        { id: 19, imgSrc: '../img/OIP.jpg', title: 'HOLOLIVE', filter: 'VTuber' },
        { id: 20, imgSrc: '../img/OIP.jpg', title: 'FINAL', filter: 'Rock' },
    ];

    const itemsPerPage = 16;
    let currentPage = 1;

    const catalog = document.getElementById('catalog');
    const pageNum = document.getElementById('pageNum');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const searchInput = document.getElementById('searchInput');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    function getSelectedFilters() {
        const selectedFilters = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFilters.push(checkbox.value);
            }
        });
        return selectedFilters;
    }

    function filterItems(items, filters, searchText) {
        return items.filter(item => {
            const matchesFilter = filters.length === 0 || filters.includes(item.filter);
            const matchesSearch = searchText === '' || item.title.toLowerCase().includes(searchText.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }

    function renderCatalog(page, searchText = '') {
        catalog.innerHTML = '';
        const filters = getSelectedFilters();
        const filteredItems = filterItems(catalogItems, filters, searchText);

        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const itemsToShow = filteredItems.slice(start, end);

        itemsToShow.forEach(item => {
            const catalogItem = document.createElement('div');
            catalogItem.classList.add('catalog-item');
            catalogItem.innerHTML = `
                <a href="../votacion.html?id=${item.id}">
                    <img src="${item.imgSrc}" alt="Imagen de ejemplo">
                    <div class="catalog-item-title">${item.title}</div>
                </a>
            `;
            catalog.appendChild(catalogItem);
        });

        pageNum.textContent = page;
        checkButtons(filteredItems.length);
    }

    function changePage(direction) {
        currentPage += direction;
        renderCatalog(currentPage, searchInput.value);
    }

    function checkButtons(totalItems) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * itemsPerPage >= totalItems;
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            currentPage = 1; // Reset to the first page whenever filters change
            renderCatalog(currentPage, searchInput.value);
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            changePage(-1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage * itemsPerPage < catalogItems.length) {
            changePage(1);
        }
    });

    searchInput.addEventListener('input', () => {
        currentPage = 1; // Resetear a la primera página al buscar
        renderCatalog(currentPage, searchInput.value);
    });

    renderCatalog(currentPage);
});
