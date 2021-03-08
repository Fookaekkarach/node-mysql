const express = require('express');
const router = express.Router();
const pool = require('../../dbconn');
const mysql = require('mysql');
const checkAuth = require('../routes/checkAut');

router.get('/test',(req,res)=>{
    res.status(200).json({
        message : 'Follow route TEST okkkk'
    });
});

router.post('/', (req, res) => {
    let data = req.body;
    let sql = 'INSERT INTO follow (date,IDmy,IDfollowing)' +
    'VALUES (NOW(),?,?)';
    sql = mysql.format(sql, [data.date,data.IDmy,data.IDfollowing]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "follow success",
            });
        } else {
            res.status(400).json({
                message: "follow Failed",
            });
        }
            
    });

});


module.exports = router;