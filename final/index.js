const fs = require('fs');
const http = require('http');
const url = require('url')
const replaceTemplate=require('./modules/replaceTemplate')
///////////////////////////////////////
//  FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./final/txt/input.txt', 'utf-8');

// const textOut = `This is what we know about avocodo: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./final/txt/output.txt', textOut)
// console.log('file written!')

// Non-Blocking, aSynchronous way
// fs.readFile('./final/txt/start.txt', 'utf-8', (err, data1)=> {
//   if(err) return console.log("error")
//   fs.readFile(`./final/txt/${data1}.txt`, 'utf-8', (err, data2)=> {
//   console.log(data2);
//    fs.readFile(`./final/txt/append.txt`, 'utf-8', (err, data3)=> {
//   console.log(data3);

//   fs.writeFile('./final/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//     console.log('your file has been written ')
//   })
// })
// })
// })


///////////////////////////////////////
//  SERVER

const templateOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const templateCard=fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const templateProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data=fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
      const productData=JSON.parse(data);

const server=http.createServer((req, res)=> {

  const {query,pathname}= url.parse(req.url, true)
  
   // overview page
  if (pathname === '/' || pathname === '/overview') {
     res.writeHead(200, {'content-type':'text/html'})

    const cardsHtml= productData.map(el => replaceTemplate(templateCard, el)).join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }
  // product page
  else if (pathname === '/product')
  {
     res.writeHead(200, {'content-type':'text/html'})
     const product = productData[query.id];
     const output = replaceTemplate(templateProduct, product)
    res.end(output);
  }
  // API
  else if (pathname=== '/api') {
      res.writeHead(200, {'content-type':'application/json'})
      res.end(data); 
  }
  // Not found
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>This page does not exist</h1>');
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to reqests on port 8000')
});