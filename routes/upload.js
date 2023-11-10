const router = require("express").Router();
const multer = require("multer"); // ファイルのアップロードに使うライブラリ

const storage = multer.diskStorage({
  // どこに保存するか。destination ＝ 目的地
  destination: (req, file, cb) => {
    cb(null, "public/images"); // public/imagesフォルダの中に画像をアップロードする
  },
  // 保存する画像の名前
  filename: (req, file, cb) => {
    cb(null, req.body.name); // req.body.nameと書くことで、画像の名前で格納できる
  },
});

const upload = multer({ storage });
// 画像アップロード用API
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("画像アップロードに成功しました！");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
