'use strict';
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

module.exports.dist=dist;
module.exports.mc=most_common;