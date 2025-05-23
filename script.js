document.addEventListener("DOMContentLoaded", () => {
  const backgroundvideo = document.getElementById("bg-video");
  const inputcity = document.getElementById("input_city");
  const cityname = document.getElementById("city_name");
  const currentdate = document.getElementById("current_date");
  const currentday = document.getElementById("current_day");
  const displaytemp = document.getElementById("temp_txt");
  const displaydescription = document.getElementById("description_txt");
  const display_icons = document.getElementById("weather_summary_images");
  const humidityval = document.getElementById("humidity_value");
  const windval = document.getElementById("wind_value");
  const fellslikeval = document.getElementById("Fells_like_temp");

  //Search Button
  const locationbtn = document.getElementById("location_btn");
  const searchbtn = document.getElementById("search_btn");

  //Forecast
  const todayforecastContainer = document.querySelector(
    ".Today_Forecast_container"
  );
  const forecastcontainer = document.querySelector(".forecast_item_container");

  //Weather-info && Not Found Section $$ Search city Section....
  const weatherinfosection = document.getElementById("weather_info");
  const notfoundsection = document.getElementById("not_found_city_section");
  const searchcitysection = document.getElementById("search_city_section");

  //Api key....
  const apiKey = "58bcfad8cadac8b29241407b2f8fdd64";

  const week_day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //Function to get the weather icon....
  function get_weather_icon_forecast(id, time) {
    const hour = time.getHours();
    if (id <= 232) return "storm.png";
    else if (id <= 321 && hour > 5 && hour < 16) return "drizzle2.png";
    else if (id <= 321 && (hour < 5 || hour > 16)) return "drizzle-night.png";
    else if (id <= 531) return "rain.png";
    else if (id <= 622) return "snow.png";
    else if (id <= 781) return "mist.png";
    else if (id == 800 && hour > 5 && hour < 16) return "sun.png";
    else if (id == 800 && (hour < 5 || hour > 16)) return "moon.png";
    else if (id <= 804 && (hour < 5 || hour > 16)) return "cloudy-night.png";
    else if (id <= 804 && hour > 5 && hour < 16) return "cloudy.png";
  }

  //Function to get the weather background video....
  function get_weather_background(id, time) {
    const hour = time.getHours();
    if (id <= 232) return "Thunder_Storm.mp4";
    else if (id <= 321 && hour > 5 && hour < 16) return "Shower.mp4";
    else if (id <= 321 && (hour < 5 || hour > 16)) return "Shower.mp4";
    else if (id <= 531) return "Shower.mp4";
    else if (id <= 622) return "Snow_Fall.mp4";
    else if (id <= 781) return "Mist_Fog.mp4";
    else if (id == 800 && hour > 5 && hour < 16) return "Blue_Sky.mp4";
    else if (id == 800 && (hour < 5 || hour > 16)) return "Clear_Night.mp4";
    else if (id <= 804 && (hour < 5 || hour > 16)) return "Dark_Sky.mp4";
    else if (id <= 804 && hour > 5 && hour < 16) return "Broken_cloud.mp4";
  }

  //Event Listener for location button....
  locationbtn.addEventListener("click", async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lan = position.coords.longitude;
        try {
          const fetched_data = await fetch_weather_coords(lat, lan, "weather");
          Display_weather(fetched_data);
        } catch (error) {
          show_Display_Section(notfoundsection);
        }
      },
      (err) => {
        alert("Location permission denied...");
      }
    );
  });

  //Event Listener for search button....
  searchbtn.addEventListener("click", async () => {
    const city = inputcity.value.trim();
    if (city == "") return;

    try {
      inputcity.value = "";
      const fetched_data = await fetch_weather("weather", city);
      Display_weather(fetched_data);
    } catch (error) {
      show_Display_Section(notfoundsection);
    }
  });

  //Function to fetch the weather data....
  async function fetch_weather_coords(lat, lan, endpoint) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=${apiKey}&units=metric`;
    const ini_res = await fetch(url);
    if (!ini_res.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const response = await ini_res.json();
    return response;
  }

  async function fetch_weather(endpoint, city) {
    //Fetch weather...
    const url = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&units=metric&appid=${apiKey}`;
    const ini_res = await fetch(url);
    if (!ini_res.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const response = await ini_res.json();
    return response;
  }

  async function Display_weather(weatherdata) {
    const { main, name, weather, wind } = weatherdata; //name=string, weather=array;
    cityname.innerHTML = `${name}`;
    const date = new Date();
    currentdate.innerHTML = `${date.getDate()}, ${month[date.getMonth()]}`;
    currentday.innerHTML = `${week_day[date.getDay()]}`;
    displaytemp.innerHTML = `${Math.round(main.temp)} °C`;
    displaydescription.innerHTML = `${weather[0].description}`;
    display_icons.src = `./images/${get_weather_icon_forecast(
      weather[0].id,
      date
    )}`;
    humidityval.innerHTML = `${main.humidity} %`;
    windval.innerHTML = `${wind.speed} M/s`;
    fellslikeval.innerHTML = `${Math.round(main.feels_like)} °C`;
    backgroundvideo.src = `./Background_Videos/${get_weather_background(
      weather[0].id,
      date
    )}`;

    await update_forecast_info(name);
    show_Display_Section(weatherinfosection);
  }

  async function update_forecast_info(city) {
    //Fetching the data by calling the api...
    const forecastdata = await fetch_weather("forecast", city);

    const Timetaken = "12:00:00";
    const today_date = new Date().toISOString().split("T")[0];

    forecastcontainer.innerHTML = "";
    todayforecastContainer.innerHTML = "";

    forecastdata.list.slice(0, 9).forEach((forecastweather) => {
      update_Today_Forecast_Items(forecastweather);
    });

    forecastdata.list.forEach((forecastweather) => {
      if (
        forecastweather.dt_txt.includes(Timetaken) &&
        !forecastweather.dt_txt.includes(today_date)
      ) {
        update_Forecast_Items(forecastweather);
      }
    });
  }

  function update_Today_Forecast_Items(forecastdatails) {
    const { dt_txt: date, main, weather } = forecastdatails;

    const datetaken = new Date(date);
    const timeOption = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const timeResult = datetaken.toLocaleTimeString("en-US", timeOption);

    const todayforecastitem = `
       <div class="today_forecast_item">
       <h5 class="item_Time">${timeResult}</h5>
       <img src="./images/${get_weather_icon_forecast(
         weather[0].id,
         datetaken
       )}" alt="" class="today_icon"/>
       <h5 class="Today_temp">${Math.round(main.temp)} °C</h5>
       </div>
    `;
    todayforecastContainer.insertAdjacentHTML("beforeend", todayforecastitem);
  }

  function update_Forecast_Items(forecastdatails) {
    const { dt_txt: date, main, weather } = forecastdatails;

    const datetaken = new Date(date);
    const dateOption = {
      day: "2-digit",
      month: "short",
    };
    const dateResult = datetaken.toLocaleDateString("en-Us", dateOption);

    const forecastItem = `
      <div class="forecast_item">
      <h5 class="item_date">${dateResult}</h5>
      <img src="./images/${get_weather_icon_forecast(
        weather[0].id,
        datetaken
      )}" alt="weather_icon" class="item_weather_summary">
      <h5 class="item_temp"> ${Math.round(main.temp)} °C</h5>
      <h4 class="item_description">${weather[0].description}</h4>
      </div>
    `;

    forecastcontainer.insertAdjacentHTML("beforeend", forecastItem);
  }

  function show_Display_Section(Section) {
    // It hides all the sections....
    [weatherinfosection, notfoundsection, searchcitysection].forEach(
      (Section) => (Section.style.display = "none")
    ); //this section is only available inside the loop, dosen't conflict with outer section.
    // And Shows only the passed section by display=flex;
    Section.style.display = "flex";
  }
});
