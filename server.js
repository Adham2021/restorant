const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Get the requested URL and normalize it
  const requestedUrl = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, requestedUrl);

  // Check if the requested file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file does not exist, return a 404 error
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Read the file and send it as a response
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // If there's an error while reading the file, return a 500 error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        // Determine the content type based on the file extension
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
          case '.js':
            contentType = 'text/javascript';
            break;
          case '.css':
            contentType = 'text/css';
            break;
          case '.json':
            contentType = 'application/json';
            break;
        }

        // Set the appropriate content type in the response header
        res.writeHead(200, { 'Content-Type': contentType });

        // Send the file content as the response body
        res.end(data);
      }
    });
  });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
