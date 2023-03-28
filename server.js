const express = require("express"); // requireでexpressを呼ぶ
const app = express(); //express関数を格納→いろんな関数、クラスが使えるようになる
const PORT = 3000;

app.get("/",(req,res) => {
    res.send("hello express");
}) // "/"にアクセスするとreqで受け取って、resで返す

app.listen(PORT,() => console.log("サーバーが起動しました")) // ローカルサーバーを立ち上げる
