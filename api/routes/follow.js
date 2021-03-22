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

router.post('/follow', (req, res) => {
    let data = req.body;
    let sql = 'INSERT INTO follow (date,IDmy,IDfollowing)' +
    'VALUES (NOW(),?,?)';
    sql = mysql.format(sql, [data.IDmy,data.IDfollowing]);

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

router.post('/unfollow', (req, res) => {
    let data = req.body;
    let sql = 'DELETE FROM `follow` WHERE `IDmy` = ? AND `IDfollowing` = ?';
    sql = mysql.format(sql, [data.IDmy,data.IDfollowing]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "delete success",
            });
        } else {
            res.status(400).json({
                message: "delete Failed",
            });
        }     
    });
});

router.post('/checkfollow', (req, res) => {
    let data = req.body;
    let sql = 'SELECT COUNT(*) as checkmail FROM `follow` WHERE `IDmy`=? AND`IDfollowing`=?';
    sql = mysql.format(sql, [data.IDmy,data.IDfollowing]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        res.status(201).json(results[0].checkmail);
    });
});

//เช็คจำนวนที่เราติดตาม SELECT COUNT(`IDfollowing`) as countmyfollow FROM `follow` WHERE `IDmy`=13
router.post('/countmyfollow', (req, res) => {
    let data = req.body;
    let sql = 'SELECT COUNT(`IDfollowing`) as countmyfollow FROM `follow` WHERE `IDmy`= ?';
    sql = mysql.format(sql, [data.IDmy]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        res.status(201).json(results[0].countmyfollow);
    });
});

//เช็คจำนวนคนที่มาติดตามเรา SELECT COUNT(*) countmyfollow FROM `follow` WHERE `IDfollowing`=13
router.post('/countfollowing', (req, res) => {
    let data = req.body;
    let sql = 'SELECT COUNT(*) as countfollowing FROM `follow` WHERE `IDfollowing`= ?';
    sql = mysql.format(sql, [data.IDmy]);

    pool.query(sql,function (error, results, fields) {
        if (error) throw error;
        res.status(201).json(results[0].countfollowing);
    });
});

module.exports = router;