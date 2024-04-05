// Define map variables
var map;
var zoomLevel = 6;
var mapCenter = [42.99287129051785, 12.671979715325687];
var isOpen = false;
var selectedPlanet = "all";

// Initialize the map when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    buildMap(zoomLevel, mapCenter, isOpen, selectedPlanet);
});

/* Icons */
const typeToPlanet = {
    "1": "moon",
    "2": "sun",
    "3": "venus",
    "4": "jupiter",
    "5": "mars",
    "6": "saturn",
    "7": "mercury"
};

// Create an icon for each type of planet
let planetToIcon = {}
for(let i = 1; i <= 7; i++) {
    planetToIcon[i] = L.icon({
        iconUrl: `./assets/img/${typeToPlanet[i]}.png`,
        iconSize: [20, 20],
        iconAnchor: [15, 15],
        className: `not-last ${typeToPlanet[i]}`
    });
};

let planetToLastIcon = {}
for(let i = 1; i <= 7; i++) {
    planetToLastIcon[i] = L.icon({
        iconUrl: `./assets/img/${typeToPlanet[i]}.png`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        className: `${typeToPlanet[i]}`
    });
};

/* Functions */

/** Build the map */
function buildMap(zoomLevel, mapCenter, isOpen, selectedPlanet) {
    // Remove map if already exists
    if (map != undefined) {
        map.remove();
    };
    // Map
    var layer = new  L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg');
    layer.options.minZoom = 3;
    layer.options.maxZoom = 15;
    map = L.map('map').setView(mapCenter, zoomLevel);

    map.addLayer(layer);

    // Create a Marker Cluster Group layer with automatic clustering
    const markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });
    
    // Create an array of coordinates for the Polyline
    let poly = {
        "moon": [],
        "sun": [],
        "venus": [],
        "jupiter": [],
        "mars": [],
        "saturn": [],
        "mercury": []
    };

    // Markers
    getData().then(books => {
        console.log(books);
        books.forEach(book => {
            // Add coordinates to polyline
            poly[typeToPlanet[book.tipo]].push([book.lat, book.lon]);

            // Format date
            const date = new Date(book.data);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            
            const formattedDate = `${day}-${month}-${year}`

            // Add marker and popup
            const nome = '<p id="popup_name">' + capitalize(book.nome) + '</p>';
            const daChi = '<p id="popup_from">' + '<span> ricevuto da: </span>' + book.da_chi + '</p>';
            const data = '<p id="popup_date">' + '<span> il: </span>'  + formattedDate + '</p>';
            const indirizzo = '<p id="popup_address">' + '<span> letto a: </span>'  + capitalize(book.indirizzo) + '</p>';
            let popup = nome + daChi + data + indirizzo;

            // find icon type
            // Check if it's the last book of the type on id
            // filter books by type and check if the id is the last one
            let planet;
            let isLast = (book.id == books.filter((b) => b.tipo === book.tipo).slice(-1)[0].id); 
            if (isLast) {
                planet = planetToLastIcon[book.tipo];
            } else {
                planet = planetToIcon[book.tipo];
            };
            // Add marker to cluster group
            if (isLast && !isOpen && selectedPlanet === "all") {
                markers.addLayer(L.marker([book.lat, book.lon], { icon: planet, className: `${typeToPlanet[book.tipo]}` }).bindPopup(popup));
            } else if (isOpen && selectedPlanet === "all") {
                markers.addLayer(L.marker([book.lat, book.lon], { icon: planet, className: `${typeToPlanet[book.tipo]}` }).bindPopup(popup));
            } else if (selectedPlanet === typeToPlanet[book.tipo]) {
                markers.addLayer(L.marker([book.lat, book.lon], { icon: planet, className: `${typeToPlanet[book.tipo]}` }).bindPopup(popup));
            };
    
        });
    }).then(() => {
        console.log(poly[`${selectedPlanet}`]);
        // Add Polylines to map
        if (selectedPlanet !== "all") {
            // Show selected planet polyline
            L.polyline(poly[`${selectedPlanet}`], { className: `my_polyline my_polyline${selectedPlanet}` }).addTo(map);
        };
    });
    // Add markers to map
    map.addLayer(markers);
};

/** Call API to get data from the database */
async function getData() {
    const response = await fetch('/data', {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        return data;
    }).catch((err) => {
        console.log(err);
    });

    return response;
};

