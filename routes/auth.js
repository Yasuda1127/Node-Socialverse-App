const router = require("express").Router();
const User = require("../models/User");

// ユーザー登録
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save(); // セーブ関数でセーブする
    return res.status(200).json(user); // 全てが正常に作動していれば200を返す
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // email情報でユーザーを一つ探してくる
    if (!user) return res.status(404).send("ユーザーが見つかりません。"); // ユーザーが存在しない場合

    const vailedPassword = req.body.password === user.password; // パスワードが一致するならログインできる
    if (!vailedPassword) return res.status(400).json("パスワードが違います");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/",(req,res) => {
//     res.send("auth router");
// })

module.exports = router;
