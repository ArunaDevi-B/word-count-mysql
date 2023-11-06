const express = require('express');
const routes = require('./Routes/route');
const bodyParser = require('body-parser');
const env = require('dotenv');
const cors = require('cors');

// configuring the env file
env.config();
const app = express();

// parsing the data from body using body-parser
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// To prevent the cross origin error, using cors
app.use(cors());

const port = process.env.port;
app.use(routes);

// Sample api for checking the server health
app.get('/', (req,res) => {
    console.log('server Health is good!!!');
    res.send('Server health is good');
});

app.listen(port, () => console.log(`server is running on port ${port}`));