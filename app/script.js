// ================== CONFIG ==================
const API_KEY = "e150e7decda01b960bfbeee5e7b4290f";
const DEFAULT_CITY = "New York";

// ================== HELPERS ==================
function formatToday() {
  const now = new Date();
  const options = { weekday: "long", day: "numeric", month: "short" };
  return now.toLocaleDateString("en-US", options);
}

function toKmPerHour(ms) {
  return Math.round(ms * 3.6);
}

function formatVisibility(meters) {
  return (meters / 1000).toFixed(1) + " km";
}

function chooseIcon(main) {
  const key = main.toLowerCase();
  if (key.includes("thunder")) return "ri-thunderstorms-line";
  if (key.includes("drizzle") || key.includes("rain")) return "ri-rainy-line";
  if (key.includes("snow")) return "ri-snowy-line";
  if (key.includes("cloud")) return "ri-cloudy-2-line";
  if (key.includes("mist") || key.includes("fog") || key.includes("haze")) {
    return "ri-foggy-line";
  }
  return "ri-sun-line";
}

function detectLanguage(text) {
  if (!text) return "en";

  if (/[ऀ-ॿ]/.test(text)) return "hi";

  const lower = text.toLowerCase();

  const hinglishHints = [
    "kya",
    "ky",
    "hai",
    "haan",
    "nahi",
    "nhi",
    "matlab",
    "bahar",
    "andar",
    "thand",
    "garmi",
    "baarish",
    "barish",
    "kab",
    "kyu",
    "kyun",
    "abhi",
    "kal",
    "aaj",
    "aj",
    "kaisa",
    "kaisi",
    "kapde",
    "kapda",
    "jaana",
    "jana"
  ];

  let score = 0;
  hinglishHints.forEach((w) => {
    if (lower.includes(w)) score++;
  });

  if (score >= 1) return "hinglish";

  return "en";
}

function summaryText(lang, city, temp, main, humidity, windSpeed) {
  if (lang === "hi") {
    return `Abhi ${city} mein lagbhag ${Math.round(
      temp
    )}°C temperature hai, mausam ${main.toLowerCase()} jaisa hai, humidity kareeb ${humidity}% hai aur hawa lagbhag ${windSpeed} km/h ki chal rahi hai.`;
  }
  if (lang === "hinglish") {
    return `Abhi ${city} mein approx ${Math.round(
      temp
    )}°C temp hai, weather ${main.toLowerCase()} type ka hai, humidity around ${humidity}% hai aur hawa lagbhag ${windSpeed} km/h chal rahi hai.`;
  }
  return `Right now in ${city}, it is around ${Math.round(
    temp
  )}°C with ${main.toLowerCase()} conditions, humidity near ${humidity}%, and wind about ${windSpeed} km/h.`;
}

