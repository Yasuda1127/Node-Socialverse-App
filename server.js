const express = require("express"); // requireでexpressを呼ぶ
const app = express(); //express関数を格納→いろんな関数、クラスが使えるようになる
const userRoute = require("./routes/users"); // user.jsのrouterが入っている
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();  // .envファイルを呼び出す

// データベース接続
// mongoDBのdatabaseのconnectを選択
mongoose
  .connect(
    // "mongodb+srv://yuto11271995:yuto11271995@cluster0.ediocmq.mongodb.net/Node-Socialverse?retryWrites=true&w=majority"
    // 上記の記述を他者に見られないにするために.envファイルに格納する
    process.env.MONGOURL
  )
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
app.use(express.json()); // json形式であるということを伝える記述
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => console.log("サーバーが起動しました")); // ローカルサーバーを立ち上げる
