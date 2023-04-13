document.addEventListener("DOMContentLoaded", () => {

    // Map
    var map = L.map('map').setView([41.902782, 12.496366], 11);
    L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
    
    // Markers
    getData().then(books => {
        books.forEach(book => {
            console.log(book);

            // Format date
            const date = new Date(book.data);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            
            const formattedDate = `${day}-${month}-${year}`

            // Add marker and popup
            const nome = '<p id="popup_name">' + capitalize(book.nome) + ' ' + capitalize(book.cognome) + '</p>';
            const email = '<p id="popup_email">' + book.email + '</p>';
            const indirizzo = '<p id="popup_address">' + capitalize(book.indirizzo) + '</p>';
            const data = '<p id="popup_date">' + formattedDate + '</p>';
            let popup = nome + email + indirizzo + data;

            L.marker([book.lat, book.lon]).addTo(map).bindPopup(popup)
        });
    });

});

/* Functions */
async function getData() {
    const response = await fetch('/data', {
        method: 'GET'
    });
    return response.json();
}

function capitalize(str) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
}