function tempBandAdvice(temp, lang) {
  const t = temp;
  if (lang === "hi") {
    if (t >= 34) {
      return "Bahut zyada garmi hai. Halki cotton t-shirt, shorts, cap, sunglasses aur paani zyada peena achha rahega. Tez dhoop mein zyada der mat ruko.";
    }
    if (t >= 28) {
      return "Garmi ka mausam hai. Simple cotton t-shirt aur halki, saans lene wali kapde thik rahenge.";
    }
    if (t >= 22) {
      return "Mausam kaafi comfortable hai. T-shirt theek hai, chaaho to ek halka shirt/hoodie saath rakh sakte ho.";
    }
    if (t >= 16) {
      return "Thodi thand si hai. T-shirt ke upar halki jacket ya hoodie pehen lo, especially raat mein.";
    }
    if (t >= 10) {
      return "Kaafi thand hai. Full sleeves ke saath garam jacket ya sweater pehenna better rahega.";
    }
    return "Bahut zyada thand hai. Multiple layers, garam jacket, gloves wagaira pehen kar hi bahar jaana safe rahega.";
  }

  if (lang === "hinglish") {
    if (t >= 34) {
      return "Kaafi zyada garmi hai. Light cotton t-shirt, shorts, cap, sunglasses aur paani handle me rakhna best rahega. Direct dhoop mein zyada time mat ruko.";
    }
    if (t >= 28) {
      return "Garmi hai but manageable. Normal t-shirt aur halki comfy jeans/lowers perfect rahenge.";
    }
    if (t >= 22) {
      return "Weather kaafi chill hai. T-shirt ok hai, chaaho to ek light jacket ya shirt carry kar lo.";
    }
    if (t >= 16) {
      return "Thodi thand wali vibes hain. T-shirt + light jacket/hoodie best combo rahega, especially raat ko.";
    }
    if (t >= 10) {
      return "Achhi khaasi thand hai. Full sleeves + sweater/jacket zaroor pehno.";
    }
    return "Bohot zyada thand hai. Sirf t-shirt mat pehno, proper jacket, sweater, gloves zaroori hai.";
  }

  if (t >= 34) {
    return "It is very hot. Light cotton t-shirts, shorts, a cap, sunglasses, and plenty of water are recommended. Avoid staying in direct sun for too long.";
  }
  if (t >= 28) {
    return "It is warm. A t-shirt and light, breathable clothing will be comfortable.";
  }
  if (t >= 22) {
    return "The weather is comfortable. A t-shirt is fine; you can carry a light hoodie or shirt if you get cold easily.";
  }
  if (t >= 16) {
    return "It is slightly cool. A t-shirt with a light jacket or hoodie would be better, especially at night.";
  }
  if (t >= 10) {
    return "It is cold. Long sleeves plus a warm jacket or sweater are recommended.";
  }
  return "It is very cold. Avoid going out in just a t-shirt; wear multiple warm layers and a proper jacket.";
}

function rainAdvice(pop, lang) {
  if (lang === "hi") {
    if (pop >= 70) {
      return "Barish ki probability bahut zyada hai. Chhata ya raincoat zaroor le kar niklo aur lambi outdoor planning se bachna better hoga.";
    }
    if (pop >= 40) {
      return "Barish hone ke chance theek-thaak hain. Bahar jaa sakte ho lekin umbrella ya jacket saath rakhna safe rahega.";
    }
    if (pop >= 15) {
      return "Halki barish ke chance hain. Zyada tension ki baat nahi, par kabhi-kabhi halka shower aa sakta hai.";
    }
    return "Barish ke chances kaafi kam hain, normal outdoor plans easily ho sakte hain.";
  }

  if (lang === "hinglish") {
    if (pop >= 70) {
      return "Rain chances kaafi high hain. Bahar jaoge to umbrella/raincoat pakka leke jao, long outdoor plans thoda risky hain.";
    }
    if (pop >= 40) {
      return "Decent chance hai barish ka. Bahar jana ok hai, bas ek chhata ya jacket rakh lo.";
    }
    if (pop >= 15) {
      return "Thodi si possibility hai halka sa rain ka. Mostly chill hai, bas ready rehna.";
    }
    return "Rain chances bohot kam hain, outdoor plans theek rahenge.";
  }

  if (pop >= 70) {
    return "There is a high chance of rain. Carry an umbrella or raincoat and avoid long outdoor plans if possible.";
  }
  if (pop >= 40) {
    return "There is a moderate chance of rain. You can go out, but keep an umbrella or jacket just in case.";
  }
  if (pop >= 15) {
    return "There is a small chance of light rain. Most plans are fine, but sudden showers are possible.";
  }
  return "Rain chances are low, outdoor plans should be safe.";
}

