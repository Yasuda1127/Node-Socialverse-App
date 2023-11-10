const express = require("express"); // requireでexpressを呼ぶ
const app = express(); //express関数を格納→いろんな関数、クラスが使えるようになる
const userRoute = require("./routes/users"); // user.jsのrouterが入っている
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const PORT = 4000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config(); // .envファイルを呼び出す

// データベース接続
// mongoDBのdatabaseのconnectを選択
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中・・・");
  })
  .catch((err) => {
    console.log(err);
  });

// エンドポイント
app.get("/", (req, res) => {
  res.send("hello express");
}); // "/"にアクセスするとreqで受け取って、resで返す

// app.get("/users", (req, res) => {
//   res.send("users express");
// });

// ミドルウェア
app.use("/images", express.static(path.join(__dirname, "public/images")));
// 現在のディレクトリ + "public/images"　を見にいく記述。前の方の"/images"は.envで指定しているもの
// "/images"を見ている時は、"public/images"を見に行けという記述。

app.use(express.json()); // json形式であるということを伝える記述
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);

app.listen(PORT, () => console.log("サーバーが起動しました")); // ローカルサーバーを立ち上げる
