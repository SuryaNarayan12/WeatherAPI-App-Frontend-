document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const weatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");
  const humidity = document.getElementById("humidity");
  const errorMessage = document.getElementById("error-message");
  const loader = document.getElementById("loader");
  const forecastContainer = document.getElementById("forecast");
  const forecastCards = document.getElementById("forecast-cards");

  const API_KEY = "7bb92aed7fbf19c5c34b70ab3ecfacc3";
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  }

  weatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) return alert("Please enter a city name");
    localStorage.setItem("lastCity", city);
    getWeather(city);
  });

  async function getWeather(city) {
    loader.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
    forecastContainer.classList.add("hidden");
    errorMessage.classList.add("hidden");

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      if (!weatherRes.ok) throw new Error("City not found");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      displayWeather(weatherData);
      displayForecast(forecastData);

    } catch (error) {
      showError();
    } finally {
      loader.classList.add("hidden");
    }
  }

  function displayWeather(data) {
    const tempC = (data.main.temp - 273.15).toFixed(1);
    cityName.textContent = `📍 ${data.name}`;
    temperature.textContent = `🌡️ Temperature: ${tempC}°C`;
    description.textContent = `☁️ Condition: ${data.weather[0].description}`;
    humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  function displayForecast(data) {
    const daily = data.list.filter((_, index) => index % 8 === 0);
    forecastCards.innerHTML = "";

    daily.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString("en-GB", {
        weekday: "short",
      });
      const temp = (item.main.temp - 273.15).toFixed(1);
      const icon = item.weather[0].icon;

      const card = document.createElement("div");
      card.classList.add("forecast-card");
      card.innerHTML = `
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon" />
        <p>${temp}°C</p>
      `;
      forecastCards.appendChild(card);
    });

    forecastContainer.classList.remove("hidden");
  }

  function showError() {
    errorMessage.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
    forecastContainer.classList.add("hidden");
  }
});
