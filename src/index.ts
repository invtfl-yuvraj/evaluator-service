import express from 'express';

import serverConfig from './config/server.config.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});
