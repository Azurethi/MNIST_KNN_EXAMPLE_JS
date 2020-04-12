'use strict';
console.log("Optimisation: best train");

var train = require('../../modules/formatData').loadPreform().train;
console.log("> loaded data");

var meanImgs = []
var SDImgs = []
var numImgs = [0,0,0,0,0,0,0,0,0,0];
for(var i=0; i<10; i++){
    meanImgs[i]=[];
    SDImgs[i]=[];
    for(var j=0; j<784; j++){
        meanImgs[i][j]=0;
        SDImgs[i][j]=0;
    }
}


console.log("> Initialised");

for(var i=0; i<train.img.length; i++){
    numImgs[train.lbl[i]]++;
    for(var j=0; j<784; j++){
        meanImgs[train.lbl[i]][j]+=train.img[i][j];
    }
}
for(var i=0; i<10; i++){
    for(var j=0; j<784; j++){
        meanImgs[i][j]/=numImgs[i];
    }
}
console.log("> calculated means");


for(var i=0; i<train.img.length; i++){
    for(var j=0; j<784; j++){
        SDImgs[train.lbl[i]][j]+=Math.pow(train.img[i][j]-meanImgs[train.lbl[i]][j], 2);
    }
}

for(var i=0; i<10; i++){
    for(var j=0; j<784; j++){
        SDImgs[i][j]= Math.sqrt(SDImgs[i][j]/(numImgs[i]-1))
    }
}
console.log("> calculated Standard Dev");

//helper functions
const dist = require('../../modules/helpers').dist;

function mam(arr){
    var min = arr[0];
    var avg = arr[0];
    var max = arr[0];
    for(var i=1; i<arr.length;i++){
        avg+=arr[i];
        if(arr[i]>max) max = arr[i];
        if(arr[i]<min) min = arr[i];
    }
    return {
        min, max, avg: avg/arr.length
    }
}

//OUTPUT
console.log("---------------------------------------")
console.log(`In training set: ${JSON.stringify(numImgs)}`);
console.log(`Mean distances: `)
var dists = [];
for(var i=0; i<10; i++){
    for(var j=i+1; j<10; j++){
        var d=dist(meanImgs[i], meanImgs[j])
        console.log(`\t[${i} -> ${j}] => ${d}`);
        dists.push(d);
    }
}
var m = mam(dists);
console.log(`\tmin: ${m.min}, Max:${m.max}, avg: ${m.avg}`)

console.log("Sdevs: min, max, avg")
for(var i=0; i<10; i++){
    var m = mam(SDImgs[i]);
    console.log(`${i}: ${m.min}, ${m.max}, ${m.avg}`)
}

require('fs').writeFileSync(`${__dirname}/simpleAverage.json`, JSON.stringify({img:meanImgs, lbl:[0,1,2,3,4,5,6,7,8,9]}));
//Conclusion: Standard deviations are much less than average distance between clusters
// -> so should allow accurate testing on only averaged images?
/* Running with this simple averaged set yields a huge speed increase but only 82.03% (previously 96.73%)
    ** Note: this is also only 80 accurate for the training set
        -> Use the training set to tweak the mean values?
--------------
FINISHED BTT (Simple average)
--------------
	Training set size: 10
	Test set size: 10000
	Correct: 8203
	took 10067ms
    Overall accuracy: 82.03% 
    
--------------
FINISHED BTT
--------------
	Training set size: 10
	Test set size: 60000 (testing against training set)
	Correct: 48479
	took 46108ms
	Overall accuracy: 80.8%*/

