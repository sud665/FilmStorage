const express = require("express");
const filmtalksRouter = express.Router();
const multer = require("multer");
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "images/");
        },
        filename: (req, file, cb) => {
            let randomNum = Math.floor((Math.random() + Math.random()) * 1000000)
            cb(null, randomNum + "_" + "image.jpg");
        },
    }),
});

const { filmtalksController } = require("../controller");

//이미지 제외 내용 등록
filmtalksRouter.post("/register/:user_id", upload.array("image", 3), filmtalksController.register.post);
// 필름토크 이미지 등록
filmtalksRouter.patch("/revision/image/:user_id/:filmtalk_id", upload.array('image', 3), filmtalksController.resigter.images)
// 필름토크 내용 수정
filmtalksRouter.patch("/revision/:user_id/:filmtalk_id", upload.array("image", 3), filmtalksController.revision.patch);
filmtalksRouter.delete("/deletion", filmtalksController.deletion.delete);
filmtalksRouter.get("/total", filmtalksController.total.get);
filmtalksRouter.get("/view/:board_id", filmtalksController.view.get);

module.exports = filmtalksRouter;
