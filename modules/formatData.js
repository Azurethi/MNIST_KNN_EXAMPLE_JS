'use strict';
const mnist = require('mnist-data');

exports.load=(train_i, test_i)=>{
    var tic = Date.now();
    var tr_raw=mnist.training(0, train_i)    //max 60000
    var te_raw=mnist.testing(0, test_i);      //max 10000
    var toc = Date.now()-tic;
    console.log(`data loaded, took:${toc}`);
    var tic = Date.now();
    var train_img = [], train_lbl = [], test_img = [], test_lbl = [];

    for(var tr_i=0; tr_i<train_i; tr_i++){
        var img = [];
        for(var img_i=0; img_i<28; img_i++){
            for(var img_j=0; img_j<28; img_j++){
                img.push(tr_raw.images.values[tr_i][img_i][img_j]);
            }
        }
        train_img.push(img);
        train_lbl.push(tr_raw.labels.values[tr_i]);
    }

    for(var te_i=0; te_i<test_i; te_i++){
        var img = [];
        for(var img_i=0; img_i<28; img_i++){
            for(var img_j=0; img_j<28; img_j++){
                img.push(te_raw.images.values[te_i][img_i][img_j]);
            }
        }
        test_img.push(img);
        test_lbl.push(te_raw.labels.values[te_i]);
    }

    var toc = Date.now()-tic;
    console.log(`data formatted, took:${toc}`);
    return {
        train:{
            img:train_img,
            lbl:train_lbl
        },
        test:{
            img:test_img,
            lbl:test_lbl
        }
    }
}

exports.preform=()=>{
    var train_set = 60000;
    var test_set = 10000;
    var fs = require('fs');
    var data = exports.load(train_set, test_set);
    fs.writeFileSync(`${__dirname}/pre-form.json`,JSON.stringify(data));
}

exports.loadPreform=()=>{
    return require('./pre-form.json');
}