function outdoorQuality(main, windSpeed, lang) {
  const m = main.toLowerCase();

  if (lang === "hi") {
    if (m.includes("thunder")) {
      return "Aas-paas bijli ya thunderstorms ki situation hai, zaroorat na ho to bahar jaane se bachna better hai.";
    }
    if (m.includes("rain") || m.includes("drizzle")) {
      return "Barish ho rahi hai. Ja sakte ho, lekin sadke geeli hongi aur bheegne ka risk hai.";
    }
    if (m.includes("snow")) {
      return "Snow ho rahi hai. Kaafi thand aur phislan ho sakti hai, garam kapde aur savdhani zaroori hai.";
    }
    if (m.includes("fog") || m.includes("mist") || m.includes("haze")) {
      return "Fog/haze hai, visibility kam ho sakti hai. Agar gaadi chala rahe ho ya road par ho to dhyaan se chalo.";
    }
    if (windSpeed >= 35) {
      return "Kaafi tez hawa chal rahi hai. Bahar ja sakte ho, lekin open areas mein thoda sambhal kar.";
    }
    return "Overall mausam theek lag raha hai, normally bahar jaa sakte ho.";
  }

  if (lang === "hinglish") {
    if (m.includes("thunder")) {
      return "Around thunderstorms chal rahe hain, zaroori na ho to bahar mat niklo, safe side better.";
    }
    if (m.includes("rain") || m.includes("drizzle")) {
      return "Barish ho rahi hai. Bahar ja sakte ho but wet roads + bheegne ka scene rahega.";
    }
    if (m.includes("snow")) {
      return "Snow chal rahi hai. Kaafi thand + slippery ho sakta hai, warm clothes aur careful rehna.";
    }
    if (m.includes("fog") || m.includes("mist") || m.includes("haze")) {
      return "Fog/haze hai, visibility low ho sakti hai. Drive ya walk thoda carefully karo.";
    }
    if (windSpeed >= 35) {
      return "Bahut tez hawa hai. Outdoor possible hai but open jagah pe thoda sambhalna padega.";
    }
    return "Overall weather theek lag raha hai, normal outdoor plans ok hain.";
  }

  if (m.includes("thunder")) {
    return "There are thunderstorms around. It is safer to avoid going out unless necessary.";
  }
  if (m.includes("rain") || m.includes("drizzle")) {
    return "It is rainy. You can go out, but roads will be wet and you should carry rain protection.";
  }
  if (m.includes("snow")) {
    return "It is snowing. It can be cold and slippery, so dress warmly and be careful outside.";
  }
  if (m.includes("fog") || m.includes("mist") || m.includes("haze")) {
    return "It is foggy or hazy. Visibility may be low, so be careful if you are driving or near traffic.";
  }
  if (windSpeed >= 35) {
    return "It is quite windy. Outdoor plans are okay but be careful in open areas and with loose items.";
  }
  return "Overall, the weather looks okay for going out.";
}

// ================== DOM ELEMENTS ==================
const cityNameEl = document.getElementById("city-name");
const dateEl = document.getElementById("current-date");
const conditionEl = document.getElementById("current-condition");
const tempNowEl = document.getElementById("temp-now");
const tempMaxEl = document.getElementById("temp-max");
const tempMinEl = document.getElementById("temp-min");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const visibilityEl = document.getElementById("visibility");
const pressureEl = document.getElementById("pressure");
const hourlyListEl = document.getElementById("hourly-list");
const dailyListEl = document.getElementById("daily-list");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const getWeatherBtn = searchForm.querySelector(".primary-btn");
const weatherIconBig = document.querySelector(".weather-icon-big");

const aiMessages = document.getElementById("ai-messages");
const aiInput = document.getElementById("ai-input");
const aiSendBtn = document.getElementById("ai-send-btn");
const quickButtons = document.querySelectorAll(".quick-question");

let lastCurrentWeather = null;
let lastForecastData = null;

dateEl.textContent = formatToday();

async function fetchCurrentByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("API key invalid or not activated (401)");
    } else if (res.status === 404) {
      throw new Error("City not found");
    } else {
      throw new Error("Weather API error: " + res.status);
    }
  }

  return res.json();
}

async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("API key invalid for forecast (401)");
    } else {
      throw new Error("Forecast API error: " + res.status);
    }
  }

  return res.json();
}

