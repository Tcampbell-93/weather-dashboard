var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var citiesSearched = document.querySelector('.cities-searched');
var searchButtonEl = document.querySelector('.search-button');

function getParamater() {
    var searchParamsArr = document.location.search.split('=');      // getting the city from the first page to be 

    var query = searchParamsArr[1];
    searchApi(query);
}

function searchApi (query) {
    var apiKey = "46ebca62a4923b052a4202a74356e91a";        // my personal api key
    var locQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" 
    + query + "&appid=" + apiKey + "&units=imperial";       // making the url for the query

    saveSearches(query);
    getSavedSearches();     // gets the saved searches and updates them dynamically

    fetch(locQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (resp) {
            resultTextEl.textContent = resp.city.name;

            if(!resp.list) {
                resultContentEl.innerHTML = "<h2>No results for this city.</h2>";
            } else {
                resultContentEl.textContent = '';
                for (var i = 6; i < resp.list.length; i += 8) {     // itterating through every 6th entry to get weather at noon each day
                    printResults(resp.list[i]);
                }
            }
        })
        .catch(function (error) {
            console.error(error);
        });
}

function printResults(resultObj) {
    console.log(resultObj);

    var weatherCard = document.createElement('div');
    weatherCard.classList.add('card', 'bg-light', 'text-dark', 'p-3');

    var weatherBody = document.createElement('div');
    weatherBody.classList.add('card-body');

    var cardDate = document.createElement('h4');
    cardDate.classList.add('card-date');
    var date = resultObj.dt_txt;
    date = date.split(' ').shift();
    cardDate.textContent = date;

    var weatherIcon = resultObj.weather[0].icon;
    var iconUrl = getWeatherIcon(weatherIcon);      // getting the icon images for the weather cards

    var iconImg = document.createElement('img');
    iconImg.src = iconUrl;

    var temp = document.createElement('div');
    temp.textContent = "Temperature: " + resultObj.main.temp + "\u00B0 F";      // adding temperature to card

    var humidity = document.createElement('div');
    humidity.textContent = 'Humidity: ' + resultObj.main.humidity + "%";        // adding humidity to card

    var windSpeed = document.createElement('div');
    windSpeed.textContent = 'Wind: ' + resultObj.wind.speed + ' mph';       // adding wind speed to card

    weatherBody.append(cardDate);
    weatherBody.append(iconImg);
    weatherBody.append(temp);
    weatherBody.append(humidity);
    weatherBody.append(windSpeed);
    weatherCard.append(weatherBody);
    resultContentEl.append(weatherCard);        // appending all the information to the cards then onto the page
}

function getWeatherIcon (weatherIcon) {
    var icon = 'https://openweathermap.org/img/wn/' + weatherIcon + "@2x.png";      // function to get the weather icons
    return icon;
}

function saveSearches(query) {
    var storedCities = localStorage.getItem('cities');      // function to save the searches made by the user
    var cities = [];
  
    if (storedCities !== null) {
      cities = JSON.parse(storedCities);
      if (!Array.isArray(cities)) {
        cities = [];
      }
    }
  
    cities.push(query);
    localStorage.setItem('cities', JSON.stringify(cities));
}

function getSavedSearches () {
    var storedCities = localStorage.getItem('cities');
    if(storedCities !== null) {
        storedCities = JSON.parse(storedCities);
    } else {
        storedCities = [];
    }
    citiesSearched.innerHTML = '';

    storedCities.forEach(function(storedCities) {               // getting the saved items from local storage and turning them into buttons
        var savedCities = document.createElement('button');
        savedCities.classList.add('saved-cities');
        savedCities.textContent = storedCities;
        function reSearchCity (event) {
            event.preventDefault();
            searchValue = savedCities.textContent;
            searchApi(searchValue);
    }
    savedCities.addEventListener('click', reSearchCity);
    

    citiesSearched.appendChild(savedCities);
    });
}

function handleSearchForm (event) {
    event.preventDefault();

    searchInputValue = document.querySelector('#search-input').value;       
    if (!searchInputValue) {
        console.error("You need a search input value.");
        return;
    }
    
    searchApi(searchInputValue);
}

searchButtonEl.addEventListener('click', handleSearchForm);


getParamater();
getSavedSearches();