let express = require('express');
let bodyparser = require('body-parser');
let pg = require('pg');
let cors = require('cors')({ origin: true });
const PORT = 3000;
let pgConfig = {
    port: 5432,
    host: 'localhost',
    database: 'postgres',
    user: 'brye',
    password: 'notinmydb'
};
let pool = pg.Pool(pgConfig);
let app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));


app.get('/api/getAllGames', (request, response) => {
    cors(request, response, () => {
        pool.connect((error, postgresDB, done) => {
            if (error) {
                console.error("I got an error: " + error);
                response.status(500).send({ error });
            } else {
                postgresDB.query(
                    'SELECT * FROM games',
                    (err, table) => {
                        done();
                        if (err) {
                            return response.status(400).send({ err });
                        } else {
                            return response.status(200).send(table.rows);
                        }
                    }
                )
            }
        });
    });
});



app.listen(PORT, () => {
    console.log("Listening on PORT:" + PORT);
    console.log("Connected to PostgreSQL PORT: " + pgConfig.port);
});