const express = require('express');
const router = express.Router();

const fs = require('fs');

const createFolder = (req, res) => {
    setTimeout(()=> {
        console.log("Timeout to waste time")
        if (!fs.existsSync(req.body.path)) {
            fs.mkdirSync(req.body.path);
        }
        return res.status(200).json({
            data: req.body.path,
            status: req.body.status,
            message: `Folder event ${req.body.status} was processed successfully`
        })
    }, 3000);
};

const moveFolder = (req, res) => {
    setTimeout(()=> {
        console.log("Timeout to waste time");
        if (fs.existsSync(req.body.path)){
            fs.renameSync(req.body.path, req.body.new_path);
        }
        return res.status(200).json({
            data: req.body.path,
            status: req.body.status,
            message: `Folder event ${req.body.status} was processed successfully`
        })
    }, 3000);
}

router.post('/user.CREATED_FOLDER', createFolder);
router.post('/user.MOVED_FOLDER', moveFolder);
router.post('/folder.MOVED_FOLDER', moveFolder);
router.post('/folder.CREATED_FOLDER', createFolder);
router.post('/MOVED_FOLDER', moveFolder);
router.post('/CREATED_FOLDER', createFolder);

module.exports = router;
