const express = require('express');
const router = express.Router();
const pool = require('../../dbconn'); 
const mysql = require('mysql');

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:|./g,'')+ file.originalname);
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png'||file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const upload = multer({ storage: storage , fileFilter: fileFilter})
//const upload = multer({ storage: storage})


router.post('/profile', upload.single('avatar'), function (req, res, next) {
    let id = req.body.id;
    let path = "http://memthainode.comsciproject.com/"+req.file.path;
    path = path.replace("\\","/");
    let sql = 'update user set image = ? where id = ?';
    sql = mysql.format(sql, [path,id]);

    pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) { 
            res.status(201).json({
                message: "Upload success",
            });
        } else {
            res.status(400).json({
                message: "Upload Failed",
            });
        }
    });
});



router.get('/test', (req, res) => {
    pool.query('SELECT * from user', function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
    });
});

module.exports = router;