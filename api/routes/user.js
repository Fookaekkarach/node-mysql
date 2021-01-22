const express = require('express');
const router = express.Router();
const pool = require('../../dbconn');
const mysql = require('mysql');
const mergeJSON = require('merge-json');

router.get('/users', (req, res) => {
    pool.query('SELECT * from user', function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
    });
});

router.get('/users/:userid', (req, res) => {
    let id = req.params.userid;
    pool.query('SELECT * from user where id = ' + id, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
    });
});

router.delete('/:userid', (req, res) => {
    let id = req.params.userid;
    let sql = 'delete from user where iduser = ?';
    sql = mysql.format(sql, [id]);

    pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "Delete success",
            });
        } else {
            res.status(400).json({
                message: "Delete Failed",
            });
        }
    });
});

router.put('/:userid', (req, res) => {
    let id = req.params.userid;
    let data = req.body;

    //Old data
    let oldSql = 'select * from user where iduser=?';
    oldSql = mysql.format(oldSql, [id]);
    let jsonoldData = {};
    pool.query(oldSql, (error, results, fields) => {
        let oldData = results[0];
        jsonoldData = JSON.parse(JSON.stringify(oldData));

        //update data merge
        let newData = mergeJSON.merge(jsonoldData, data);

        //seve update
        let sql = 'update user set fname = ?,lname = ?,email = ? where iduser = ?';
        sql = mysql.format(sql, [newData.fname, newData.lname, newData.email, id]);

        pool.query(sql, function (error, results, fields) {
            if (error) throw error;
            if (results.affectedRows == 1) { 
                res.status(201).json({
                    message: "Update success",
                });
            } else {
                res.status(400).json({
                    message: "Update Failed",
                });
            }
        });
    });
});

module.exports = router;