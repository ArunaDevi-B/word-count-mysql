const express = require('express');
const server = require('./Config/dbConfig');
const routes = require('./Routes/Route');
const bodyParser = require('body-parser');
const env = require('dotenv');

const app = express();
app.use(express.json());
console.log(process.env.port,'1');
app.use(bodyParser.urlencoded({extended: true}));
env.config();
const port = process.env.port;
console.log(port,'port');
// server.connecDB();
app.use(routes);

app.get('/', (req,res) => {
    console.log('server Health is good!!!');
    res.send('Server health is good');
});

app.listen(port, () => console.log(`server is running on port ${port}`));