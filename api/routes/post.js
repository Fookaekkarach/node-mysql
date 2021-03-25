const express = require('express');
const router = express.Router();
const pool = require('../../dbconn');
const mysql = require('mysql');
const checkAuth = require('../routes/checkAut');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image_post/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:|./g, '') + file.originalname);
    },

});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

router.post('/createpost', upload.single('avatar'), (req, res) => {
    let data = req.body;

    let path = "http://memthainode.comsciproject.com/" + req.file.path;
    path = path.replace("\\", "/");

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

router.post('/delete', checkAuth, (req, res) => {

    let data = req.body;
    let sql = 'DELETE FROM `like` WHERE `IDmy` = ? AND `IDpost` = ?';
    sql = mysql.format(sql, [data.IDmy, data.IDpost]);

    pool.query(sql, function (error, results, fields) {
         if (error) throw error;      

            let sql2 = 'delete from post where idpost = ?';
            sql2 = mysql.format(sql2, [data.IDpost]);
            pool.query(sql2, function (error, results, fields) {
                if (error) throw error;
                if (results.affectedRows != 0) {
                    res.status(201).json({
                        message: "Delete success",
                    });
                } else {
                    res.status(400).json({
                        message: results,
                    });
                }
            });

    });

});

router.get('/selectPostId/:postid', checkAuth, (req, res) => {
    let id = req.params.postid;
    pool.query('SELECT * from post where IDuser_post = ' + id + ' ORDER BY date DESC', function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
    });
});



router.get('/selectPostversion2/:postid', checkAuth, (req, res) => {
    let id = req.params.postid;
    let sql = 'SELECT `IDfollowing` FROM `follow` WHERE `IDmy`=?';
    sql = mysql.format(sql, [id]);
    pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        let arr = new Array();
        arr.push(id);
        results.forEach(element => {
            arr.push(element.IDfollowing);
        });
        let arrnew = new Array();
        arr.forEach(element => {
            let sql2 = 'SELECT user.id , user.name , user.image as userimage , post.idpost , post.image ,post.caption , post.date FROM user,post WHERE user.id = post.IDuser_post AND post.IDuser_post = ? ORDER BY date DESC ';
            sql2 = mysql.format(sql2, [element]);
            pool.query(sql2, function (error, results, fields) {

                if (results != "") {
                    results.forEach(element2 => {
                        arrnew.push(element2);
                    });
                }

                if (element == arr[arr.length - 1]) {
                    arrnew.sort(function (a, b) {
                        return new Date(b.date) - new Date(a.date)

                    });
                    res.status(200).json(arrnew);
                }
            });
        });
    });
});




router.post('/editcaption', function (req, res, next) {
    let idpost = req.body.id;
    let captionnew = req.body.caption;
    let sql = 'update post set caption = ? where idpost = ?';
    sql = mysql.format(sql, [captionnew, idpost]);

    pool.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.affectedRows == 1) {
            res.status(201).json({
                message: "edit success",
            });
        } else {
            res.status(400).json({
                message: "edit Failed",
            });
        }
    });
});


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Post route TEST okkkk'
    });
});

module.exports = router;