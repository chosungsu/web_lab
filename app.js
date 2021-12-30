/* 설치한 express 모듈 불러오기*/
const express = require("express");
const socket = require("socket.io");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const http = require("http");
/* Node.js 기본 내장 모듈 불러오기*/
const fs = require("fs");
/* express 객체 생성*/
const app = express();
const server = http.createServer(app);
const io = socket(server);
const mysql = require("mysql");
const bodyParser = require("body-parser");
const e = require("connect-flash");
var se_ = "";
var logined = false;

//mysql 설정
//local db
/*const connection = mysql.createConnection({
  host: "localhost",
  port: "6010",
  user: "root",
  password: "12341234",
  database: "webuser",
});*/
const connection = mysql.createConnection({
  host: "localhost",
  user: "userinfo",
  password: "josungsu",
  database: "userinfo",
});
connection.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//session 설정
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.get("/", function (request, response) {
  se_ = request.session.name;
  logined = request.session.logined;
  console.log(request.session);
  console.log(se_);
  console.log(logined);
  fs.readFile("./static/MAIN.html", function (err, data) {
    if (err) {
      res.send(
        '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
      );
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });
      response.write(data);
      response.end();
    }
  });
});
app.get("/login", function (request, response) {
  fs.readFile("./static/USER.html", function (err, data) {
    if (err) {
      res.send(
        '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
      );
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });
      response.write(data);
      response.end();
    }
  });
});
app.get("/signup", function (request, response) {
  fs.readFile("./static/SIGNUP.html", function (err, data) {
    if (err) {
      res.send(
        '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
      );
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });
      response.write(data);
      response.end();
    }
  });
});
app.get("/video", function (request, response) {
  fs.readFile("./static/VIDEO.html", function (err, data) {
    if (err) {
      res.send(
        '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
      );
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });
      response.write(data);
      response.end();
    }
  });
});
app.get("/blog", function (request, response) {
  console.log(request.session);
  fs.readFile("./static/BLOG.html", function (err, data) {
    if (err) {
      res.send(
        '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
      );
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });
      response.write(data);
      response.end();
    }
  });
});
app.get("/write", function (request, response) {
  se_ = request.session.name;
  console.log(se_);
  fs.readFile("./static/WRITE.html", function (err, data) {
    if (err) {
      res.send(
        '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
      );
    } else {
      response.writeHead(200, {
        "Content-Type": "text/html",
      });
      response.write(data);
      response.end();
    }
  });
});
app.post("/login", function (req, res) {
  console.log(req.body.name);
  var name = req.body.name;
  var id = req.body.id;
  var password = req.body.pw;
  var email = req.body.email;
  var checkid = connection.query(
    "select * from log where id = '" + id + "'",
    function (err, result) {
      if (err) {
        throw err;
      }
      if (result.length < 1) {
        //동일 id 발견되지 않을 경우 success
        var query = connection.query(
          "insert into log (id, name, pw, email) values ('" +
            id +
            "','" +
            name +
            "','" +
            password +
            "','" +
            email +
            "')",
          function (err, rows) {
            if (err) {
              throw err;
            } else {
              console.log("ok inserted!");
              fs.readFile("./static/USER.html", function (err, data) {
                if (err) {
                  res.send(
                    '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
                  );
                } else {
                  res.writeHead(200, {
                    "Content-Type": "text/html",
                  });
                  res.write(data);
                  res.end();
                }
              });
            }
          }
        );
      } else {
        console.log("id is invalid");
        res.send(
          '<h3>Your signup trial is denied because your id is same with other person!</h3><a href="/signup">Back to SIGNUP FORM</a>'
        );
      }
    }
  );
});
app.post("/", function (req, res) {
  console.log(req.body.name);
  var name = req.body.name;
  var password = req.body.pw;
  var query = connection.query(
    "select * from log WHERE name = ?",
    [name],
    function (err, rows) {
      if (err) {
        throw err;
      } else {
        if (rows.length > 0) {
          if (rows[0].pw == password) {
            //사용자 정보가 모두 일치할 때
            console.log("ok login success!");
            fs.readFile("./static/MAIN.html", function (err, data) {
              if (err) {
                res.send(
                  '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/">Back to HOME</a>'
                );
              } else {
                req.session.logined = true;
                logined = true;
                req.session.name = name;
                se_ = req.session.name;
                res.writeHead(200, {
                  "Content-Type": "text/html",
                });
                res.write(data);
                res.end();
              }
            });
          } else {
            res.send(
              '<h3>Your login trial is denied because your password is incorrect!</h3><a href="/login">Back to LOGIN FORM</a>'
            );
          }
        } else {
          res.send(
            '<h3>Your login trial is denied because your data is not in</h3><a href="/login">Back to LOGIN FORM</a>'
          );
        }
      }
    }
  );
});
app.post("/blog", function (req, res) {
  var name_write = req.body.name;
  var where_write = req.body.where;
  var board_write = req.body.text_main_board;
  var ids = connection.query("select * from blog", function (err, rows) {
    if (err) {
      throw err;
    } else {
      //id값을 계산하기 위한 로직임.
      var id_len = rows.length + 1;
      var query = connection.query(
        "insert into blog (id, name, where_write, board) values ('" +
          id_len +
          "','" +
          name_write +
          "','" +
          where_write +
          "','" +
          board_write +
          "')",
        function (err, rows) {
          if (err) {
            throw err;
          } else {
            console.log("ok inserted!");
            fs.readFile("./static/BLOG.html", function (err, data) {
              if (err) {
                res.send(
                  '<h3>ERROR 404</h3><p>We will fix this error as soon as possible!Sorry for some bugs.</p><a href="/blog">Back to BLOG</a>'
                );
              } else {
                res.writeHead(200, {
                  "Content-Type": "text/html",
                });
                res.write(data);
                res.end();
              }
            });
          }
        }
      );
    }
  });
});
app.get("/images/SEOUL.jpeg", function (req, res) {
  fs.readFile("./images/SEOUL.jpeg", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
app.get("/images/busan.jpeg", function (req, res) {
  fs.readFile("./images/busan.jpeg", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
app.get("/images/info.png", function (req, res) {
  fs.readFile("./images/info.png", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
app.get("/images/hello-korea.jpg", function (req, res) {
  fs.readFile("./images/hello-korea.jpg", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
app.get("/images/korea-image.jpg", function (req, res) {
  fs.readFile("./images/korea-image.jpg", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
app.get("/images/imagine-korea.jpg", function (req, res) {
  fs.readFile("./images/imagine-korea.jpg", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

io.sockets.on("connection", (socket) => {
  let user = {};
  let blog_list_user = "";
  let real_log_user = "";
  let blog_user_name = "";
  let blog_user_where = "";
  let blog_user_content = "";
  user[socket.id] = {};
  var id_num = Object.keys(user).length;
  const req = socket.request;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("새로운 클라이언트 접속", ip, socket.id, req.ip);
  console.log("클라이언트 개수 : ", id_num);
  console.log(user);
  console.log(se_);
  socket.emit("user", "login");
  socket.emit("session", se_);
  socket.emit("logined", logined);
  socket.on("season", (data) => {
    socket.emit("msg", data);
    console.log(data);
  });
  var userid_list = connection.query("select * from log", function (err, rows) {
    if (err) {
      throw err;
    } else {
      //query값이 있는 경우
      for (i = 0; i < rows.length; i++) {
        real_log_user += rows[i].name + " ";
      }
      console.log(real_log_user);
    }
  });

  socket.on("select_blog", (data) => {
    var blog_list = connection.query(
      "select * from blog where name = ?",
      [data],
      function (err, rows) {
        if (err) {
          throw err;
        } else {
          //query값이 있는 경우
          for (i = 0; i < rows.length; i++) {
            blog_user_name = rows[i].name;
            blog_user_where = rows[i].where_write;
            blog_user_content = rows[i].board;
            socket.emit("blog_selected_view", {
              name: blog_user_name,
              where: blog_user_where,
              content: blog_user_content,
            });
            console.log(
              blog_user_name + "/" + blog_user_where + "/" + blog_user_content
            );
          }
        }
      }
    );
  });

  socket.on("real_user", (data) => {
    data = real_log_user;
    socket.emit("user_blog_list", real_log_user.split(" "));
    console.log(real_log_user.split(" "));
    real_log_user = {};
  });
  socket.on("disconnect", () => {
    delete user[socket.id];
    console.log(socket.id + "(이)가 접속종료되었습니다.");
  });
});

/* 서버를 80 포트로 listen */
server.listen(80, function () {
  console.log("서버시작");
});
/*server.listen(8000, function () {
  console.log("서버시작");
});*/
