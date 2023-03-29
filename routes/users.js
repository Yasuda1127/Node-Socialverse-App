// ユーザー情報に関するファイルを格納する
// server.jsと切り離すことで、管理がしやすい

const router = require("express").Router();
const User = require("../models/User");

// CRUD
// ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, // $set...全てのパラメーター
      }); // findByIdAndUpdate関数...一つのユーザーを見つけてそれを更新する
      res.status(200).json("ユーザー情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます。");
  }
});
// params.idはユーザーに付与されいているid

// ユーザー情報の削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザー情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を削除できます。");
  }
});

// ユーザー情報の取得       タイムラインの表示などに使われる
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc; // 分割代入でそれぞれを取り除く(取得できてはいけない情報のため)分割代入、スプレッド構文
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/",(req,res) => {
//     res.send("user router");
// })

module.exports = router;
