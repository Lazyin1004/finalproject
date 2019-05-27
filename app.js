//모듈 불러오기 
const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const servestatic= require('serve-static');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler')

//익스프레스 객체 생성
//middleware 세팅
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));






// start server
app.listen(3000, function () {
  console.log('Server On!');
});