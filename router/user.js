const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const moment = require('moment')

const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'my_blog'
})

router.get('/register', (req, res) => {
  res.render('./user/register.ejs', {})
});

router.get('/login', (req, res) => {
  res.render('./user/login.ejs', {})
});

// 注册逻辑
router.post('/register', (req, res) => {
  // body-parser
  // console.log(req.body)
  // 获取客户端提交过来的用户表单信息
  const user = req.body
  // 判断表单信息是否合法, 不合法返回错误状态码和信息
  if (user.username.trim().length === 0 ||
    user.password.trim().length === 0 ||
    user.nickname.trim().length === 0) return res.status(400).send({ status: 400, msg: '请填写完整的表单信息!' });

  // 查重: 执行sql语句 在数据库中查询当前提交过来的用户名是否已存在
  const querySql = 'select count(*) as count from users where username = ?'
  conn.query(querySql, user.username, (err, result) => {
    // result是一个数组  数组中有一个对象  对象中有一个属性叫 count [ { count: 0 } ]
    // console.log(err)

    if (err) return res.status(500).send({ status: 500, msg: '用户名查询失败!请重试!' })
    // console.log(result[0].count != 0)
    if (result[0].count != 0) return res.status(402).send({ status: 402, msg: '用户名已存在!请重试!' })

    // 给用户添加创建时间的属性
    user.ctime = moment().format('YYYY-MM-DD HH:mm:ss')

    // 用户名不存在需要执行添加用户的sql语句
    const addSql = 'insert into users set ?'
    conn.query(addSql, user, (err, result) => {
      if (err || result.affectedRows != 1) return res.status(500).send({ status: 500, msg: '用户添加失败!请重试!' })
      res.send({ status: 200, msg: '用户注册成功!' });
    })
  })

});

router.post('/login', (req, res) => {
  // 获取客户端提交过来的表单数据
  const user = req.body
  // 执行sql语句 查询用户是否存在, 密码是否正确
  const querySql = 'select * from users where username = ? and password = ?'
  conn.query(querySql, [user.username, user.password], (err, result) => {
    if (err) return res.status(500).send({status: 500, msg: '登录失败!请重试!'})
    if (result.length === 0) return res.status(400).send({status: 400, msg: '用户名或密码错误!请重试!'})
    res.send({ status: 200, msg: '恭喜您!登录成功!' })
  })
});

module.exports = router
