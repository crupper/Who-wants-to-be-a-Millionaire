'use strict';

const express = require('express');


const app = express()


// Server listen on port
app.listen(3000, err  => {
    if(err) console.error(err.stack)
    console.log('App listening on port 3000!')
  })
// Serve static directory
app.use(express.static('www'))