'use strict';
function knn(train, testimg, k){
    var distances = [];
    train.img.forEach((img,i)=>{
        distances.push({i,d:dist(testimg,img)});
    });

    distances.sort((a,b)=>(a.d-b.d));

    var nearest_i = distances.slice(0,k);
    var nearest_lbl = []

    nearest_i.forEach(near=>{
        nearest_lbl.push(train.lbl[near.i]);
    })

    return most_common(nearest_lbl);

}

function knn_opt(train,tests,k,progresscomment){
    var correct = 0;
    for(var tei=0; tei<tests.img.length; tei++){
        var tic = Date.now();
        var distances = [];
        for(var tri=0; tri<train.img.length; tri++){
            distances[tri]=dist(tests.img[tei], train.img[tri]);
        }

        var nearest_lbl=findNKL(distances,train.lbl,k);
        var guess=most_common(nearest_lbl)
        if(guess==tests.lbl[tei]) correct++;
        var toc=Date.now()-tic;
        if(progresscomment) console.log(`Guess:${guess}, Correct:${tests.lbl[tei]}, took:${toc}ms  (${guess==tests.lbl[tei]?"PASS":"fail"}) ${tei} of ${tests.lbl.length} (${tei/tests.lbl.length*100}%)`);
    }
    return correct;
}

function findNKL(dist,lbl,k){
    var min_d = []   //[a,b,c,d,e] a>b>c>d>e  (i)
    //var min_i = []
    var lbls = [];

    for(var i=0; i<k; i++){
        min_d.push(30000000);
        //min_i.push(0);
        lbls.push(-1);
    }

    for(var i=0; i<dist.length; i++){
        if(dist[i]<min_d[min_d.length-k]){
            mincheck:for(var ci=1; ci<=k; ci++){
                if(dist[i]<min_d[min_d.length-ci]){
                    min_d.splice(min_d.length-ci+1, 0, dist[i]);
                    //min_i.splice(min_d.length-ci+1, 0, i);
                    lbls.splice(min_d.length-ci+1, 0, lbl[i]);
                    break mincheck;
                }
            }
            if(min_d.length>k){
                min_d.shift();
                //min_i.shift();
                lbls.shift();
            }
        }
    }

    return lbls;
}

function dist(imgA, imgB){
    var d=0.0;
    imgA.forEach((a,i)=>{
        d+=Math.pow(imgB[i]-a,2)
    });
    return Math.sqrt(d);
}

function most_common(list){
    var counter=[0,0,0,0,0,0,0,0,0,0];
    list.forEach(c=>{counter[c]++;})

    var max_v=counter[0];
    var max_i=0;
    counter.forEach((v,i)=>{
        if(v>max_v){
            max_v=v;
            max_i=i;
        }
    })
    return max_i;
}

module.exports.knn=knn
module.exports.knn_opt=knn_opt
