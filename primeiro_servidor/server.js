const http = require('http');

http.createServer((request, response) => {
   response.writeHead(200, {'Content-Type': 'application/json'});
   
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
}).listen(2006, () => console.log('Servidor rodando na porta 2006'))