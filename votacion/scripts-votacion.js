let currentRound = [];
let nextRound = [];
let roundCount = 0; // Contador de rondas
let selectedVideosCount = 0; // Contador de videos seleccionados
let roundStage = ""; // Etapa del torneo

async function startTournament() {
  try {
      const response = await fetch('torneos.json');
      if (!response.ok) {
          throw new Error('No se pudo obtener el archivo JSON.');
      }
      const data = await response.json();
      // Obtener el ID de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const id = parseInt(urlParams.get('id'), 10);
      // Obtener el primer torneo (id: 1)
      const torneo = data.torneos.find(t => t.id === id);
      
      // Mostrar el nombre del torneo en la parte superior
      document.getElementById('tournament-name').textContent = torneo.nombre;

      // Iniciar con todos los videos del primer torneo
      currentRound = [...torneo.videos];
      showVideos();
  } catch (error) {
      console.error('Error al obtener datos del JSON:', error.message);
  }
}


function showVideos() {
  if (currentRound.length === 1) {
      displayWinner(currentRound[0]);
      return;
  }

  // Incrementar el contador de rondas al comenzar una nueva ronda
  roundCount++;

  // Incrementar el contador de videos seleccionados
  selectedVideosCount += 2;

  // Determinar la etapa del torneo según el total de videos seleccionados
  roundStage = getRoundStage(selectedVideosCount);

  // Mostrar información de la ronda actual
  document.getElementById('round-number').textContent = `Ronda ${roundCount} - ${roundStage}`;

  // Mostrar los títulos de los videos
  const video1 = currentRound.splice(getRandomIndex(currentRound), 1)[0];
  const video2 = currentRound.splice(getRandomIndex(currentRound), 1)[0];

  document.getElementById('video1').innerHTML = `
      <h3>${video1.titulo}</h3>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${video1.id}" frameborder="0" allowfullscreen></iframe>
  `;
  document.getElementById('video2').innerHTML = `
      <h3>${video2.titulo}</h3>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${video2.id}" frameborder="0" allowfullscreen></iframe>
  `;

  document.getElementById('vote1').onclick = () => vote(video1);
  document.getElementById('vote2').onclick = () => vote(video2);
}


function vote(winner) {
    nextRound.push(winner);
    if (currentRound.length === 0) {
        // Avanzar a la siguiente ronda
        currentRound = [...nextRound];
        nextRound = [];

        // Mostrar la ronda actual en la consola
        console.log(`Ronda ${roundCount} - ${getRoundStage(selectedVideosCount)}`);

        // Mostrar el ganador del torneo si es la final
        if (currentRound.length === 1) {
            displayWinner(currentRound[0]);
            return;
        }
    }
    showVideos();
}

function displayWinner(winner) {
  // Ocultar la sección del torneo
  document.getElementById('tournament').classList.add('hidden');
  
  // Mostrar la sección del ganador
  document.getElementById('winner-container').classList.remove('hidden');
  
  // Mostrar el mensaje de ganador con el título del video
  document.getElementById('winner-message').textContent = `¡El ganador es el video "${winner.titulo}"!`;

  // Mostrar el video ganador
  const winnerVideoContainer = document.getElementById('winner-video');
  winnerVideoContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${winner.id}" frameborder="0" allowfullscreen></iframe>`;
}


function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

function getRoundStage(selectedCount) {
    // Determinar la etapa del torneo según la cantidad total de videos seleccionados
    if (selectedCount <= 32) {
        return `32avos, ronda ${roundCount} de 16`;
    } else if (selectedCount > 32 && selectedCount <= 48) {
        return `16avos, ronda ${roundCount - 16} de 8`;
    } else if (selectedCount > 48 && selectedCount <= 56) {
        return `Octavos, ronda ${roundCount - 24} de 4`;
    } else if (selectedCount > 56 && selectedCount <= 60) {
        return `Cuartos de Final, ronda ${roundCount - 28} de 2`;
    } else if (selectedCount === 61) {
        return `Semifinal, ronda ${roundCount - 30} de 1`;
    } else if (selectedCount === 62) {
        return `Final`;
    } else {
        return "";
    }
}

function goBack() {
  window.history.back(); // Regresar a la página anterior
}


// Iniciar el torneo cuando se haya cargado el DOM
document.addEventListener('DOMContentLoaded', startTournament);
