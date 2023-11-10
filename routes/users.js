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
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, updatedAt, ...other } = user._doc; // 分割代入でそれぞれを取り除く(取得できてはいけない情報のため)分割代入、スプレッド構文
//     return res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

// クエリでユーザー情報を取得(プロフィール情報取得)
router.get("/", async (req, res) => {
  const userId = req.query.userId; 
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId) // userIdがあった場合
      : await User.findOne({ username: username }); // userIdがない場合、usernameで取得する

    const { password, updatedAt, ...other } = user._doc; // 分割代入でそれぞれを取り除く(取得できてはいけない情報のため)分割代入、スプレッド構文
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザーのフォロー
router.put("/:id/follow", async (req, res) => { // putは情報の更新
  if (req.body.userId !== req.params.id) { // 自分のユーザーIDに等しくない場合
    try {
      const user = await User.findById(req.params.id); // フォローする相手のユーザー情報
      const currentUser = await User.findById(req.body.userId); // 自分のユーザー情報
      // フォロワーに自分がいなかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        // followersに自分のユーザーidが含まれているか
        await user.updateOne({
          $push: {
            // 配列にプッシュしていく
            followers: req.body.userId, // フォロワーに自分自身をプッシュする
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローに成功しました！");
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォローしています");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません。");
  }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); // フォローする相手のユーザー情報
      const currentUser = await User.findById(req.body.userId); // 自分のユーザー情報
      // フォロワーに存在したらフォローを外せる
      if (user.followers.includes(req.body.userId)) {
        // followersに自分のユーザーidが含まれているか
        await user.updateOne({
          $pull: {
            // 配列を取り除く
            followers: req.body.userId, // フォロワーに自分自身をプッシュする
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォロー解除しました！");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除できません。");
  }
});

// router.get("/",(req,res) => {
//     res.send("user router");
// })

module.exports = router;
