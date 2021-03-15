const express = require('express');
const router = express.Router();
const pool = require('../../dbconn');
const mysql = require('mysql');
const checkAuth = require('../routes/checkAut');

router.get('/',(req,res)=>{
    res.status(200).json({
        message : 'Like route TEST okkkk'
    });
});

router.post('/like', (req, res) => {
    let data = req.body;
    let sql = 'INSERT INTO `like`(`date`, `IDmy`, `IDpost`)' +
    'VALUES (NOW(),?,?)';
    sql = mysql.format(sql, [data.IDmy,data.IDpost]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "like success",
            });
        } else {
            res.status(400).json({
                message: "like Failed",
            });
        }     
    });
});
router.post('/unlike', (req, res) => {
    let data = req.body;
    let sql = 'DELETE FROM `like` WHERE `IDmy` = ? AND `IDpost` = ?';
    sql = mysql.format(sql, [data.IDmy,data.IDpost]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "unlike success",
            });
        } else {
            res.status(400).json({
                message: "unlike Failed",
            });
        }     
    });
});

router.post('/checklike', (req, res) => {
    let data = req.body;
    let sql = 'SELECT COUNT(*) as checkmail FROM `like` WHERE `IDmy`= ? AND `IDpost`= ?';
    sql = mysql.format(sql, [data.IDmy,data.IDpost]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        res.status(201).json(results[0].checkmail);
    });
});

router.post('/checkcountlike', (req, res) => {
    let data = req.body;
    let sql = 'SELECT COUNT(*) as checkcountlike FROM `like` WHERE `IDpost`= ?';
    sql = mysql.format(sql, [data.IDpost]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        res.status(201).json(results[0].checkcountlike);
    });
});

module.exports = router;