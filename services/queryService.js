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
        // Get Books
        const books = await getBooks();
        // Get most recent book id by type
        const lastBook = books.filter(book => book.tipo == form.tipo).slice(-1)[0].id;
        console.log(lastBook);

        // Get values from form
        const via = `${form.indirizzo}, ${form.citta}`
        const { nome, email, tipo, daChi } = form;
        const { lat, lon } = await getCoordinates(via);

        // Insert new book
        const queryVal = `('${tipo}', '${nome}', '${email}', '${via}', '${lat}', '${lon}', '${lastBook}', '${daChi}');`;
        let query = `INSERT INTO books (tipo, nome, email, indirizzo, lat, lon, id_precedente, da_chi) VALUES ` + queryVal;
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