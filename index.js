const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hj6gh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    async function run() {
        try{
            await client.connect();
            const productCollection = client.db("emaJohn").collection("products");

            app.get('/products', async (req,res)=> {
                const query = {};
                const page = parseInt (req.query.page);
                const size = parseInt (req.query.size);
                const cursor = productCollection.find(query);
                let result;
                if(page || size){
                    result = await cursor.skip(page * size).limit(size).toArray();
                    
                }
                else{
                    result = await cursor.toArray();
                    
                }
                res.send(result);
                
            })
            app.get('/productsCount', async (req,res)=> {
                // const query = {};
                // const cursor = productCollection.find(query);
                const totalProducts = await productCollection.estimatedDocumentCount() ;
                res.send({totalProducts});
            })

        }
        finally{

        }
    }
    run().catch(console.dir);
});


// dbJohn vMLhgR6QKDQbn0Ix

// GET 
app.get('/', (req, res) => {
    res.send("Ema-John is running");
})

// Listen to port 
app.listen(port, () =>{
    console.log("Listening to Port", port);
})

