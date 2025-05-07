const http = require('node:http');
const {createFile,getMovies}=require('./FileManager')

const hostname = '127.0.0.1';
const port = 3001;

// Sample data
let movies = ['Hangover', 'Blended', 'Dictator', 'Superbad', 'Ted'];
let series = ['Breaking Bad', 'Stranger Things', 'Game of Thrones'];
let songs = ['Mandinaye', 'Amazulu', 'Abalele', 'Xola', 'Ungangilimazi'];

const server = http.createServer((req, res) => {
    const { url, method } = req;

    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', () => {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }
        }

        res.setHeader('Content-Type', 'application/json');

        // Helper function
        const handle = (array, name) => {
            if (method === 'GET') {
                res.statusCode = 200;
                getMovies().then(result =>{
                    console.log({result})
                }).catch(err => {
                    console.log({err})
                })
                res.end(JSON.stringify(array));
            } else if (method === 'POST') {
                array.push(data.item);
                res.statusCode = 201;
                res.end(JSON.stringify({ message: `${name} added`, list: array }));
            } else if (method === 'PUT') {
                array[0] = data.item; // update first item for simplicity
                res.statusCode = 200;
                res.end(JSON.stringify({ message: `${name} updated`, list: array }));
            } else if (method === 'DELETE') {
                array.pop(); // remove last item
                res.statusCode = 200;
                res.end(JSON.stringify({ message: `${name} deleted`, list: array }));
            } else {
                res.statusCode = 405;
                res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }
        };

        // Routing
        if (url === '/movies') {
            handle(movies, 'Movie');
        } else if (url === '/series') {
            handle(series, 'Series');
        } else if (url === '/songs') {
            handle(songs, 'Song');
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    });
});
createFile()
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
