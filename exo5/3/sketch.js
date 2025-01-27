/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];
let classifier;

let state = "prepare to Pierre";
let time = 10;

function preload() {
    // Load the handPose model
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(640, 480);
    // ml5.setBackend("webgl");

    let options = {
        task: 'classification',
        debug: true,
      };
    
    classifier = ml5.neuralNetwork(options);
    
    // Create the webcam video and hide it
    video = createCapture(VIDEO, {flipped: true});
    video.size(640, 480);
    video.hide();
    // start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);
}

function draw() {
    // Draw the webcam video
    image(video, 0, 0, width, height);
    
    // Draw all the tracked hand points
    let centre = {x: 0, y: 0};
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];

        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            centre.x += keypoint.x;
            centre.y += keypoint.y;
            fill(0, 255, 0);
            noStroke();
            circle(width - keypoint.x, keypoint.y, 10);
        }

        averageX = centre.x / hand.keypoints.length;
        averageY = centre.y / hand.keypoints.length;
    
        fill(255, 0, 0);
        noStroke();
        circle(width - averageX, averageY, 20);
    }

    fill(255);
        textSize(32);
        text(state, 10, 20);
        text(time, 10, 50);

    if ((state == "prepare to Pierre") && (time > 0)) {
        
        time--;
    } else if ((state == "prepare to Pierre") && (time <= 0)) {
        state = "Pierre";
        time = 50;
    } else if ((state == "Pierre") && (time > 0)) {
        let inputs = [];

        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - centre.x);
                inputs.push(keypoint.y - centre.y);
            }

            classifier.addData(inputs, [state]);
        }

        time--;
    } else if ((state == "Pierre") && (time <= 0)) {
        state = "prepare to Feuille";
        time = 10;
    } else if ((state == "prepare to Feuille") && (time > 0)) {
        fill(255);
        textSize(32);
        text(state, 10, 20);
        text(time, 10, 50);
        time--;
    } else if ((state == "prepare to Feuille") && (time <= 0)) {
        state = "Feuille";
        time = 50;
    } else if ((state == "Feuille") && (time > 0)) {
        let inputs = [];

        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - centre.x);
                inputs.push(keypoint.y - centre.y);
            }

            classifier.addData(inputs, [state]);
        }

        time--;
    } else if ((state == "Feuille") && (time <= 0)) {
        state = "prepare to Ciseaux";
        time = 10;
    } else if ((state == "prepare to Ciseaux") && (time > 0)) {
        fill(255);
        textSize(32);
        text(state, 10, 20);
        text(time, 10, 50);
        time--;
    } else if ((state == "prepare to Ciseaux") && (time <= 0)) {
        state = "Ciseaux";
        time = 50;
    } else if ((state == "Ciseaux") && (time > 0)) {
        let inputs = [];

        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - centre.x);
                inputs.push(keypoint.y - centre.y);
            }

            classifier.addData(inputs, [state]);
        }

        time--;
    } else if ((state == "Ciseaux") && (time <= 0)) {
        state = "training";
        time = ""
        classifier.normalizeData();
        const trainingOptions = {
            epochs: 100,
            batchSize: 12,
        };
        classifier.train(trainingOptions, finishedTraining);
    } else if (state == "ready") {
        let inputs = [];

        for (let i = 0; i < hands.length; i++) {
            let hand = hands[i];
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                inputs.push(keypoint.x - centre.x);
                inputs.push(keypoint.y - centre.y);
            }
        }

        classifier.predict(inputs, gotResults);
    }
}

function finishedTraining() {
    state = "ready";
}

// Callback function for when handPose outputs data
function gotHands(results) {
    // save the output to the hands variable
    hands = results;
}


function gotResults( result) {
    console.log(result);
    state = result[0].label + " " + result[0].confidence;
    predict();
}