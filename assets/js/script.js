var searchFormEl = document.getElementById("search-form");
var searchButton = document.querySelector(".search-button");

function handleSearchForm (event) {
    event.preventDefault();

    var searchInputVal = document.getElementById("search-input").value;
    
    if (!searchInputVal) {
        console.error("You need a search input value.");
        return;
    }

    var queryString = './search-results.html?q=' + searchInputVal;

    location.assign(queryString); 
}

searchButton.addEventListener('click', handleSearchForm);