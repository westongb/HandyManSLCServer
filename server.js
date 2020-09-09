// const Vue = require('vue')
const express = require ("express");
const {Pool, Client} = require('pg')
const app = express();
const cors = require("cors");
const bodyParser = require("body-Parser");

const path = require('path');
const pool = new Pool();

const environment = process.env.NODE_ENV || "development";


require('dotenv').config("./process.env")
const client = new Client({
    user: "postgres",
    password: "Abc123890",
    port: 5432,
    database: "services"

}) 


const port = process.env.PORT || 5000;

app.set(port)


var serviceList = require('./Service_list.json');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

client.connect().then(() => console.log('connected'))
.then(()=> client.query("select * from brett_services"))
.then(results => console.table(results.rows))
.catch(err => console.error('connection error', err.stack))
.finally(()=> client.end)


app.use(express.json());
app.use(cors());
app.use(bodyParser());

// app.use(serveStatic());
// app.use(/./, (req, res) => express.static(path.join(__dirname, './public/index.html')));






var config = {
    user: "postgres",
    password: "Abc123890",
    port: 5432,
    database: "services"
}


app.get("/api/services", async (req, res) => {
    const rows = await readServices();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})


app.get("/api/Servicelist", (req, res) => {
        // console.log(serviceList)
        
        res.send(JSON.stringify(serviceList))
})
 


app.post("/api/postservices", async (req, res) => {
    console.log(req.body);
    try{
        
        const service_type = req.body.serviceType
        const service_name = req.body.serviceName;
        const job_time = req.body.job_time;
        const price = req.body.price;
        const service_description = req.body.description;
        const service_img = req.body.img;
        // const data = JSON.stringify([service_name, job_time, price])
        const newService = await client.query(
            'INSERT INTO brett_services ( service_name, job_time, price, service_description, service_img, service_type) VALUES ($1, $2, $3, $4, $5, $6)' , 
            [ service_name, job_time, price, service_description, service_img, service_type]);
       await res.json(newService)
    } catch (err){
        console.log(err.message)
    }
})


async function readServices() {
    try {
    const results = await client.query("select * from brett_services");
    console.log(results.rows)
    return results.rows;
    }
    catch(e){
        return "this didn't work" + e;
    }
}

console.log(environment)

// if(process.env.NODE_ENV === 'production') {
//   //Static folder
//   app.use(express.static('/public'))

  

// }



app.listen(port, () => console.log(`Listening on port ${port}`));