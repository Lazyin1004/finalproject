const express = require('express');
const http = require('http');
const path = require('path');
const static = require('serve-static');
const bodyParser = require('body-parser');

const app = express();

const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(static(path.join(__dirname,"public")));

app.use('/',router);


router.route('/mian').post(function(req,res){
   
    
});

router.route('/login/강사회원가입').post(function(req,res){
    
    
});

router.route('/login/일반회원가입').post(function(req,res){
    
    
});

router.route('/login/login').post(function(req,res){
   
    
});




app.set('port',process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 버서를 시작 했습니다.')
})