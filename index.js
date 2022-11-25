const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyop3ad.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        const oldLaptopCollection = client.db('oldlaptop').collection('oldlaptopuser')

        console.log("database connected..");

        //JWT
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,

            }
            const result = await oldLaptopCollection.updateOne(filter, updateDoc, options)
            console.log(result)

            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d',
            })
            console.log(token);
            res.send({ result, token })

        })

    }
    finally {

    }
}

run().catch(err => console.log(err));

app.get('/', async (req, res) => {
    res.send('Old Laptop portal server is running');
})

app.listen(port, () => console.log(`Old Laptop portal running ${port}`))