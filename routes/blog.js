var express = require("express");
var router = express.Router();
const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blog");
const { loginCheck } = require("../middleware/loginCheck");

//获取博客列表数据
router.get("/list", (req, res, next) => {
  const author = req.query.author || "";
  const keyword = req.query.keyword || "";
  //管理员界面
  if (req.query.isadmin) {
    if (req.session.username == null) {
      //未登录的情况下
      res.json(new ErrorModel("未登录"));
      return;
    }
    // 强制查询自己的博客数据
    author = req.session.username;
  }
  const result = getList(author, keyword);
  if (result) {
    return result.then((listData) => {
      res.json(new SuccessModel(listData));
    });
  }
});

//获取单篇博客详情
router.get("/detail", (req, res, next) => {
  const result = getDetail(req.query.id);
  if (result) {
    return result.then((data) => {
      res.json(new SuccessModel(data[0]));
    });
  }
});

//新建博客
router.post("/new", loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});

//更新博客
router.post("/update", loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("更新失败~"));
    }
  });
});

//删除博客
router.post("/delete", loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = deleteBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("更新失败~"));
    }
  });
});

module.exports = router;
