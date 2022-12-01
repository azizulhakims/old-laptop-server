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
        const oldLaptopCollectionCategory = client.db('oldlaptop').collection('oldLaptopCategory')
        const oldLaptopCollectionItems = client.db('oldlaptop').collection('oldLaptopItems')
        const oldLaptopAddProductCollection = client.db('oldlaptop').collection('addproduct');
        const oldLaptopProductBookCollection = client.db('oldlaptop').collection('productbook');

        //http://localhost:5000/productbook

        console.log("database connected..");

        //JWT
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const result = await oldLaptopCollection.findOne({ email });
            res.send(result);
        })
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

        app.get('/oldLaptopCategory', async (req, res) => {
            const query = {};
            const category = await oldLaptopCollectionCategory.find(query).toArray();
            res.send(category);
        })

        // app.get('/categoryTitle', async (req, res) => {
        //     const query = {}
        //     const result = await oldLaptopCollectionCategory.find(query).project({ name: 1 }).toArray();
        //     res.send(result);
        // })

        app.get('/addproduct', async (req, res) => {
            const query = {};
            const product = await oldLaptopAddProductCollection.find(query).toArray();
            res.send(product);

        })


        app.post('/addproduct', async (req, res) => {
            const doctor = req.body;
            const result = await oldLaptopAddProductCollection.insertOne(doctor);
            res.send(result);
        })

        app.delete('/addproduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await oldLaptopAddProductCollection.deleteOne(filter);
            res.send(result);

        })

        // app.get('/oldLaptopCategory/:id', (req, res) => {
        //     const id = req.params.id;
        //     const selectedCategory = oldLaptopCollectionCategory.find(c => c._id === id);
        //     res.send(selectedCategory);
        //     // console.log(req.params.id);
        // })



        app.post('/productbook', async (req, res) => {
            const productbook = req.body;
            const result = await oldLaptopProductBookCollection.insertOne(productbook);
            res.send(result);
        })








        //for user
        // app.get('/productbook', async (req, res) => {
        //     const { email } = req.query;

        //     const productbook = await oldLaptopProductBookCollection.find({ email }).toArray();
        //     res.send(productbook);

        // })

        //for admin

        app.get('/productbook', async (req, res) => {
            let query = {}
            const email = req.query.email

            if (email) {
                query = {
                    email: email,
                }
            }
            const productbook = await oldLaptopProductBookCollection.find(query).toArray()
            console.log(productbook);

            res.send(productbook);
        })


        app.get('/oldlaptopuser', async (req, res) => {

            const oldlaptopuser = await oldLaptopCollection.find({}).toArray()
            console.log(oldlaptopuser);

            res.send(oldlaptopuser);
        })


        // app.get('/addproduct', async (req, res) => {
        //     const query = {};
        //     const product = await oldLaptopAddProductCollection.find(query).toArray();
        //     res.send(product);




    }
    finally {

    }
}

run().catch(err => console.log(err));

app.get('/', async (req, res) => {
    res.send('Old Laptop portal server is running');
})

app.listen(port, () => console.log(`Old Laptop portal running ${port}`))