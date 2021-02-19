const express = require('express');
const router = express.Router();
const pool = require('../../dbconn');
const mysql = require('mysql');

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image_post/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:|./g,'')+ file.originalname);
    }
})
const upload = multer({ storage: storage })

router.post('/createpost',upload.single('avatar'), async (req, res) => {
    let data = req.body;

    let path = "http://memthainode.comsciproject.com/"+req.file.path;
    path = path.replace("\\","/");

    let sql = 'INSERT INTO post (IDuser_post , caption, image, date)' +
        'VALUES (?,?,?,NOW())';
    sql = mysql.format(sql, [data.IDuser_post, data.caption, path, data.date])

    pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "post success",
            });
        } else {
            res.status(400).json({
                message: "post Failed",
            });
        }
    });
});

router.get('/',(req,res)=>{
    res.status(200).json({
        message : 'Post route TEST okkkk'
    });
});

module.exports = router;