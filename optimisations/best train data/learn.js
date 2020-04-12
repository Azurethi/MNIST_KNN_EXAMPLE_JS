var training = require('../../modules/formatData').loadPreform().train;
var initial = require('./simpleAverage.json');

const helpers = require('../../modules/helpers');
const dist=helpers.dist;

var img_ = initial.img;

function tryNN(testImg){
    var minDist=dist(img_[0], testImg);
    var closest=0;
    for(var i=1;i<img_.length;i++){
        var d = dist(img_[i],testImg);
        if(d<minDist){
            minDist=d;
            closest=i%10;
        }
    }
    return closest;
}

function attempt(){
    var pass = 0, fail = 0;
    training.img.forEach((img,i)=>{
        if(tryNN(img)!=training.lbl[i]){
            fail++;
        } else {
            pass++;
        }
    })
    console.log(`Pass:${pass}, fail: ${fail}`);
    return {pass, fail};
}

function refine(){
    var meanImgs = []
    var numImgs = [0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i<10; i++){
        meanImgs[i]=[];
        for(var j=0; j<784; j++){
            meanImgs[i][j]=0;
        }
    }
    console.log("Calculating mean error");
    training.img.forEach((img,i)=>{
        if(tryNN(img)!=training.lbl[i]){
            numImgs[training.lbl[i]]++;
            for(var j=0; j<784; j++){
                meanImgs[training.lbl[i]][j]=img[j]
            }
        }
    })
    for(var i=0; i<10; i++){
        for(var j=0; j<784; j++){
            meanImgs[i][j]/=numImgs[i];
        }
    }
    return meanImgs;
}

function step(meanImgs,res){
    for(var i=0; i<10; i++){
        for(var j=0; j<784; j++){
            img_[i][j] = (img_[i][j]*res.pass + meanImgs[i][j]*res.fail)/60000;
        }
    }
}


var res = attempt()
var means = refine();
step(means,res);

attempt()   //Gets slightly better with this step, but trying the same thing again just gets worse

