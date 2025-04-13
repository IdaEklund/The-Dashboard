
//När webbsidan laddas körs checkSaves-funktionen.
window.onload = checkSaves();

//Funktionen kollar om något sparades i localStorage förra sessionen.
function checkSaves(){
    //Om en sparad titel finns i userEdits så skrivs titeln ut på samma ställe igen.
    let savedTitle = localStorage.getItem('userEdits');
    if (savedTitle){
        document.getElementById("title").innerHTML = savedTitle;
    }

    //Samma sak gäller anteckningar.
    let notes = localStorage.getItem('userEdits2');
    if (notes){
        document.getElementById("notes").value = notes;
    }

    //Om länkar finns sparade så skapas dom på samma plats.
    let savedUrls = localStorage.getItem('userEdits3');
    if (savedUrls){
        let linksList = document.getElementById("links-list");
        linksList.innerHTML = savedUrls;
        //Deleteknappar läggs till på länkarna.
        addDeleteButtons();
    }
}

//Eftersom länk-listan har skapats från JavaScript behövs deletknapparna också återskapas
//och kopplas till dom sparade länkarna.
function addDeleteButtons(){
    const linksList = document.getElementById("links-list");
    const deleteButtons = linksList.querySelectorAll("button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            button.parentElement.remove();
            localStorage.setItem("userEdits3", linksList.innerHTML);
        });
    });
}

//Funktion för att spara rubriken som editerats.
function saveHeader(){
    let header = document.getElementById("title");
    let editedHeader = header.innerHTML;
    localStorage.userEdits = editedHeader;
}

//Om rubriken ändras så sparas den.
document.getElementById("title").addEventListener("input", saveHeader);

//Funktion för att spara anteckningar.
function saveNotes(){
    let editedNotes = document.getElementById("notes");
    let savedNotes = editedNotes.value;
    localStorage.setItem("userEdits2", savedNotes);
}

//Om anteckningar läggs till eller ändras så sparas det.
document.getElementById("notes").addEventListener("input", saveNotes);


//Datum och tid läggs till i html-taggarna.
const currentDate = document.getElementById("date");
const time = document.getElementById("time");

//Datumet formateras så att det visas som datum (siffror), månad (ord) och år (siffror).
const date = new Date();
const dateFormatted = date.toLocaleString('default', {day: 'numeric', month: 'long', year: 'numeric'});
currentDate.textContent = dateFormatted;

//Tiden uppdateras hela tiden med hjälp av den här funktionen.
function updateTime(){
    const now = new Date();
    let currentTime = now.toLocaleTimeString('default', {hour: 'numeric', minute: 'numeric'});
    time.textContent = currentTime;
}

//Funktionen körs.
updateTime();

//Tiden uppdateras varje sekund.
setInterval(updateTime, 1000);



//När man trycker på "Lägg till länk"-knappen körs funktionen = "add-link-popup"-divven blir synlig.
function openPopup(){
    document.getElementById("add-link-popup").style.display = "flex";
}
//När man trycker på "Avbryt"-knappen stängs popupen ner och "add-link-popup"-divven blir osynlig.
function closePopup(){
    document.getElementById("add-link-popup").style.display = "none";
}

//När man tycker på "Lägg till"-knappen så körs denna funktion.
function addLink(){
    //Det som användaren skriver in sparas.
    let nameInput = document.getElementById("name-input");
    let urlInput = document.getElementById("url-input");
        
    const name = nameInput.value;
    const url = urlInput.value;

    //Om nåt av fälten är tomma så läggs inte nån länk till. Användaren uppmanas att fylla i båda fälten.
    function emptyInput(){
        if (nameInput.value === "" || urlInput.value === ""){
        alert("Fyll i båda fälten för att spara en länk!")
        linksList.removeChild(newLinkContainer);
    } }
    
    //Funktionen körs.
    emptyInput();


    //links-list från HTML:en hämtas eftersom länkarna ska läggas till där.
    const linksList = document.getElementById("links-list");

    //En länkcontainer skapas.
    const newLinkContainer = document.createElement("div");

    //Länkcontainern läggs till i links-list.
    linksList.appendChild(newLinkContainer);

    //Containern styleas.
    newLinkContainer.style.width = "10em";
    newLinkContainer.style.height = "2.5em";
    newLinkContainer.style.backgroundColor = "white";
    newLinkContainer.style.color ="black";
    newLinkContainer.style.borderRadius = "0.5em";
    newLinkContainer.style.marginBottom = "0.3em";
    newLinkContainer.style.display = "flex";
    newLinkContainer.style.alignItems = "center";
    newLinkContainer.style.justifyContent = "space-between";
    newLinkContainer.style.padding = "0.5em";


    //En länk skapas och styleas.
    const linkTitle = document.createElement("a");
    linkTitle.href = url;
    linkTitle.target = "_blank";
    linkTitle.textContent = name;
    linkTitle.style.textDecoration = "none";
    linkTitle.style.color = "black";

    //Länken läggs till i länkcontainern.
    newLinkContainer.appendChild(linkTitle);

    //En delete-knapp skapas och styleas.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.style.width = "1em";
    deleteButton.style.height = "1em";
    deleteButton.style.display = "flex";
    deleteButton.style.justifyContent = "center";
    deleteButton.style.alignItems = "center";
    deleteButton.style.justifySelf = "right";
    deleteButton.style.borderRadius = "1em";
    deleteButton.style.margintop = "0.8em";
    deleteButton.style.color = "black";
    deleteButton.style.border = "1px solid grey";
    deleteButton.style.alignSelf = "flex-start";

    //När man klickar på knappen så tas länken bort. Den nya länklistan sparas i localStorage.
    deleteButton.onclick = function () {
    linksList.removeChild(newLinkContainer);
    localStorage.setItem("userEdits3", linksList.innerHTML); 
    };


    //Knappen läggs till i länkcontainern.
    newLinkContainer.appendChild(deleteButton);

    //Länken sparas till localStorage.
    localStorage.setItem("userEdits3", linksList.innerHTML);

    //Inputfälten rensas så att dom är tomma nästa gång popupen visas. 
    nameInput.value = "";
    urlInput.value = "";
    //Popup-rutan stängs.
    closePopup();
}


