// user情報を格納するスキーマ（ユーザー情報）

const mongoos = require("mongoose");

const UserSchema = new mongoos.Schema(
  {
    username: {
      type: String,
      required: true, // 必ず必要(これがないと成立しない)
      min: 3,
      max: 25,
      unique: true, // trueにすることで、他のユーザーネームとの重複を許さない
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array, // フォロワーは増えていくため配列にする
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean, // 権限があるかないかのため、Booleanで用意
      default: false,
    },
    desc: {
      // 概要欄
      type: String,
      max: 70,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true } // データを格納した日付を自動的に追加
);

module.exports = mongoos.model("User", UserSchema);
// UserSchemaをUserという変数名で宣言している
