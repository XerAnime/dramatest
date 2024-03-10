// index.html

const nameInput = document.getElementById("name");
const outputContainer = document.getElementById("output");
const loadingOverlay = document.getElementById('loading-overlay');

// Event listener for watch now button clicks
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("watch-button")) {
        const button = event.target;
        const identifier = button.getAttribute("data-identifier");
        window.open(`video.html?seriesID=${identifier}`); // Use template literal for clarity
    }
});

// Event listener for Enter key presses in name input
nameInput.addEventListener("keydown", keyhandler);

function keyhandler(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
        video_function();
    }
}

// Main video search function
async function video_function() {
    outputContainer.innerHTML = ''; // Clear output before displaying results
    loadingOverlay.style.display = 'flex'; // Show loading animation

    const movieName = nameInput.value.trim(); // Trim leading/trailing whitespace

    if (movieName === "") {
        loadingOverlay.style.display = "none"; // Hide loading animation
        return; // Exit function if no input
    }

    // Construct the search URL using template literal
    const searchUrl = `https://dramalama-api.vercel.app/movies/dramacool/${movieName}?page=1`;

    try {
        const response = await axios.get(searchUrl);
        const results = response.data.results;

        if (results.length === 0) {
            outputContainer.innerHTML = '<p class="no-results">No results found.</p>';
            loadingOverlay.style.display = 'none';
            return; // Exit function if no results
        }

        for (const item of results) {
            const newElement = document.createElement("section");
            newElement.classList.add("drama-entries");

            const { title, image, id } = item;

            const movieEntry = `
                <img class="movie-poster" src=${`https://image-proxy-tau.vercel.app/image-proxy?url=${image.replace(/\s/g, '%20')}`}>
                <p class="movie-heading"> ${title} </p>
                <button class="watch-button" data-identifier="${id}"> Watch Now </button>
            `;

            newElement.innerHTML = movieEntry;
            outputContainer.appendChild(newElement);
        }

        loadingOverlay.style.display = 'none'; // Hide loading animation after results are displayed

    } catch (error) {
        console.error("Error fetching data:", error);
        outputContainer.innerHTML = '<p class="error">Error fetching results. Please try again.</p>';
        loadingOverlay.style.display = 'none'; // Hide loading animation on error
    }
}
