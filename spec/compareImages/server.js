const express = require('express');
const app = express();

const PORT = 3030;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

app.use(express.static(__dirname));
