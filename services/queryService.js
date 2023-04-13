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
        const { nome, cognome, email, tipo, indirizzo } = form;
        const { lat, lon } = await getCoordinates(indirizzo);
        let query = `INSERT INTO books (tipo, nome, cognome, email, indirizzo, lat, lon) VALUES ('${tipo}', '${nome}', '${cognome}', '${email}', '${indirizzo}', ${lat}, ${lon})`;
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
        throw err;
    };
}

module.exports = {
    getBooks,
    newBook
};
