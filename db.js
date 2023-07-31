const mysql = require("mysql2")

var con = mysql.createConnection({
    host:'localhost',
    database:'astro',
    user:'root',
    password:''
});
module.exports = con  ;