// 投稿用

const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body); // Postスキーマをインスタンス化(req.bodyに投稿するのであればPostスキーマの内容を含んだ情報が投稿される)
  try {
    const savedPost = await newPost.save(); //投稿が完了したらセーブする必要がある
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // postの中には情報を更新した後の内容を格納する、まずpostを探す
    if (post.userId === req.body.userId) {
      await post.updateOne({
        // 情報を更新する
        $set: req.body, // 情報をセットする
      });
      return res.status(200).json("投稿に成功しました！");
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // postの中には情報を更新した後の内容を格納する、まずpostを探す
    if (post.userId === req.body.userId) {
      await post.deleteOne(); // 投稿を削除する
      return res.status(200).json("削除に成功しました！");
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // フォローする相手のユーザー情報
    // まだ投稿にいいねが押されていなかったら
    if (!post.likes.includes(req.body.userId)) {
      // likesにユーザーidがなければいいねを押す
      await post.updateOne({
        $push: {
          // 配列にプッシュしていく
          likes: req.body.userId, // likesにユーザーidをpushする
        },
      });
      return res.status(200).json("投稿にいいねを押しました！");
      // 投稿にすでにいいねが押されていたら
    } else {
      // いいねしているユーザーidを取り除く
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(403).json("投稿にいいねを外しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// プロフィール専用のタイムラインの取得
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username}); // 「findOne」はモングースの関数。一つのusernameを取得するため。プロパティの指定が必要。
    const posts = await Post.find({ userId: user._id }); // 自分の投稿
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  // 「/timeline」と記述すると「:id/」のように特定の取得になるため、差別化するために「/all」をつける
  try {
    // 自分の投稿と、フォローしている人の投稿を持ってくる
    const currentUser = await User.findById(req.params.userId); // どの人が投稿したのかを判別するため、ユーザースキーマを取得(自分？)
    const userPosts = await Post.find({ userId: currentUser._id }); // 投稿した人の投稿を全部取得する(_idは「currentUser」のuserid)
    // 自分がフォローしている友達の投稿内容を全て表示する
    const friendPosts = await Promise.all(
      // currentUserでawaitを使っており、いつでも取得できるように待っておくという記述
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }); // 全部探してくる
      }) // 「followings」は、自分がフォローしているユーザーが全て格納されている
    );
    return res.status(200).json(userPosts.concat(...friendPosts)); // スプレッド構文で展開した状態で合体する
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/",(req,res) => {
//     res.send("posts router");
// })

module.exports = router;
