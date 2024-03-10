const header = document.getElementById("head");
const outputContainer = document.getElementById("output");
const videoElement = document.getElementById("video");

const seriesID = getQueryParam("seriesID");
header.textContent = seriesID; // Set header text

async function loadEpisodeButtons() {
  try {
    const infoUrl = `https://dramalama-api.vercel.app/movies/dramacool/info?id=${seriesID}`;
    const { data: infoData } = await axios.get(infoUrl);

    if (infoData.episodes && infoData.episodes.length > 0) {
      const episodeButtons = infoData.episodes.map(
        (episode, index) => `
          <button class="watch-button" data-episode-id="${episode.id}">
            ${index + 1}
          </button>
        `
      ).join("");

      outputContainer.innerHTML = episodeButtons;
    } else {
      outputContainer.textContent = "No episodes found.";
    }
  } catch (error) {
    console.error("Error fetching episode data:", error);
    outputContainer.textContent = "Error loading episodes. Please try again.";
  }
}

loadEpisodeButtons();

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("watch-button")) {
    const episodeID = event.target.getAttribute("data-episode-id");
    const watchUrl = `https://dramalama-api.vercel.app/movies/dramacool/watch?episodeId=${episodeID}&mediaId=${seriesID}`;

    try {
      const { data: Links } = await axios.get(watchUrl);
      const videoURL = Links.sources[0].url;

      header.textContent = `Episode ${episodeID}`;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoURL);
        hls.attachMedia(videoElement);
      } else {
        console.warn("HLS not supported");
        // Handle non-HLS playback if needed
      }
    } catch (error) {
      console.error("Error fetching video link:", error);
      // Display an error message to the user
    }
}
});

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
