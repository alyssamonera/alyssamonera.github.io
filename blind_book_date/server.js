// ============
// DEPENDENCIES
// ============
// EXPRESS
const express = require('express');
const app = express();

// MONGOOSE
const mongoose = require('mongoose');
const db = mongoose.connection;

// SET DATABASE
const BLINDBOOK_DB = process.env.BLINDBOOK_DB

// ADDRESS DEPRECIATION WARNINGS
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// CONNECT TO DATABASE
mongoose.connect(BLINDBOOK_DB, {useNewUrlParser: true});
db.once('open', ()=> {console.log("mongo connected")})

// ===========
// MIDDLEWARE
// ===========
// STATIC FOLDERS
app.use(express.static('public'));

// PARSE JSON
app.use(express.json())

// ==========
// LISTENER
// ==========
const PORT = process.env.PORT || 3008;
app.listen(PORT, console.log("listening at port", PORT));
