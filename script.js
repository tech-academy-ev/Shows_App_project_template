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
        // console.log(show);
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
    // let headlineDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    nameDiv.textContent = show.name
    nameDiv.classList.add("show-name");

    let showImg = document.createElement("img");
    showImg.classList.add("show-image")
    showImg.src = show.image

    let star = document.createElement("i");
    
    addCorrectClassName(show, star)

    star.style.position = "relative"
    star.style.alignSelf = "flex-end"
    star.style.marginRight = "20px"
    star.style.bottom = "0px"
    showDiv.appendChild(star)
    
    
    star.addEventListener("click", (e) => {
      setFavourites(show)
      
      toggleStar(e.target)
    }) 

    // headlineDiv.append(nameDiv);
    // headlineDiv.classList.add("showHeadline");
    showDiv.append(showImg);

    showImg.addEventListener('click', () => {
        openModal(show)
        fillModalWithShowData(show)
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
  favsButton.style.display = "block"
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
}

function fillModalWithShowData(show) {
    console.log(show)
    modalShowTitle.textContent = show.name
    modalShowImg.src = show.image ? show.image : "https://via.placeholder.com/210x295/111217/FFFFFF/?text=No%20Image"
    modalShowSummary.innerHTML = show.summary
    modalShowTags.textContent = `${show.language ? show.language : ""} - ${show.mainGenre ? show.mainGenre : ""}`
    modalShowUrl.href = show.tvMazeUrl
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

function getFavourites() {
  if (localStorage.getItem("favourites") !== null) {
    let favShows = JSON.parse(localStorage.getItem("favourites"));
    return favShows
  } else {
    return []
  }
}

function setFavourites(newFavShow) {
  let favShows = getFavourites()
  if (containsObject(newFavShow, favShows)) {
    let newFavShows = favShows.filter(show => show.name !== newFavShow.name)
    localStorage.setItem("favourites", JSON.stringify(newFavShows));
  } else {
    favShows.push(newFavShow);
    localStorage.setItem("favourites", JSON.stringify(favShows));
  }
}

function containsObject(show, array) {
  for (let i = 0; i < array.length; i++) {
      if (array[i].name === show.name) {
          return true;
      }
  }

  return false;
}

function toggleStar(star) {
  if (star.className === "fa-regular fa-star") {
    star.className = "fa-solid fa-star"
  } else {
    star.className = "fa-regular fa-star"
  }
}

function addCorrectClassName(show, star) {
  const favs = getFavourites()
  
  if (favs === null) return

  if (containsObject(show, favs)) {
    star.classList.add("fa-solid", "fa-star");
  } else {
    star.classList.add("fa-regular", "fa-star");
  }
}

const favsButton = document.getElementById("favourites-button")

favsButton.addEventListener("click", () => {
  const favourites = getFavourites()
  renderShowsToPage(favourites)
  if (favsButton.textContent === "Favoriten anzeigen") {
    favsButton.style.display = "none"
  }
})
