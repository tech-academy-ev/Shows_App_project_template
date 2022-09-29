async function fetchFromTvMazeAPI(searchQuery) {
    try {
        const response = await fetch(
            "https://api.tvmaze.com/search/shows?q=" + searchQuery
        );
        const allShowsData = await response.json();
        console.log(allShowsData);
        getRelevantInformationFromJsonData(allShowsData);
    } catch (error) {
        console.log(error);
    }
}


function getRelevantInformationFromJsonData(allShowsData) {
    let allShowsList = []
    for (show of allShowsData) {
        console.log(show);
        let showData = show.show;
        let language = showData.language;
        let name = showData.name;
        let mainGenre = showData.genres ? showData.genres[0] : null;
        let image = showData.image ? showData.image.original : null;
        let officialUrl = showData.officialSite;
        let showStartDate = showData.premiered;
        let showEndDate = showData.ended;
        let summary = showData.summary;
        let tvMazeUrl = showData.url;
        let cableNetwork = showData.network ? showData.network.name : null;
        let webChannel = showData.webChannel ? showData.webChannel.name : null;
        let showInstance = new Show(language, name, mainGenre, image, officialUrl, 
            showStartDate, showEndDate, summary, tvMazeUrl, cableNetwork, webChannel);
        allShowsList.push(showInstance);
    }
    renderShowsToPage(allShowsList);
}

function renderShowsToPage(allShowsList) {
  const showTabDiv = document.getElementById("movie-tab");
  showTabDiv.innerHTML = "";
  for (let show of allShowsList) {
    let showDiv = document.createElement("div");
    showDiv.classList.add("show");
    let nameDiv = document.createElement("div");
    nameDiv.textContent = show.getName();
    nameDiv.classList.add("show-name");
    let showImg = document.createElement("img");
    showImg.src = show.getImage();

    showDiv.addEventListener('click', (e) => {
        let clickedShow
        if (e.path.length === 8) {
            clickedShow = e.path[1]
        } else {
            clickedShow = e.path[0]
        }
        openModal(show)
    });

    showDiv.append(nameDiv, showImg);
    showTabDiv.appendChild(showDiv);
  }
}


const form = document.getElementById("inputs");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.getElementById("show-input").value;
  console.log(input);
  fetchFromTvMazeAPI(input);
});

fetchFromTvMazeAPI("man");

// Modal functionality
const modal = document.querySelector('.modal');
const overlay = document.getElementById('overlay');
const closeModalButton = document.querySelector('[data-close-modal]');
const modalShowTitle = document.querySelector(".show-title")
const modalShowTags = document.querySelector(".show-tags")
const modalShowSummary = document.querySelector(".show-summary")
const modalShowUrl= document.querySelector(".show-url")
const modalShowImg= document.querySelector(".show-image")


closeModalButton.addEventListener('click', () => {
    closeModal();
});

overlay.addEventListener('click', () => {
    closeModal();
});

function closeModal() {
    modal.classList.remove('active');
	overlay.classList.remove('active');
}

function openModal(show) {
	modal.classList.add('active');
	overlay.classList.add('active');
    fillModalWithShowData(show)
}

function fillModalWithShowData(show) {
    console.log(show)
    // 1. delete the old data
    // 2. get the data from the clicked show
    // 3. display the data in the dom
}
