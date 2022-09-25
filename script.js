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
  for (show of allShowsList) {
    let showDiv = document.createElement("div");
    showDiv.classList.add("show");
    let nameDiv = document.createElement("div");
    nameDiv.textContent = show.getName();
    nameDiv.classList.add("show-name");
    let showImg = document.createElement("img");
    showImg.src = show.getImage();

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
