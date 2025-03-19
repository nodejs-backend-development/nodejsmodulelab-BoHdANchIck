const http = require('http');
const fs = require('fs');
const url = require('url');
const split2 = require('split2');
const through2 = require('through2');
const { Transform } = require('stream');


const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // task5
    if (parsedUrl.pathname === '/task5') {
        let firstChunk = true;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('[');

        const stream = fs.createReadStream('data.csv')
            .pipe(split2())
            .pipe(through2.obj((chunk, enc, callback) => {
                const [name, age, city] = chunk.split(',');
                const obj = JSON.stringify({ name, age, city });

                if (!firstChunk) {
                    callback(null, ',' + obj);
                } else {
                    firstChunk = false;
                    callback(null, obj);
                }
            }));

        stream.on('data', (data) => {
            res.write(data);
        });

        stream.on('end', () => {
            res.end(']');
        });

        stream.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading or processing file');
        });
    } 

    // task3
    else if (parsedUrl.pathname === '/task3') {
        const cookies = req.headers.cookie || '';
        const cookieObj = cookies.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key.trim()] = value;
            return acc;
        }, {});

        // if (!cookieObj.user_info) {
        //     res.setHeader('Set-Cookie', 'user_info=user1; Path=/; HttpOnly');
        // }

        if (cookieObj.user_info === 'user1') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                id: 1,
                firstName: "Leanne",
                lastName: "Graham"
            }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({}));
        }
    } 

    // task6
    else if (parsedUrl.pathname === '/task6') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Processing input from console. Check logs.');

        process.stdin.pipe(new Transform({
            transform(chunk, _, callback) {
                const transformed = chunk.toString().replace(/[a-z]/g, char => char.toUpperCase());
                console.log(transformed);
                callback();
            }
        }));
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
});

server.listen(port, host, () => {
    console.log(`Task3 http://${host}:${port}/task3`);
    console.log(`Task5 http://${host}:${port}/task5`);
    console.log(`Task6 http://${host}:${port}/task6`);
});
