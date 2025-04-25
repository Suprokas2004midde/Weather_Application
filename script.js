document.addEventListener('DOMContentLoaded',()=>{
    const inputcity = document.getElementById("input_city");
    const searchbtn = document.getElementById("search_btn");
    const cityname = document.getElementById("city_name");
    const currentdate = document.getElementById("current_date");
    const currentday = document.getElementById("current_day");
    const displaytemp = document.getElementById("temp_txt");
    const displaydescription = document.getElementById("description_txt");
    const display_icons = document.getElementById("weather_summary_images");
    const humidityval = document.getElementById("humidity_value");
    const windval = document.getElementById("wind_value");
    const fellslikeval = document.getElementById("Fells_like_temp");
    
    const apiKey = "58bcfad8cadac8b29241407b2f8fdd64";

    const week_day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const month=["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];

    function get_weather_icon(id){
      if(id<=232) return 'storm.png';
      if(id<=321) return 'drizzle2.png';
      if(id<=531) return 'rain.png';
      if(id<=622) return 'snow.png';
      if(id<=781) return 'mist.png';
      if(id==800) return 'sun.png';
      if(id<=804) return 'cloudy.png';

    }
    searchbtn.addEventListener("click", async () => {
      const city = inputcity.value.trim();
      if (city == "") return;

      try {
        inputcity.value = "";
        const fetched_data = await fetch_weather(city);
        Display_weather(fetched_data);
      } catch (error) {
        show_error();
      }
    });

    async function fetch_weather(city) {
      //Fetch weather...
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const ini_res = await fetch(url);
      if(!ini_res.ok) {
        throw new Error(`Response Status: ${response.status}`);
      };
      const response = await ini_res.json();
      return response;
    }
    
    function Display_weather(weatherdata){
        console.log(weatherdata);
        const{main,name,weather,wind}=weatherdata //name=string, weather=array;
        cityname.innerHTML=`${name}`;
        const date=new Date();
        currentdate.innerHTML=`${date.getDate()}, ${month[date.getMonth()]}`;
        currentday.innerHTML=`${week_day[date.getDay()]}`;
        displaytemp.innerHTML = `${Math.round(main.temp)} °C`;
        displaydescription.innerHTML = `${weather[0].description}`;
        display_icons.src = `./images/${get_weather_icon(weather[0].id)}`;
        humidityval.innerHTML=`${main.humidity} %`
        windval.innerHTML= `${wind.speed} M/s`
        fellslikeval.innerHTML = `${Math.round(main.feels_like)} °C`;
    }

    function show_error() {}
})