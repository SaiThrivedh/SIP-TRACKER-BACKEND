const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('E:\\Training\\SIP-Tracker-db\\SIP-Tracker-db',(error) => {
    if (error) {
        console.error("Error connecting to database:", error);
    }else{
        console.log("Connected to database successfully.");
    }
});

module.exports = db;