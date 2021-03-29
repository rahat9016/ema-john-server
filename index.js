const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser') 
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qxrx9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000

const app = express()
app.use(bodyParser.json())
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohn").collection("products");
  const ordersCollection = client.db("emaJohn").collection("orders");
  app.post('/addProduct',(req,res)=>{
    const product = req.body
    console.log(product)
    productsCollection.insertOne(product)
    .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
    .catch(err =>{
      console.log(err)
    })
  })
  app.get('/products',(req,res)=>{
    productsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.get('/product/:key',(req,res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })
  app.post('/productsBykeys',(req,res)=>{
    const productKeys = req.body
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
  app.post('/addOrder',(req,res)=>{
    const order = req.body
    ordersCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
    .catch(err =>{
      console.log(err)
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)