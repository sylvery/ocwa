var express = require('express'),
router = express.Router(),
app = express(),
bodyParser = require('body-parser'),
session = require('express-session'),
morgan = require('morgan'),
fs = require('fs'),
port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
app.use(session({
	secret: "monobelle",
	resave: true,
	saveUninitialized: true,
	cookie: {secure: true},
}));

app.use((req,res,next)=>{
	// all requests pass thru this middleware function before proceeding to the next funtion
	var formdata = req.session.formdata, 
		summary = {};
	if(!formdata) { formdata = req.session.formdata = {}; }
	if (formdata.complainant) {
		summary.complainant = formdata.complainant;
		console.log("+++summary",summary);
	}
	if (formdata.complaint) {
		summary.complaint = formdata.complaint;
		console.log("+++summary",summary);
	}
	if (formdata.resolution) {
		summary.resolution = formdata.resolution;
		console.log("+++summary",summary);
	}
	// formdata = summary;
	console.log("++ Form Data",formdata)
	// views[pathname] = (views[pathname] || 0) + 1;
	next();
})
// route config >> router
router.get('/',(req,res)=>{
	console.log('===================================');
	console.log('++ path',req.route.path);
	console.log('===================================');
	res.render('index',{
		title: "Home"
	});
})
app.use('/',router);
// route config >> router
router.get('/',(req,res)=>{
	res.redirect('/report/step-1/')
});
router.get('/step-1',(req,res)=>{
	console.log('formdata',req.session)
	res.render('templates/reports.tpl.ejs',{
		title: "Section A - Complainant's (Your) Details",
		action: "/report/step-1",
		method: "POST",
		fields: [
	    {name:'complainantFullName',label:'Full Name',type:'text',property:'required',placeholder:"eg: Hawksbill Orange"},
	    {name:'complainantEmail',label:'Email',type:'email',property:'required',placeholder:"eg: Hawksbill.Orange@savetheturtles.com.pg"},
	    {name:'complainantAddress',label:'Address',type:'text',property:'required',placeholder:"eg: Section: 297, Allotment: 6 - Lae MP"},
	    {name:'complainantEmployer',label:'Where do you work?',type:'text',property:'required',placeholder:"eg: Labu Turtles Inc"},
	    {name:'complainantRelative',label:'Relative we can contact when you are not available',type:'text',property:'required',placeholder:"eg: Leatherback Black - 7222 2102, Mare Muddy Crabs Investments, Lae MP"},
		],
		btnLabel:"Next Section",
		reqdata: {
			req: req.session.formdata
		}
	})
})
router.post('/step-1',(req,res)=>{
	req.session.formdata.complainant = {
		complainantFullName : req.body.complainantFullName,
		complainantEmail : req.body.complainantEmail,
		complainantAddress : req.body.complainantAddress,
		complainantEmployer : req.body.complainantEmployer,
		complainantRelative : req.body.complainantRelative,
	};
	// req.session.save((err,data)=>{
		// if(!err) console.log('data',data);
		// else console.log('err',err);
	// })
	console.log('formdata',req.session)
	res.render('templates/reports.tpl.ejs',{
		title: "Section B - Details of Complaint",
		method: "POST",
		action: "/report/step-2",
		fields: [
	    {name:'complaintOrganization',label:'Department/Statutory Body/Agency etc you are complaining against',type:'text',property:'required',placeholder:"eg: National Sea & Oceans Organization"},
	    {name:'complaintPersonName',label:'Full name of person(s) conduct you are complaining against',type:'text',property:'required',placeholder:"eg: Free Willie"},
	    {name:'complaintPersonTitle',label:'Title of person(s) conduct you are complaining against',type:'text',property:'required',placeholder:"eg: Accounts Clerk"},
	    {name:'complaintProvince',label:'Province where incident occured',type:'text',property:'required',placeholder:"eg: Morobe Province"},
	    {name:'complaintDate',label:'Date incident occured',type:'date',property:'required',placeholder:"eg: 24th January 2000"},
	    {name:'complaintSubject',label:'What\'s the subject of your complaint?',type:'text',property:'required',placeholder:"eg: Leatherback Black - 7222 2102, Mare Muddy Crabs Investments, Lae MP"},
	    {name:'complaintDetails',label:'Describe the incident in detail here',type:'text',property:'required',placeholder:"eg: Leatherback Black - 7222 2102, Mare Muddy Crabs Investments, Lae MP"},
		],
		btnLabel:"Next Section",
		reqdata: {
			req: req.session.formdata
		}
	})
})
router.post('/step-2',(req,res)=>{
	req.session.formdata.complaint = {
		complaintOrganization : req.body.complaintOrganization,
		complaintPersonName : req.body.complaintPersonName,
		complaintPersonTitle : req.body.complaintPersonTitle,
		complaintProvince : req.body.complaintProvince,
		complaintDate : req.body.complaintDate,
		complaintSubject : req.body.complaintSubject,
		complaintDetails : req.body.complaintDetails,
	};
	console.log('formdata',req.session)
	res.render('templates/reports.tpl.ejs',{
		title: "Section C - Details of Complaint",
		method: "POST",
		action: "/report/step-3",
		fields: [
	    {name:'resolutionWitnessName',label:'Witness Full Name',type:'text',property:'required',placeholder:"eg: Silver Dugong"},
	    {name:'resolutionWitnessName',label:'Witness Contact',type:'text',property:'required',placeholder:"eg: mobile: 7291 4829, email: sdugong@freefish.com"},
	    {name:'resolutionEvidence',label:'Evidence and Supporting Details',type:'file',property:'required',placeholder:"Upload evidence/supporting documents"},
	    {name:'resolutionOmbudsman',label:'What do you want Ombudsman Commision to do?',type:'text',property:'required',placeholder:"eg: Take the Organization to court"},
	    {name:'resolutionActionsTaken',label:'What actions have you taken to remedy (solve) this complaint before approaching Ombudsman Commission?',type:'text',property:'required',placeholder:"eg: Reported them to the police."},
	    {name:'resolutionActionsTaken',label:'What actions have you taken to remedy (solve) this complaint before approaching Ombudsman Commission?',type:'text',property:'required',placeholder:"eg: Reported them to the police."},
		],
		btnLabel:"View Summary Of Complaint",
		reqdata: {
			req: req.session.formdata
		}
	})
})
router.post('/step-3',(req,res)=>{
	console.log(req.query);
	res.render('templates/report-summary',{
		title: "Summary of Complaint",
		contents: req.session.formdata
	})
})
router.post('/step-4',(req,res)=>{
	console.log(req.query);
	res.render('/templates/report-summary', {
		title: 'Summary'
	})
	// res.redirect('/')
})
router.get('/test',(req,res)=>{
	res.render('templates/reports.tpl.ejs', {
    title: "Login", //page title
    action: "/login", //post action for the form
    fields: [
	    {name:'email',type:'text',property:'required'},   //first field for the form
	    {name:'password',type:'password',property:'required'}   //another field for the form
    ]
  });
})
app.use('/report',router);
// app configurations
app.use('/css', express.static(__dirname + '/assets/css'));
app.use('/js', express.static(__dirname + '/assets/js'));
app.use('/img', express.static(__dirname + '/assets/img'));
app.set('views',__dirname + '/views');
app.set("view engine",'ejs');
app.listen(port);
console.log('app listening on port',port)