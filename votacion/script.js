let videoData = [];
let currentVideos = [];
let winners = [];
let remainingVideos = [];

// Función para obtener parámetros de la URL por nombre
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Función asincrónica para cargar datos de videos basados en el producto especificado
async function fetchVideoData(product) {
    try {
        const response = await fetch(`votaciones/${product}.json`);
        const data = await response.json();
        console.log('Datos cargados:', data);
        document.getElementById("page-title").innerText = data.title;
        videoData = data.videos;
        remainingVideos = [...videoData];
        loadVideos();
    } catch (error) {
        console.error('Error al cargar los datos de videos:', error);
    }
}

// Función para obtener índices aleatorios de videos
function getRandomVideos() {
    let indexes = [];
    while (indexes.length < 2) {
        let randomIndex = Math.floor(Math.random() * remainingVideos.length);
        if (!indexes.includes(randomIndex)) {
            indexes.push(randomIndex);
        }
    }
    return indexes;
}

// Función para cargar videos en la página
function loadVideos() {
    if (remainingVideos.length < 2) {
        showResults();
        return;
    }

    currentVideos = getRandomVideos();
    document.getElementById("video1").src = `https://www.youtube.com/embed/${remainingVideos[currentVideos[0]].id}`;
    document.getElementById("video1-title").innerText = remainingVideos[currentVideos[0]].title;
    document.getElementById("video2").src = `https://www.youtube.com/embed/${remainingVideos[currentVideos[1]].id}`;
    document.getElementById("video2-title").innerText = remainingVideos[currentVideos[1]].title;

    // Mostrar la sección de contenido y ocultar el mensaje de carga
    document.querySelector(".container").style.display = "block";
    document.getElementById("loading-message").style.display = "none";
}

// Función para registrar un voto
function vote(winner) {
    const loser = winner === 1 ? 0 : 1;
    winners.push(remainingVideos[currentVideos[winner]]);
    remainingVideos.splice(currentVideos[loser], 1);

    if (remainingVideos.length === 0 && winners.length > 1) {
        remainingVideos = [...winners];
        winners = [];
    }
    
    loadVideos();
}


// Función para mostrar los resultados finales
function showResults() {
    document.querySelector(".container").style.display = "none"; // Oculta el contenedor principal
    document.getElementById("results").style.display = "block"; // Muestra la sección de resultados

    const topVotesList = document.getElementById("top-votes-list");
    topVotesList.innerHTML = ''; // Limpiar la lista antes de agregar elementos

    // Mostrar la frase si solo hay un ganador
    if (winners.length === 1) {
        const li = document.createElement("li");
        li.textContent = "Solo aparece un ganador en la pantalla.";
        topVotesList.appendChild(li);
    } else {
        // Mostrar todos los videos en orden de votación
        let index = 1;

        // Mostrar los videos votados
        winners.forEach((vote) => {
            const li = document.createElement("li");
            li.textContent = `#${index} - ${vote.title}`;
            topVotesList.appendChild(li);
            index++;
        });

        // Si no hay videos en total, mostrar un mensaje alternativo
        if (winners.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No se encontraron videos para mostrar.";
            topVotesList.appendChild(li);
        }
    }

    // Desplazar la vista hacia los resultados
    document.getElementById("results").scrollIntoView({ behavior: 'smooth' });
}

// Cuando se carga la ventana (equivalente a window.onload)
window.onload = function () {
    const product = getParameterByName('product');
    if (product) {
        fetchVideoData(product);
    } else {
        console.error('No se especificó ningún producto en la URL');
        document.getElementById("loading-message").innerText = "No se especificó ningún producto";
    }
};
