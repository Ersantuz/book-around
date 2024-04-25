const pool = require('./connectionService');
const { getCoordinates } = require('./coordinatesService');

async function getBooks() {
    try {
        // query database
        const query = 'SELECT * FROM books';
        conn = await pool.getConnection();
        const rows = await conn.query(query);
        conn.end();
    
        return rows;
    
    } catch (err) {
        throw err;
    }
};

async function newBook(form) {
    try{
        // Get values from form
        const via = `${form.indirizzo}, ${form.citta}`
        const { nome, email, tipo, daChi } = form;
        const { lat, lon } = await getCoordinates(via);
        const date = new Date();

        // Insert new book
        const queryVal = `('${tipo}', "${nome}", "${email}", "${via}", '${lat}', '${lon}', "${daChi}", "${date}");`;
        let query = `INSERT INTO books (tipo, nome, email, indirizzo, lat, lon, da_chi, data) VALUES ` + queryVal;
        conn = await pool.getConnection();
        await conn.query(query)
                .then(result => {
                    conn.end(); // release the connection back to the pool
                })
                .catch(error => {
                    conn.end(); // release the connection back to the pool
                    throw error;
                });
    } catch (err) {
        console.log(err);
        throw "Errore nell'inserimento dei dati (probabilmente l'indirizzo non è valido)";
    };
}

module.exports = {
    getBooks,
    newBook
};