//En asynkron funktion hämtar data från två olika API:er.
async function fetchData(){
    //Men först körs en funktion som hämtar användarens longitud och latitud.
    function getLocationPromise() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    try {
        //Platsdatan väntas in.
        const position = await getLocationPromise();

        //Platsdatan avrundas till 2 decimaler för att jag tror att länken bara tar 2 decimaler.
        let currentLatitude = position.coords.latitude.toFixed(2);
        let currentLongitude = position.coords.longitude.toFixed(2);
        console.log(currentLatitude, currentLongitude);

        //Användarens longitude och latitude läggs till i länken så att väderdatan visar väder från användarens plats.
        let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLatitude}&longitude=${currentLongitude}&daily=weather_code,temperature_2m_max&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code&timezone=Europe%2FBerlin`;
        
        //Väder- och eventdata väntas in.
        const [weatherData, eventData] = await Promise.all([
            //Väderdatan hämtas och konverteras till Json.
            fetch(apiUrl).then(res => res.json()),
            //Eventdata från konserter i Stockholm anordnade av Ticketmaster hämtas och konverteras till Json.
            fetch("https://app.ticketmaster.com/discovery/v2/events?apikey=RaCHg3GxkbyHNQO2aeYSbBJTsioBCeEr&locale=*&startDateTime=2025-04-14T16:50:00Z&city=stockholm&segmentName=music").then(res => res.json())
        ]);

        //Datan skrivs ut i konsolen.
        console.log("Väderdata:", weatherData);
        console.log("Eventdata:", eventData);

        //Funktioner för att logga ut datan på sidan körs.
        logoutWeatherdata(weatherData); 
        logoutEventsdata(eventData);

    //Om något i funktionen gått fel får man ett error-meddelande.
    }catch (err) {
        console.error("Något gick fel:", err);
    }
}

//Funktionen körs.
fetchData();

//Funktion för att skriva ut väder på webbsidan.
function logoutWeatherdata(data){

        //Väderkoder som följer med i väderdatan får emojis som symboler.
        const weatherCodes = {
        0: '☀️',
        1: '🌤️',
        2: '🌤️',
        3: '🌤️',
        45: '☁️',
        48: '☁️',
        51: "🌨️",
        53: "🌨️",
        55: "🌨️",
        56: "🌨️",
        57: "🌨️",
        61: "🌧️",
        63: "🌧️",
        65: "🌧️",
        66: "🌧️",
        67: "🌧️",
    };

    //Funktion som returnerar en vädersymbol. Om det inte finns en vädersymbol för aktuell väderkod returneras ett frågetecken.
    function convertWeathercodes(code) {
        const weatherSymbol = weatherCodes[code] || "❓";
        return weatherSymbol;
    }

    //Väderkoden från väder-API:t tilldelas en variabel.
    const weatherCode = data.current.weather_code; 
        
    //Det nuvarande vädret från API:n skrivs ut på webbsidan, med en vädersymbol och temperaturen.
    let temperature1 = document.getElementById("temp1");
    temperature1.textContent = convertWeathercodes(weatherCode) + data.current.temperature_2m + "°C";

    //Datumen för dom 3 följande dagarna läggs till i varsin vädercontainer. 
    //Vädersymbol och maxtemperatur för dom datumen läggs också till.
    let weatherDate1 = document.getElementById("weather-date1");
    weatherDate1.textContent = data.daily.time[1];
    let temperature2 = document.getElementById("temp2");
    temperature2.textContent = "Max-temp: " + convertWeathercodes(weatherCode) + data.daily.temperature_2m_max[1] + "°C";

    let weatherDate2 = document.getElementById("weather-date2");
    weatherDate2.textContent = data.daily.time[2];
    let temperature3 = document.getElementById("temp3");
    temperature3.textContent = "Max-temp: " + convertWeathercodes(weatherCode) + data.daily.temperature_2m_max[2] + "°C";

    let weatherDate3 = document.getElementById("weather-date3");
    weatherDate3.textContent = data.daily.time[3];
    let temperature4 = document.getElementById("temp4");
    temperature4.textContent = "Max-temp: " + convertWeathercodes(weatherCode) + data.daily.temperature_2m_max[3] + "°C";
}

//Funktion för att logga ut kommande konserter i Stockholm på webbsidan.
function logoutEventsdata(data){
    //Konserternas namn och datum väljs från APi:t och skrivs ut på webbsidan.
    //Varje konsert får en egen "ruta" i box3.
    let date1 = document.getElementById("date1");
    date1.textContent = data._embedded.events[0].dates.start.localDate;
    let event1 = document.getElementById("concert1");
    event1.textContent = data._embedded.events[0].name;

    let date2 = document.getElementById("date2");
    date2.textContent = data._embedded.events[1].dates.start.localDate;
    let event2 = document.getElementById("concert2");
    event2.textContent = data._embedded.events[1].name;

    let date3 = document.getElementById("date3");
    date3.textContent = data._embedded.events[2].dates.start.localDate;
    let event3 = document.getElementById("concert3");
    event3.textContent = data._embedded.events[2].name;

    let date4 = document.getElementById("date4");
    date4.textContent = data._embedded.events[3].dates.start.localDate;
    let event4 = document.getElementById("concert4");
    event4.textContent = data._embedded.events[3].name;
}