const axios = require('axios');

async function getCoordinates(address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await axios.get(url);
    const result = response.data[0];
    const { lat, lon } = result;
    return { lat, lon }; 
};

module.exports = {
    getCoordinates
};
