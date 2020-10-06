var express=require('express')
var bodyParser=require('body-parser')
var object=require('mongodb').object;
var app=express()
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;
//connecting server file for AWT
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');

const url='mongodb://127.0.0.1:27017';
const dbname='Hospital_Management';
let db

MongoClient.connect(url,{useUnifiedTopology:true},(err,client) =>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`Connected Database:${url}`);
    console.log(`Database:${dbname}`);
})

//app.use(express.json());
app.get('/hospitaldetails',middleware.checkToken,(req,res) =>{ //fetching hospital details
    console.log('FETCHING HOSPITAL DETAILS FROM HOSPITAL_DETAILS');
    var data=db.collection('hospital').find().toArray().then(result => res.json(result));
})

app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{ //fetching ventilator details
    console.log('FETCHING VENTILATORS DETAILS FROM VENTILATOR_DETAILS');
    var data=db.collection('ventilators').find().toArray().then(result=> res.json(result));
})

app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{ //searching ventilator by status
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilators').find({"status" : status}).toArray().then(result => res.json(result));
})

app.post('/searchventbyname',middleware.checkToken,(req,res) =>{ //searching ventilator by hosp name
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilators').find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
})

app.post('/searchbyname',middleware.checkToken,(req,res)=>{ //searching hospital by name
    var name=req.query.name;
    console.log(name);
    var data=db.collection('hospital').find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
})


app.put('/updateventilator',middleware.checkToken,(req,res)=>{ //update ventilator details
    var ventid={ventilatorId : req.body.ventilatorId};
    console.log(ventid);
    var newvalue={$set: {status:req.body.status}};
    db.collection('ventilators').updateOne(ventid,newvalue,function(err,result){
        res.send('1 document updated');
        if(err) throw err;
        //console.log('updated');
    })
})


app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{ //add ventilators
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hId:hId,ventilatorId:ventilatorId,status:status,name:name
    };
    db.collection('ventilators').insertOne(item,function(err,result){
        res.json('Item inserted');
    })
})


app.delete('/delete',middleware.checkToken,(req,res)=>{ //delete ventilators
    var myquery=req.query.ventilatorId;
    console.log(myquery);
    var myquery1={ventilatorId:myquery};
    db.collection('ventilators').deleteOne(myquery1,function(err,obj){
        res.json("Document deleted")
        if(err) throw err;
    })
})
app.listen(3000,function(){
    console.log('server started');
})