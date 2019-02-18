var Hello = require('./hello.js');
var express = require("express");
var bodyParser = require('body-parser');
var multer  = require('multer');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });//cau hinh urlencodeted de co ther nhan du lieu dang post
app.set("view engine", "ejs");
app.set("views","./views");
app.use(express.static("public"));
app.listen(8888);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
}) 
var upload = multer({ storage: storage }).single("uploadfile");

app.use('/home',Hello);

// app.get('/post',function(req,res){
// 	res.render("Post.ejs");
// });

// nap thu vien postgres 
var pg = require("pg");
// kết nối
var config = {
	user: 'postgres',
	database: 'NodeJsEx',
	password: 'phucnguyen',
	host: 'localhost',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
};
var pool = new pg.Pool(config);


//trang post bai
app.get("/post",function(req,res){
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
		}
		client.query('select * from newpp',function(err,result){
			done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

			if(err){
				res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
				return console.error('error running query',err);
			}
			res.render("Post",{data:result});// sau khi truy van xong neu khong co loi se render ra trang form
		});
	});
})


//trang admin
app.get('/admin',function(req,res){
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
		}
		client.query('select * from newpp',function(err,result){
			done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

			if(err){
				res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
				return console.error('error running query',err);
			}
			res.render("admin",{data:result});// sau khi truy van xong neu khong co loi se render ra trang 
		});
	});
});


//chuc nang delete
app.get('/delete/:id',function(req,res){
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
		}
		client.query('delete from newpp where id ='+req.params.id,function(err,result){
			done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

			if(err){
				res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
				return console.error('error running query',err);
			}
			res.redirect("/admin");// sau khi truy van xong neu khong co loi se render ra trang 
		});
	});
});


// chuc nang add post
app.get('/add',function(req,res){
	res.render("add");
});

app.post('/add',function(req,res){
	upload(req, res, function (err) {
    if (err) {
    	res.send("upload khong thanh cong !");
    } else{
    	if(req.file == undefined){
    		res.send("file chua duoc chon !")
    	}else{
    		pool.connect(function(err, client, done){
				if(err){
					return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
				}
				var sql = "insert into newpp (id,title,posts,image) values ('"+req.body.id+"','"+req.body.title+"','"+req.body.post+"','"+req.file.originalname+"')";
				client.query(sql,function(err,result){
					done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

					if(err){
						res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
						return console.error('error running query',err);
					}
					res.redirect("/admin");// sau khi truy van xong neu khong co loi se render ra trang 
				});
			});
    	}
    }
  })

});


//chuc nang edit 
app.get("/edit/:id",function(req,res){
	var id = req.params.id;
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
		}
		client.query('SELECT * FROM newpp WHERE id='+id,function(err,result){
			done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

			if(err){
				res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
				return console.error('error running query',err);
			}
			res.render("edit",{data:result.rows[0]});// sau khi truy van xong neu khong co loi se render ra trang 
		});
	});
});

app.post('/edit/:id',function(req,res){
	var id = req.params.id;
	upload(req, res, function (err) {
    if (err) {
    	res.send("upload khong thanh cong !");
    } else{
    	if(req.file == undefined){
    		pool.connect(function(err, client, done){
				if(err){
					return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
				}
				client.query("UPDATE newpp SET id='"+req.body.id+"',title='"+req.body.title+"',posts='"+req.body.posts+"' WHERE id="+id,function(err,result){
					done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

					if(err){
						res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
						return console.error('error running query',err);
					}
					res.redirect("admin");
				});
			});
    	}else{
    		pool.connect(function(err, client, done){
				if(err){
					return console.error('error fetching client from pool',err); //  neu co loi se xuat ra khung bao loi
				}
				client.query("UPDATE newpp SET id='"+req.body.id+"',title='"+req.body.title+"',posts='"+req.body.posts+"',image='"+req.file.originalname+"' WHERE id="+id,function(err,result){
					done(); //  neu khong co loi xe tiep tuc cau lenh truy van csdl

					if(err){
						res.end(); // sau khi truy van xong neu co loi se tra ve loi error running query
						return console.error('error running query',err);
					}
					res.redirect("admin");
				});
			});
    	}
    }
  })

});