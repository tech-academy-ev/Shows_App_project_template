let favouriteShows = [];

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
    let headlineDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    nameDiv.textContent = show.getName();
    nameDiv.classList.add("show-name");
    // TODO: EVTL Favourites wieder hinzufügen
    // let star = document.createElement("div"); 
    // star.classList.add("star");
    // star.innerHTML = `<i class="fa-regular fa-star" onmouseover="this.className = 'fa-solid fa-star'"; onmouseout="this.className='fa-regular fa-star'" ></i>`;
    // star.addEventListener("click", (e) => {
    //   favouriteShows.push(e.currentTarget.parentNode.firstChild.innerText);
    //   console.log(favouriteShows);
    // }) 
    let showImg = document.createElement("img");
    showImg.src = show.getImage();
    headlineDiv.append(nameDiv);
    headlineDiv.classList.add("showHeadline");
    showDiv.append(headlineDiv, showImg);

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
  setData(input);
});

const input = document.getElementById("show-input");
input.addEventListener("focus", () => {
  let searchHistory = getData().reverse();
  console.log(searchHistory);
  let filteredSearchHistory = [];
  if (searchHistory.length > 5) {
    for (let i = 0; i<5; i++) {
      filteredSearchHistory.push(searchHistory[i]);
    }
  } else {
    filteredSearchHistory = searchHistory;
  }
  const searchList = document.getElementById("searchList");
  searchList.classList.remove("hidden-el");
  searchList.innerHTML = "";
  filteredSearchHistory.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.classList.add("searchItem");
    listItem.innerHTML = item;
    searchList.append(listItem);
    listItem.addEventListener("click", (e) => {
      const input = document.getElementById("show-input");
      input.value = e.target.innerHTML;
    });
    
  });
  console.log(filteredSearchHistory);
});

input.addEventListener("blur", () => setTimeout(clearList,100));

function clearList() {
  const searchList = document.getElementById("searchList");
  searchList.classList.add("hidden-el");
}

fetchFromTvMazeAPI("star wars"); // :) =p

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
    modalShowTitle.textContent = show.name
    modalShowImg.src = show.image ? show.image : "https://via.placeholder.com/210x295/111217/FFFFFF/?text=No%20Image"
    modalShowSummary.innerHTML = show.summary
    modalShowTags.textContent = `${show.language ? show.language : ""} - ${show.mainGenre ? show.mainGenre : ""}`
    modalShowUrl.href = show.tvMazeUrl
    // 1. delete the old data
    // 2. get the data from the clicked show
    // 3. display the data in the dom
}

function setData(newDataPoint) {
  let myDataDeserialized = getData();
  myDataDeserialized.push(newDataPoint);
  let myDataSerialized = JSON.stringify(myDataDeserialized);
  localStorage.setItem("myData", myDataSerialized);
}

function getData() {
  let myDataDeserialized = []
  if (localStorage.getItem("myData") !== null) {
    myDataDeserialized = JSON.parse(localStorage.getItem("myData"));
  }
  return myDataDeserialized;
}
