#!/usr/bin/env node
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const city = process.argv.slice(2).join(" ");

if (!city) {
  console.log("Please enter a city");
  process.exit(1);
}

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

async function getweather(retries = 2) {
    process.stdout.write("️Fetching weather details")
    const loading=setInterval(() => {
       process.stdout.write(".") 
    }, 500);
  try {
    const res = await fetch(url);

    const data = await res.json();

    clearInterval(loading);
    console.log("\n")

    if (data.cod != 200) {
      console.log("City not found.");
      return;
    }

    console.log("Weather in", data.name);
    console.log("---------------");
    console.log("Condition :", data.weather[0].main);
    console.log("Temperature :", data.main.temp);
    console.log("Feels Like :", data.main.feels_like);
    console.log("Minimum Temp", data.main.temp_min);
    console.log("Maximum Temp", data.main.temp_max);
  } catch (error) {
    clearInterval(loading)

    if (retries > 0) {
    
      console.log("Retrying....remaining:", retries);
     return getweather(retries - 1);
    }
    console.log("Failed After Retrying.\n");
    console.log(error);
  }
}

getweather();
