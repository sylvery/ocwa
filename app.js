var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
// router declaration
var standardRouter = express.Router(),
	reportRouter = express.Router();
// route config >> standardRouter
standardRouter.get('/',(req,res)=>{
	console.log('home');
	res.render('index');
})
app.use('/',standardRouter);
// route config >> reportRouter
reportRouter.get('/',(req,res)=>{
	res.redirect('/report/step-1/')
	res.render('templates/report-1')
})
reportRouter.get('/step-1',(req,res)=>{
	res.render('templates/report-1')
})
reportRouter.post('/step-1',(req,res)=>{
	console.log('report form template rendered');
	res.render('templates/report-1',{
		title: "Complainant's Details",
		step: 1
	});
})
reportRouter.post('/step-2',(req,res)=>{
	console.log(req.query);
	res.render('templates/report-2',{
		title: "Complaint Details",
		step: 2,
		stepone: req.query
	})
})
reportRouter.post('/step-3',(req,res)=>{
	console.log(req.query);
	res.render('templates/report-3',{
		title: "Resolution",
		step: 2,
		stepone: req.query
	})
})
reportRouter.post('/step-4',(req,res)=>{
	console.log(req.query);
	res.render('/templates/report-summary', {
		title: 'Summary'
	})
	// res.redirect('/')
})
app.use('/report',reportRouter);
// app configurations
app.use('/css', express.static(__dirname + '/assets/css'));
app.use('/js', express.static(__dirname + '/assets/js'));
app.use('/img', express.static(__dirname + '/assets/img'));
app.set('views',__dirname + '/views');
app.set("view engine",'ejs');
app.listen(port);
console.log('app listening on port',port)