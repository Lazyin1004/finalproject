const express = require('express');
const http = require('http');
const path = require('path');
const static = require('serve-static');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const app = express();
const expressErrorHandler = require('express-error-handler');

const errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});



app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/public',static(path.join(__dirname,'public')));


app.use('/process/login/:name',function(req,res,next){
    console.log('첫번째 미들웨어에서 요청을 처리함');
    var paramName = req.params.name
    var parmaId = req.body.id || req.id;
    var paramPassword = req.body.pw1 || req.query.pw1;
 
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>express 서버에서 응답한 결과입니다.</h1>')
    res.write('<div><p>parma name:'+paramName+'<p/></div>')
    res.write('<div><p>parma Id:'+parmaId+'<p/></div>')
    res.write('<div><p> paramPassword '+paramPassword+ '<p/></div>')
    res.write("<br><br><a href='/public/Login.html'>로그인 페이지 돌아가기</a>")
    res.end()
    next();
});

app.get('/process/showCookie',function(req,res){
    console.log('/process/showCookie 호출됨');
    res.send(req.cookies);
})

app.get('/process/setUserCookie',function(req,res){
    console.log('/process/setUserCookie 호출됨');

    //쿠키설정
    res.cookie('users',{
        id:'mide',
        name:'소녀시대',
        auhtorized:true,
    });
    res.redirect('/process/showCookie')
})

//상품정보 라우팅 함수
app.get('/process/product',function(req,res){
    console.log('/process/product 호출됨')
    if(req.session.user){
        res.redirect('/public/product.html')
    }else{
        res.redirect('/public/Login.html')
    }
});

app.post('/process/login',function(req,res){
    console.log('/process/login 호출됨');
    
    var paramId = req.body.id||req.query.id
    var paramPassword = req.body.pw1 || req.query.pw1;

    if(req.session.user){
//         //이미 로그인 된 상태
        console.log('이미 로그인 되어 상품 페이지로 이동합니다.')
        res.redirect('/public/product.html')
    }else{
//         //세션 저장
        req.session.user = {
            id :paramId,
            name:'소녀시대',
            auhtorized:true,
        };
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>')
        res.write('<div><p>parma Id:'+parmaId+'<p/></div>')
        res.write('<div><p> paramPassword '+paramPassword+ '<p/></div>')
        res.write("<br><br><a href='/process/product'>상품페이지로 이동하기</a>")
        res.end()
    }
})
// //로그아웃후 세션 삭제함
app.get('/process/logout',function(req,res){
    console.log('/process/logout호출됨 ')
    if(req.session.user){
        //로그인 된 상태
        console.log('로그아웃 합니다.')
        req.session.destroy(function(err){
            if(err){throw err;}
            console.log('세션을 삭제하고 로그아웃 되었습니다.')
        });
    }else{
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.')
        res.redirect('/public/Login.html')
    }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler)
app.set('port',process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 버서를 시작 했습니다.')
});