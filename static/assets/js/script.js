document.addEventListener("DOMContentLoaded", () => {
    // Icons
    const typeToPlanet = {
        "1": "moon",
        "2": "sun",
        "3": "venus",
        "4": "jupiter",
        "5": "mars",
        "6": "saturn",
        "7": "mercury"
    };

    let planetToIcon = {}
    for(let i = 1; i <= 7; i++) {
        planetToIcon[i] = L.icon({
            iconUrl: `./assets/img/${typeToPlanet[i]}.png`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    // Map
    var map = L.map('map').setView([41.902782, 12.496366], 11);
    L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);

    // Create a Marker Cluster Group layer with automatic clustering
    const markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });
    
    // Create an array of coordinates for the Polyline
    let poly = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": []
    };

    // Markers
    getData().then(books => {
        books.forEach(book => {
            console.log(book);

            // Add coordinates to polyline
            poly[book.tipo].push([book.lat, book.lon]);

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
            const planet = planetToIcon[book.tipo];

            markers.addLayer(L.marker([book.lat, book.lon], { icon: planet }).bindPopup(popup));
        });
    }).then(() => {
        // Add Polylines to map
        for (let key in poly) {
            L.polyline(poly[key], { className: `my_polyline my_polyline${key} hidden` }).addTo(map);
        }
    });
    // Add markers to map
    map.addLayer(markers);

});

/* Functions */
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
}

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
}

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

/** Check if polyline is visible, if visible add class hidden and viceversa */
const openPoly = function (poly) {
    const classHidden = poly.classList.contains("hidden");
    if (classHidden) {
        poly.classList.remove("hidden");
    } else {
        poly.classList.add("hidden");
    }
};

/** Check if button is active, if not add active class and viceversa */
const activeBtn = function (btn) {
    const classActive = btn.classList.contains("active");
    if (classActive) {
        btn.classList.remove("active");
    } else {
        btn.classList.add("active");
    }
};

/* Modal */
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

/* Connecting the dots */
const planetBtns = [
    document.querySelector(".btn-moon"),
    document.querySelector(".btn-sun"),
    document.querySelector(".btn-venus"),
    document.querySelector(".btn-jupiter"),
    document.querySelector(".btn-mars"),
    document.querySelector(".btn-saturn"),
    document.querySelector(".btn-mercury")
]

for(let i = 0; i < planetBtns.length; i++) {
    planetBtns[i].addEventListener("click", () => {
        activeBtn(planetBtns[i]);
        const planetPoly = document.querySelector(`.my_polyline${i + 1}`);
        openPoly(planetPoly);
    });
};
