const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRoutes');
const ListRoutes = require('../backend/Routes/ListRoutes')

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/filter', ProductRouter);
app.use('/lists', ListRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})