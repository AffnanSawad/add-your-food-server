// started
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000 ;

// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// dotEnv 
require('dotenv').config()


// middlewares
app.use(cors());
app.use(express.json());



// dataBase Copy Paste Link

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.5qhzsjb.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("my_food");
    const foodCollection = database.collection("food");


   
    // post
    app.post('/food', async(req,res)=>{

        const user = req.body;

        console.log('added user food',user);

        const result = await foodCollection.insertOne(user);

        res.send(result);


    } )

    // get
    app.get('/food', async(req,res)=>{

        const cursor = foodCollection.find();
        const result = await cursor.toArray();

        res.send(result);
    } )


    // delete
    app.delete('/food/:id', async(req,res)=>{

  const id = req.params.id;
  console.log('deleted',id);


  const query = { _id: new ObjectId(id) };

  const result = await foodCollection.deleteOne(query);

  res.send(result);


    }  )


    //  update => 1.get

    app.get('/food/:id', async(req,res)=>{

  const id = req.params.id;

  // console.log(id);


  const query = { _id: new ObjectId(id) };

  const result = await foodCollection.findOne(query);

  res.send(result);



    }  )


    // update => 2.put

    app.put('/food/:id',async(req,res)=>{

  const id = req.params.id;

  const user = req.body;

  console.log(id,user);

  const query = { _id: new ObjectId(id) };

  const options = { upsert: true };

  const updateDoc = {
    $set: {
    
  name:user.name,
  quantity:user.quantity,
  price:user.price,
  photo:user.photo



    },
  };


  const result = await foodCollection.updateOne(query, updateDoc, options);

  res.send(result);








    } )









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








// basic setup
app.get('/', (req,res)=>{

    res.send('Add Your Food Through CRUD');
} )

app.listen(port,()=>{

    console.log(`ADD YOUR FOOD BY CRUD OPERATION : ${port}`);

} )