async function loadWeatherForCity(city) {
  try {
    setLoading(true);

    const current = await fetchCurrentByCity(city);
    const { lat, lon } = current.coord;
    const forecast = await fetchForecast(lat, lon);

    lastCurrentWeather = current;
    lastForecastData = forecast;

    updateCurrentUI(current);
    renderHourly(forecast);
    renderDaily(forecast);

    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
    alert(err.message || "Failed to load weather.");
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    getWeatherBtn.disabled = true;
    getWeatherBtn.style.opacity = "0.7";
    getWeatherBtn.querySelector("span").textContent = "Loading...";
  } else {
    getWeatherBtn.disabled = false;
    getWeatherBtn.style.opacity = "1";
    getWeatherBtn.querySelector("span").textContent = "Get Weather";
  }
}

function updateCurrentUI(current) {
  const cityLabel = `${current.name}, ${current.sys.country}`;
  cityNameEl.textContent = cityLabel;

  const mainWeather = current.weather?.[0]?.main || "Clear";
  const description = current.weather?.[0]?.description || mainWeather || "Clear sky";

  conditionEl.textContent = description.charAt(0).toUpperCase() + description.slice(1);

  const iconClass = chooseIcon(mainWeather);
  weatherIconBig.className = "weather-icon-big " + iconClass;

  tempNowEl.textContent = Math.round(current.main.temp) + "°";
  tempMaxEl.textContent = Math.round(current.main.temp_max) + "°";
  tempMinEl.textContent = Math.round(current.main.temp_min) + "°";

  humidityEl.textContent = current.main.humidity + "%";
  windEl.textContent = toKmPerHour(current.wind.speed) + " km/h";
  visibilityEl.textContent = formatVisibility(current.visibility || 10000);
  pressureEl.textContent = current.main.pressure + " hPa";
}

function renderHourly(forecast) {
  const list = forecast.list || [];
  hourlyListEl.innerHTML = "";

  const count = Math.min(8, list.length);
  for (let i = 0; i < count; i++) {
    const item = list[i];
    const dt = new Date(item.dt * 1000);
    const isNow = i === 0;

    const timeLabel = isNow
      ? "Now"
      : dt.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });

    const main = item.weather?.[0]?.main || "Clear";
    const iconClass = chooseIcon(main);
    const temp = Math.round(item.main.temp) + "°";
    const rainChance = Math.round((item.pop || 0) * 100) + "%";

    const div = document.createElement("div");
    div.className = "hour";
    div.innerHTML = `
      <div class="hour-time">${timeLabel}</div>
      <i class="${iconClass}"></i>
      <p class="hour-temp">${temp}</p>
      <p class="hour-chance">${rainChance} rain</p>
    `;
    hourlyListEl.appendChild(div);
  }
}

function renderDaily(forecast) {
  const list = forecast.list || [];
  dailyListEl.innerHTML = "";

  const dayMap = {};
  list.forEach((item) => {
    const d = new Date(item.dt * 1000);
    const key = d.toISOString().slice(0, 10);

    if (!dayMap[key]) {
      dayMap[key] = {
        min: item.main.temp,
        max: item.main.temp,
        sample: item,
        date: d
      };
    } else {
      dayMap[key].min = Math.min(dayMap[key].min, item.main.temp);
      dayMap[key].max = Math.max(dayMap[key].max, item.main.temp);
    }
  });

  const dayKeys = Object.keys(dayMap).sort((a, b) => new Date(a) - new Date(b));

  const maxDays = 5;
  for (let i = 0; i < Math.min(maxDays, dayKeys.length); i++) {
    const key = dayKeys[i];
    const dayInfo = dayMap[key];
    const d = dayInfo.date;

    const label = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });

    const main = dayInfo.sample.weather?.[0]?.main || "Clear";
    const description = dayInfo.sample.weather?.[0]?.description || main || "Clear sky";
    const iconClass = chooseIcon(main);
    const max = Math.round(dayInfo.max) + "°";
    const min = Math.round(dayInfo.min) + "°";

    const row = document.createElement("div");
    row.className = "day-row";
    row.innerHTML = `
      <div class="day-label">
        <span>${label}</span>
        <i class="${iconClass}"></i>
        <span class="day-extra">${description.charAt(0).toUpperCase() + description.slice(1)}</span>
      </div>
      <div class="day-temp-range">${max} / ${min}</div>
    `;
    dailyListEl.appendChild(row);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = cityInput.value.trim();
  if (!value) return;
  loadWeatherForCity(value);
});

