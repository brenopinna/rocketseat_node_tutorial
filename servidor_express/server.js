const express = require('express');
const { randomUUID } = require('crypto')
const fs = require('fs')
const databaseDir = './servidor_express/products.json'

const app = express();

app.use(express.json())

const products = [];

fs.readFile(databaseDir, "utf-8", (err, data) => {
   if (err) {
      console.log(err)
   } else{
      products.push(...JSON.parse(data))
   }
})

app.post('/products', (request, response) => {
   const { name, price } = request.body;

   const product = {
      name,
      price,
      id: randomUUID()
   }

   products.push(product)

   updateProductFile()
   
   response.json(product)
})

app.get('/products', (request, response) => {
   response.json(products)
})

app.get('/products/:id', (request, response) => {
   const product = products.find(product => product.id === request.params.id)
   response.json(product)
})

app.put('/products/:id', (request, response) => {
   const { id } = request.params
   const { name, price } = request.body

   const productIndex = products.findIndex(product => product.id === id)
   products[productIndex] = {
      ...products[productIndex],
      name,
      price
   }

   updateProductFile()

   response.json({
      message: "Produto alterado com sucesso"
   })
})

app.delete('/products/:id', (request, response) => {
   const { id } = request.params

   const productIndex = products.findIndex(product => product.id === id)

   products.splice(productIndex, 1)

   updateProductFile()

   response.json({
      message: "Produto removido com sucesso."
   })
})

function updateProductFile() {
   fs.writeFile(databaseDir, JSON.stringify(products), (err => {
      if (err) {
         console.log(err)
      } else {
         console.log('produto inserido')
      }
   }))
}

app.listen(2006, console.log('Server com Express ativo!'))