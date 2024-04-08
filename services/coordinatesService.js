const axios = require('axios');

async function getCoordinates(address) {
    try{
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const response = await axios.get(url);
        const result = response.data[0];
        const { lat, lon } = result;
        return { lat, lon }; 
    } catch (error) {
        return { lat: 0, lon: 0 };
    }
};

module.exports = {
    getCoordinates
};
