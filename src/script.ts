import * as fs from 'fs';
import * as readline from 'readline';
import { Transform } from 'stream';

const readableStream = fs.createReadStream('input.txt');
const writableStream = fs.createWriteStream('output.txt');

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    const line = chunk.toString();
    const modifiedLine = `${line.trim()} - Modified line\n`;
    console.log(modifiedLine.trim());
    this.push(modifiedLine);
    callback();
  }
});

const rl = readline.createInterface({
  input: readableStream,
  crlfDelay: Infinity
});

rl.on('line', (line: string) => {
  transformStream.write(line + '\n');
});

rl.on('close', () => {
  transformStream.end();
});

transformStream.pipe(writableStream);

readableStream.on('error', (error: NodeJS.ErrnoException) => {
  console.error('Error reading the file:', error.message);
});
writableStream.on('error', (error: NodeJS.ErrnoException) => {
  console.error('Error writing the file:', error.message);
});
transformStream.on('error', (error: NodeJS.ErrnoException) => {
  console.error('Error in transformation:', error.message);
});
