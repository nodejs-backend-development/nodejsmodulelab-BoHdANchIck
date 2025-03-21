const { Transform } = require('stream');

class CustomStream extends Transform {
    _transform(chunk, encoding, callback) {
        const transformed = chunk.toString().replace(/[a-z]/g, char => char.toUpperCase());
        console.log(transformed); 
        this.push(transformed);
        callback();
    }
}

module.exports = CustomStream; 