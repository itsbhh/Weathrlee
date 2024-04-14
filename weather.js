const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItems = document.getElementById('current-weather-items');
const weatherForecast = document.getElementById('weather-forecast');

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day].slice(0, 3) + ', ' + date + ' ' + months[month];
}, 1000); // Update time and date every second

let lastUpdatedDay = new Date().getDate(); // Initialize last updated day

setInterval(async () => {
    const time = new Date();
    const date = time.getDate();

    // Fetch weather data every 24 hours or if the day has changed
    if (date !== lastUpdatedDay) {
        lastUpdatedDay = date;
        const city = document.getElementById('searchInput').value.trim();
        if (isValidInput(city)) {
            const data = await fetchWeatherData(city);
            if (data) {
                showWeatherData(data, city);
            } else {
                alert('Failed to fetch weather data. Please try again.');
            }
        } else {
            alert('Invalid input! Please enter a valid city name.');
        }
    }
}, 1000 * 60 * 60); // Update every 1 hour (1000ms * 60s * 60m)

async function fetchWeatherData(city) {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=aa6573ee2305469eb4c193906241304&q=${city}&days=7`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch weather data:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function isValidInput(input) {
    return /^[A-Za-z\s]+$/.test(input);
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('searchInput').value.trim();
    if (isValidInput(city)) {
        const data = await fetchWeatherData(city);
        if (data) {
            showWeatherData(data, city);
        } else {
            alert('Failed to fetch weather data. Please try again.');
        }
    } else {
        alert('Invalid input! Please enter a valid city name.');
    }
});

function showWeatherData(data, cityName) {
    console.log('Weather data:', data);
    console.log('City name:', cityName);

    if (!data || !data.forecast) {
        console.error('Invalid or incomplete weather data:', data);
        return;
    }
    const { humidity, pressure_mb, wind_kph, temp_c } = data.current;

    document.getElementById('cityName').innerText = cityName;
    document.getElementById('current-weather-items').innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure_mb} mb</div>
        </div>
        <div class="weather-item">
            <div>Wind</div>
            <div>${wind_kph} kph</div>
        </div>
        <div class="weather-item">
            <div>Temp</div>
            <div>${temp_c}°C</div>
        </div>
    `;
    
    const forecastItems = data.forecast.forecastday.slice(0, 7); // Get forecast for the next 7 days

    let forecastHTML = ''; // Initialize forecastHTML
    
    for (let i = 0; i < forecastItems.length; i++) {
        const forecastDate = new Date(forecastItems[i].date);
        const forecastDay = days[forecastDate.getDay()]; // Get full day name
        const forecastMonth = months[forecastDate.getMonth()];
        const formattedDate = `${forecastDate.getDate()} ${forecastMonth}`;
    
        forecastHTML += `
            <div class="weather-forecast-item">
                <div class="mon">${formattedDate}</div>
                <div class="day">${forecastDay}</div>
                <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Clouds: ${forecastItems[i].day.condition.text}</div>
            </div>
        `;
    }
    
    weatherForecast.innerHTML = forecastHTML; // Update weather forecast
}    
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
    }
});