/** Capitalize every word of a string */
function capitalize(str) {
    let words = str.split(" ");
    // Remove empty strings
    words = words.filter((word) => {
        return word !== "";
    });
    // Capitalize first letter of each word
    return words.map((word) => { 
                return word[0].toUpperCase() + word.substring(1); 
            }).join(" ");
};

/** Remove hidden class to modal */
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

/** Add hidden class to modal */
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

/** Check if button is active, if not add active class and viceversa */
const activeBtn = function (btn) {
    const classActive = btn.classList.contains("active");
    if (classActive) {
        btn.classList.remove("active");
    } else {
        for(let i = 0; i < planetBtns.length; i++) {
            planetBtns[i].classList.remove("active");
        }
        btn.classList.add("active");
    }
};

/** Active Planet */
const activePlanet = function (btn, select) {
    const classActive = btn.classList.contains("active");
    if (classActive) {
        // Show only markers of the button planet
        zoomLevel = map.getZoom();
        mapCenter = map.getCenter();
        selectedPlanet = select;
        buildMap(zoomLevel, mapCenter, isOpen, selectedPlanet);
    } else {
        // Show all markers
        zoomLevel = map.getZoom();
        mapCenter = map.getCenter();
        selectedPlanet = "all";
        buildMap(zoomLevel, mapCenter, isOpen, selectedPlanet);
    }
};

/** Open playlist **/
const openPlaylist = function (modal) {
    icons.classList.add("hidden");
    modal.classList.remove("hidden");
};

/** Close playlist **/
const closePlaylist = function (modal) {
    icons.classList.remove("hidden");
    modal.classList.add("hidden");
};

/** Open Planet Buttons */
const openPlanets = function() {
    document.querySelector(".planet-open").classList.remove("hidden");
    document.querySelector(".planet-close").classList.add("hidden");
    isOpen = true;
    selectedPlanet = "all";
    // refresh map
    zoomLevel = map.getZoom();
    mapCenter = map.getCenter();
    buildMap(zoomLevel, mapCenter, isOpen, selectedPlanet);
}

/** Close Planet Buttons */
const closePlanets = function() {
    for(let i = 0; i < planetBtns.length; i++) {
        if (planetBtns[i].classList.contains("active")) {
            activeBtn(planetBtns[i]);
            // Show only markers of the button planet
            activePlanet(planetBtns[i], typeToPlanet[i +1]);
        }
    };
    document.querySelector(".planet-open").classList.add("hidden");
    document.querySelector(".planet-close").classList.remove("hidden");
    isOpen = false;
    selectedPlanet = "all";
    // refresh map
    zoomLevel = map.getZoom();
    mapCenter = map.getCenter();
    buildMap(zoomLevel, mapCenter, isOpen, selectedPlanet);
}

/* Modal */
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

/* Playlist */
const icons = document.querySelector(".social");
const playlist = document.querySelector(".playlist-modal");
const audio = document.querySelector(".audio-modal");
const playlistBtn = document.querySelector("#spotify");
const audioBtn = document.querySelector("#audio");
const closePlaylistBtn = document.querySelector(".btn-close-playlist");
const closeAudioBtn = document.querySelector(".btn-close-audio");

playlistBtn.addEventListener("click", () => { openPlaylist(playlist) });
audioBtn.addEventListener("click", () => { openPlaylist(audio) });
closePlaylistBtn.addEventListener("click", () => { closePlaylist(playlist) });
closeAudioBtn.addEventListener("click", () => { closePlaylist(audio) });

/* Planet Buttons */
const planetOpenBtn = document.querySelector(".btn-boat");
const planetCloseBtn = document.querySelector(".btn-close-btn");

planetOpenBtn.addEventListener("click", openPlanets);
planetCloseBtn.addEventListener("click", closePlanets);

/* Connecting the dots */
const planetBtns = [
    document.querySelector(".btn-moon"),
    document.querySelector(".btn-sun"),
    document.querySelector(".btn-venus"),
    document.querySelector(".btn-jupiter"),
    document.querySelector(".btn-mars"),
    document.querySelector(".btn-saturn"),
    document.querySelector(".btn-mercury")
];

for(let i = 0; i < planetBtns.length; i++) {
    planetBtns[i].addEventListener("click", () => {
        activeBtn(planetBtns[i]);
        // Show only markers of the button planet
        activePlanet(planetBtns[i], typeToPlanet[i + 1]);
    });
};
