const express = require('express');
const router = express.Router();
const pool = require('../../dbconn');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const checkAuth = require('../routes/checkAut');
const jwt = require('jsonwebtoken');

router.get('/',(req,res)=>{
    res.status(200).json({
        message : 'Login route  TEST okkkk'
    });
});

router.post('/register',  (req, res) => {
    let data = req.body;

    let img = "http://memthainode.comsciproject.com/image/testprofile.png";
    
    let sql = 'SELECT COUNT(`email`) as checkmail  FROM `user` WHERE `email`= ?';
    sql = mysql.format(sql, [data.email]);

    pool.query(sql,async function (error, results, fields) {
        if (error) throw error;
        if (results[0].checkmail == 0) {
            
            const haspass = await bcrypt.hash(data.password,10);
            let sql = 'INSERT INTO user (name, email, password, image, status, date)' +
                'VALUES (?,?,?,?,?,NOW())';
            sql = mysql.format(sql, [data.name, data.email, haspass,img, data.status]);

            pool.query(sql, function (error, results, fields) {
                if (error) throw error;
                if (results.affectedRows == 1) {
                    res.status(201).json({
                        message: "register success",
                    });
                } else {
                    res.status(400).json({
                        message: "register Failed",
                    });
                }
    });
               
        } else {
            res.status(400).json({
                message: "อีเมลซ้ำกัน",
            });
        }
    });
});

router.post('/loginUser', (req, res) => {
    let data = req.body;
    let sql = 'select * from user where email = ?';
    sql = mysql.format(sql, [data.email]);
    pool.query(sql,  async function (error, results, fields) {
        if (error) throw error;
        const validpass = await bcrypt.compare(data.password,results[0].password);
        if(validpass){
            const token = jwt.sign(
                {
                    id: results[0].id
                },
                "secret",
            );
            return res.status(201).json(token);
        }else {
            res.status(400).json({
                message: "login Failed",
            });
        }
    });
});

module.exports = router;
