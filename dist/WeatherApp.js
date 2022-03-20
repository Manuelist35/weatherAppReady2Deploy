const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTemperature = document.getElementById('current-temp');
// In this lines we are defining all the elements that we are gonna display dinamically by using JavaScript to fetch the data, and as yoiu can see we are using the method .getElementById




const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='ce56e661628a3a491f914283b7978839';
setInterval(() =>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour // in this line we are using the modulus or remainder in order to get the remainder of the hours past the 12 pm in order to display that infor for the user to see the hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = `${hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat :  hoursIn12HrFormat}:${minutes < 10? '0'+minutes: minutes} <span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`


}, 1000);

getWeatherData()
function getWeatherData (){ // Here we are defining this function which will allow us to acces to the Geolocation of our computer 
    navigator.geolocation.getCurrentPosition((success) =>{ // The Geolocation.getCurrentPosition() method is used to get the current position of the device, so in that way we can use that info for later get the data that we want of the city that we are in 
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{
            console.log(data)
            showWeatherDataDefault(data);
        })
    })
}

function showWeatherDataDefault (data){
    let {humidity, temp, feels_like, pressure, sunrise, sunset, wind_speed} = data.current;

    timeZone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
       <div>Temperature</div>
       <div>${temp}&#176; C</div>
    </div>
    <div class="weather-item">
       <div>Feels like</div>
       <div>${feels_like}&#176; C</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    `;

    let otherDayForecast = ''
    data.daily.forEach((day, idx)=>{
        if(idx == 0){
            currentTemperature.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div> 
            </div> 
            
            `
        }else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C </div>
                <div class="temp">Day - ${day.temp.day}&#176; C </div>   
            </div> 
            
            `
        }
     })


    weatherForecastEl.innerHTML = otherDayForecast;
}

const searchByCityName = () => {
    const city = document.getElementById('CityName').value;
    console.log(city);
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    
    if(city === ""){
        alert("Not results found, please try again")
    } else {
        fetch(URL).then(resp =>{
            const status = resp.status;
            console.log(status)
           if(status !== 200){
               alert(`Sorry, something went wrong, try again error:${status}`) // I added this line for to let to know the user why the app didn't give back any response in case the fetch falis
               console.log(`Ops! Something is wrong ${status}`)
           }
            resp.json().then(CityWeather => {
                console.log(CityWeather)
                let coord = CityWeather.coord;
                //console.log(coord)
                let lat = coord.lat;
                let long = coord.lon;
                //console.log(lat);
                //console.log(long);
                getWeatherByCityNameData()
                function getWeatherByCityNameData(){
                    let lati = lat;
                    let longi = long;
                    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lati}&lon=${longi}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(resp => resp.json()).then(datacity =>{
                        console.log(datacity)
                        showWeatherDataByName(datacity);
                    })
                }
            })
        })
    }
}

function showWeatherDataByName (datacity){
    let {humidity, temp, feels_like, pressure, sunrise, sunset, wind_speed} = datacity.current;

    timeZone.innerHTML = datacity.timezone;
    countryEl.innerHTML = datacity.lat + 'N ' + datacity.lon+'E'

    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Temperature</div>
        <div>${temp}&#176; C</div>
    </div>
    <div class="weather-item">
        <div>Feels like</div>
        <div>${feels_like}&#176; C</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    `;

    let otherDayForecast = ''
    datacity.daily.forEach((day, idx)=>{
        if(idx == 0){
            currentTemperature.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div> 
            </div> 
            
            `
        }else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C </div>
                <div class="temp">Day - ${day.temp.day}&#176; C </div>   
            </div> 
            
            `
        }
     })


    weatherForecastEl.innerHTML = otherDayForecast;
}




const button = document.getElementById('searchCity');
button.addEventListener('click',(e)=> {
    e.preventDefault();
    searchByCityName();
    showWeatherDataByName();

})