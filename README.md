# Introdução ao NodeJS

## Primeiro servidor

- `npm init`: deixar em branco os campos `test command`, `git repository` e `keywords`.
- limpar o conteúdo do objeto `scripts`
- alterar a licença para MIT

- o `package.json` é o arquivo que gerencia as dependências do projeto, que se dividem em devdependecies (desenvolvimento) e dependências normais (produção).

- criar `server.js`
~~~js
const http = require('http');

http
   .createServer((request, response) => {
      response.writeHead(200, {
         'Content-Type': 'application/json'
      });

      response.end(JSON.stringify({
         data: 'MEU PRIMEIRO SERVIDORR'
      }))
   })
   .listen(2006, () => console.log('Servidor rodando na porta 2006'))
~~~

- `node (diretório do arquivo)` + abrir o navegador em `localhost:2006` para ver o resultado.

- para manipular a resposta conforme as rotas, basta utilizar o atributo `request.url`.

~~~js
// abaixo do response.writeHead
if(request.url === '/produto'){
      response.end(JSON.stringify({
         message: 'Rota de produto'
      }))
   }

   else if(request.url === '/usuario'){
      response.end(JSON.stringify({
         message: 'Rota de usuario'
      }))
   }

   else {
      response.end(JSON.stringify({
         message: 'Rota padrão'
      }))
   }
~~~

## Express.js - Framework Node

- `npm install express`
- a pasta `node_modules` apareceu no projeto, juntamente ao arquivo `package-lock.json`.
- no arquivo `package.json`, surgiu um objeto contendo as dependências do projeto, até agora só contendo o express.

~~~js
//inicializando o express através da função
const express = require('express');
const app = express();
// aqui no meio vão os gets, posts, etc.
app.get('/primeira-rota', (request, response) => {
   response.json({
      message: 'Acessou a primeira rota'
   })
})
app.listen(2006, console.log('Server com Express ativo!'))
// faz o servidor rodar.
~~~

- Durante todo esse processo até agora, era necessário interromper o servidor e reiniciar a cada alteração. Porém, existem ferramentas que ajudam com isso, como o `nodemon.`

- Após dar o `npm install nodemon`, devemos ir no `package.json` e adicionar um script a ele: 
~~~json
...
"scripts": {
   //esta chave dev pode ser qualquer uma, dev foi so um exemplo.
    "dev": "nodemon (diretório do arquivo com o servidor)"
  }
...
~~~

- agora, para iniciar o servidor com o nodemon, basta ir no terminal e dar o comando `npm run dev` e o nodemon reinicializará o servidor por você!

- como não utilizarei banco de dados, criarei uma array `produtos`, acima de todas as rotas para ficar disponível em todas.

~~~js
const app = express();
const products = [];

// Rotas

app.listen(2006, console.log('Server com Express ativo!'))
~~~

## Métodos HTTP e formas de receber as informações do front
~~~js
/*
* POST => Inserir um dado
* GET => Buscar um/mais dados
* PUT => Alterar um dado
* DELETE => Remover um dado.
*/
/*
* Body => sempre que eu quiser enviar dados para a aplicação. (formato JSON)
* Params => /product/:id => o param faz parte da rota
* Query => /product?created_at=(data)&category=(categoria)
*/
/*
OBS: só é possível testar requisições GET no navegador, as demais necessitam de um programa externo, como o Insomnia.
*/
~~~

## Rota para adicionar um produto (POST)
- OBS: No insomnia, colocar um header `{"Content-Type": "application/json"}`
~~~js
const express = require('express');
const { randomUUID } = require('crypto')
// pacote nativo do node para gerar uuids

const app = express();

app.use(express.json())
// você diz pro express "vou usar o formato de dados JSON", pois ele pode trabalhar com outros formatos também.

const products = [];

app.post('/products', (request, response) => {
   const { name, price } = request.body;

   const product = {
      name,
      price,
      id: randomUUID()
   }

   products.push(product)
   
   response.json(product)
   //retorna no body da response o produto criado.
})

app.listen(2006, console.log('Server com Express ativo!'))
~~~

## Rota para listar todos os produtos (GET)
~~~js
app.get('/products', (request, response) => {
   response.json(products)
   // só isso, retorna a array products no body
})
~~~

## Rota para pegar um produto pelo ID (GET)
~~~js
app.get('/products/:id', (request, response) => {
   const product = products.find(product => product.id === request.params.id)
   // retorna o único elemento que satisfaz a condição.
   response.json(product)
})
~~~

## Rota para atualizar o produto (PUT)
~~~js
app.put('/products/:id', (request, response) => {
   const { id } = request.params
   const { name, price } = request.body

   const productIndex = products.findIndex(product => product.id === id)
   //retorna o index do produto que satisfaz a condição
   products[productIndex] = {
      ...products[productIndex],
      name,
      price
   }
   // vai copiar o produto original com spread e sobrescrever com os novos dados (name e price), mantendo o id original.

   response.json({
      message: "Produto alterado com sucesso"
   })
})
~~~

## Rota para deletar o produto (DELETE)
~~~js
app.delete('/products/:id', (request, response) => {
   const { id } = request.params

   const productIndex = products.findIndex(product => product.id === id)

   products.splice(productIndex, 1)
   // splice => primeiro parâmetro: index que vai ser trocado. segundo parâmetro : define quantos elementos serão deletados.

   response.json({
      message: "Produto removido com sucesso."
   })
})
~~~
- Após a API estar pronta, seria interessante armazenar tudo em um arquivo local, simulando um banco de dados. para isso pode-se usar o pacote `fs` do node.
~~~js
const databaseDir = './servidor_express/products.json'
...
const fs = require('fs')
...
const products = [];

fs.readFile(databaseDir, "utf-8", (err, data) => {
   if (err) {
      console.log(err)
   } else{
      products.push(...JSON.parse(data))
   }
})

// rotas => inserir a função updateProductFile em todos os métodos de edição.

function updateProductFile() {
   fs.writeFile(databaseDir, JSON.stringify(products), (err => {
      if (err) {
         console.log(err)
      } else {
         console.log('produto inserido')
      }
   }))
}
~~~