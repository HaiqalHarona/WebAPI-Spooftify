const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const db = require('./services/dbservice.js');

db.connect().then(function(response){
    console.log(response);
}).catch(function(error){
    console.log(error.message);
})