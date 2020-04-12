'use strict'
const knn_core = require('./modules/knn');
const knn = knn_core.knn;
const knn_opt = knn_core.knn_opt;

function basic_test(train_set, test_set,progresscomment=true){
    console.log("Starting basic test");
    var data = require('./modules/formatData').load(train_set, test_set);
    console.log("Loaded data")

    var guesses=0, correct=0, ttime=0;
    var tic = Date.now();
    for(var tryi=0; tryi<test_set; tryi++){
        var tic_i = Date.now();
        var guess = knn(data.train, data.test.img[tryi], 5)
        var toc_i = Date.now()-tic_i;
        guesses++
        ttime+=toc_i;
        if(guess==data.test.lbl[tryi]) correct++;
        if(progresscomment) console.log(`Guess:${guess}, Correct:${data.test.lbl[tryi]}, took:${toc_i}ms  (${guess==data.test.lbl[tryi]?"PASS":"fail"}) ${tryi} of ${test_set} (${tryi/test_set*100}%)`);
    }
    var toc = Date.now()-tic;
    console.log(`--------------\nFINISHED BASIC\n--------------`);
    console.log(`\tTraining set size: ${train_set}\n\tTest set size: ${test_set}`);
    console.log(`\tCorrect: ${correct}\n\ttook ${toc}ms (${ttime}ms proc)\n\tOverall accuracy: ${correct/guesses*100}%`)
}

function opt_test(progresscomment=true){
    console.log("Starting opt test");
    var data = require('./modules/formatData').loadPreform();
    console.log("Loaded data")

    var tic = Date.now();
    var correct= knn_opt(data.train,data.test,5,progresscomment);
    var toc = Date.now()-tic;

    console.log(`--------------\nFINISHED OPT\n--------------`);
    console.log(`\tTraining set size: 60000\n\tTest set size: 10000`);
    console.log(`\tCorrect: ${correct}\n\ttook ${toc}ms\n\tOverall accuracy: ${correct/10000*100}%`)
    
}

function best_train_test(){
    console.log("Starting BTT test");
    var data = require('./modules/formatData').loadPreform();

    var betterTrain = require('./optimisations/best train data/simpleAverage.json');

    console.log("Loaded data");

    var tic = Date.now();
    var correct= knn_opt(
        betterTrain,//data.train,
        data.train,
        1,
        true
    );
    var toc = Date.now()-tic;

    console.log(`--------------\nFINISHED BTT\n--------------`);
    console.log(`\tTraining set size: 60000\n\tTest set size: 10000`);
    console.log(`\tCorrect: ${correct}\n\ttook ${toc}ms\n\tOverall accuracy: ${correct/10000*100}%`)
}

//basic_test(60000,10,true);
opt_test(60000,10000,true);
//best_train_test()

/*Output:
 * --------------
 * FINISHED OPT
 * --------------
 *     Training set size: 60000
 *     Test set size: 10000
 *     Correct: 9673
 *     took 2131506ms               //~200ms per query
 *     Overall accuracy: 96.73%
 */