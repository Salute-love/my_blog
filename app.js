const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// 设置默认采用的模板引擎名称
app.set('view engine','ejs')
// 设置模板页面的存放路径
app.set('views','./views')

// 注册body-parser中间件  注册以后才可以在req中使用body对象获取客户端post提交过来的数据
app.use(bodyParser.urlencoded({extended:false}))

// 把node_modules文件夹，托管为静态资源目录
app.use('/node_modules',express.static('./node_modules'))

// 导入首页的路由模块
const indexRouter = require('./router/index.js')
app.use(indexRouter)

// 导入用户功能的路由模块
const userRouter = require('./router/user.js')
app.use(userRouter)


app.listen(80,() =>{
    console.log('http://127.0.0.1')
})