function addAiMessage(role, text) {
  const div = document.createElement("div");
  div.className = "ai-message " + (role === "user" ? "ai-message-user" : "ai-message-bot");
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function generateSmartReply(questionRaw) {
  const lang = detectLanguage(questionRaw);

  if (!lastCurrentWeather || !lastForecastData) {
    if (lang === "hi") {
      return "Pehle main latest weather data load kar loon. Kripya city select karke ek baar phir try karein.";
    }
    if (lang === "hinglish") {
      return "Pehle mujhe latest weather data load karne do. City select karke thodi der baad dubara puchho.";
    }
    return "Let me load the latest weather data first. Please select a city and then ask again.";
  }

  const temp = lastCurrentWeather.main?.temp ?? 25;
  const main = lastCurrentWeather.weather?.[0]?.main || "Clear";
  const humidity = lastCurrentWeather.main?.humidity ?? 50;
  const windSpeed = toKmPerHour(lastCurrentWeather.wind?.speed ?? 0);
  const city = lastCurrentWeather.name || "your city";

  const firstForecast = lastForecastData.list?.[0];
  const pop = firstForecast ? (firstForecast.pop || 0) * 100 : 0;

  const q = questionRaw.toLowerCase();

  const wantsOutfit =
    q.includes("wear") ||
    q.includes("outfit") ||
    q.includes("kapde") ||
    q.includes("t shirt") ||
    q.includes("tshirt") ||
    q.includes("sweater") ||
    q.includes("jacket") ||
    q.includes("kapda");
  const wantsOutdoor =
    q.includes("go out") ||
    q.includes("outside") ||
    q.includes("bahar") ||
    q.includes("walk") ||
    q.includes("run") ||
    q.includes("outing") ||
    q.includes("plans") ||
    q.includes("bahar jana") ||
    q.includes("bahar ja");
  const wantsSummary =
    q.includes("summary") || q.includes("explain") || q.includes("weather") || q.includes("mausam") || (!wantsOutfit && !wantsOutdoor);

  let parts = [];

  if (wantsSummary) {
    parts.push(summaryText(lang, city, temp, main, humidity, windSpeed));
  }

  if (wantsOutfit) {
    parts.push(tempBandAdvice(temp, lang));
  }

  if (wantsOutdoor) {
    parts.push(outdoorQuality(main, windSpeed, lang));
    parts.push(rainAdvice(pop, lang));
  }

  return parts.join(" ");
}

function handleUserQuestion(text) {
  if (!text) return;
  addAiMessage("user", text);
  const reply = generateSmartReply(text);
  setTimeout(() => {
    addAiMessage("bot", reply);
  }, 200);
}

aiSendBtn.addEventListener("click", () => {
  const text = aiInput.value.trim();
  if (!text) return;
  aiInput.value = "";
  handleUserQuestion(text);
});

aiInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    aiSendBtn.click();
  }
});

quickButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.textContent.trim();
    let prompt = "";
    if (label.toLowerCase().includes("outfit")) {
      prompt = "What should I wear today based on the current weather?";
    } else if (label.toLowerCase().includes("outdoor")) {
      prompt = "Is it a good time for outdoor plans like a walk or a run?";
    } else {
      prompt = "Give me a short summary of today's weather.";
    }
    handleUserQuestion(prompt);
  });
});

function loadWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  const locationBtn = document.getElementById("location-btn");
  const locationBtnText = document.getElementById("location-btn-text");

  locationBtn.disabled = true;
  locationBtnText.textContent = "Finding location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(geoUrl)
        .then((res) => res.json())
        .then((data) => {
          const city = data.address?.city || data.address?.town || data.address?.village || "Unknown";
          loadWeatherForCity(city);
          locationBtnText.textContent = "Use my location";
          locationBtn.disabled = false;
        })
        .catch((err) => {
          console.error("Reverse geocode failed:", err);
          alert("Could not determine city from coordinates");
          locationBtnText.textContent = "Use my location";
          locationBtn.disabled = false;
        });
    },
    (error) => {
      console.error("Geolocation error:", error.message);
      let msg = "Could not access your location.";
      if (error.code === error.PERMISSION_DENIED) {
        msg = "Location permission denied. Please allow in browser settings.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        msg = "Location information is unavailable.";
      } else if (error.code === error.TIMEOUT) {
        msg = "Location request timed out.";
      }
      alert(msg);
      locationBtnText.textContent = "Use my location";
      locationBtn.disabled = false;
    }
  );
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js").catch((err) => {
    console.error("Service worker registration failed:", err);
  });
}

const locationBtn = document.getElementById("location-btn");
if (locationBtn) {
  locationBtn.addEventListener("click", loadWeatherByLocation);
}

function setupInstallPrompt() {
  const PROMPT_DISMISSED_KEY = "skysenseInstallDismissed";
  const VISIT_COUNT_KEY = "skysenseVisitCount";
  const INSTALL_ACCEPTED_KEY = "skysenseInstalled";
  let deferredPrompt = null;

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    localStorage.setItem(INSTALL_ACCEPTED_KEY, "1");
    return;
  }

  const previousVisits = Number(localStorage.getItem(VISIT_COUNT_KEY) || "0");
  const visitCount = previousVisits + 1;
  localStorage.setItem(VISIT_COUNT_KEY, String(visitCount));

  const alreadyInstalled = localStorage.getItem(INSTALL_ACCEPTED_KEY) === "1";
  const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === "1";
  if (alreadyInstalled || dismissed || visitCount < 2) {
    return;
  }

  const banner = document.createElement("section");
  banner.className = "install-tab";
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML = `
    <div class="install-tab-content">
      <p class="install-tab-title">Install SkySense</p>
      <p class="install-tab-text">Add this app to your home screen for one-tap access.</p>
    </div>
    <div class="install-tab-actions">
      <button type="button" class="install-btn install-btn-primary" id="install-now-btn">Add</button>
      <button type="button" class="install-btn install-btn-secondary" id="install-close-btn" aria-label="Close install prompt">Later</button>
    </div>
  `;

  document.body.appendChild(banner);

  const installNowBtn = document.getElementById("install-now-btn");
  const closeBtn = document.getElementById("install-close-btn");

  const closeBanner = (permanentDismiss) => {
    if (permanentDismiss) {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "1");
    }
    banner.classList.add("install-tab-hidden");
    setTimeout(() => banner.remove(), 280);
  };

  closeBtn?.addEventListener("click", () => closeBanner(true));

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    banner.classList.add("install-tab-ready");
  });

  window.addEventListener("appinstalled", () => {
    localStorage.setItem(INSTALL_ACCEPTED_KEY, "1");
    localStorage.removeItem(PROMPT_DISMISSED_KEY);
    closeBanner(false);
  });

  installNowBtn?.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        localStorage.setItem(INSTALL_ACCEPTED_KEY, "1");
        closeBanner(false);
      }
      deferredPrompt = null;
      return;
    }

    alert(
      "To install: open your browser menu and choose 'Add to Home Screen' (or 'Install App')."
    );
    closeBanner(true);
  });
}

setupInstallPrompt();

loadWeatherForCity(DEFAULT_CITY);
