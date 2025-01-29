/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates face tracking on live video through ml5.faceMesh.
 */

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let classifier;

function preload() {
    // Load the faceMesh model
    faceMesh = ml5.faceMesh(options);
    classifier = ml5.neuralNetwork({
        task: 'classification',
        debug: true,
      }
    );
}

function setup() {
    createCanvas(640, 480);
    // Create the webcam video and hide it
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    // Start detecting faces from the webcam video
    faceMesh.detectStart(video, gotFaces);
}

function draw() {
    // Draw the webcam video
    image(video, 0, 0, width, height);

    let squareSize = 40;
    // Draw all the tracked face points
    let face = faces[0];
    if (face && face.leftEye) {
        noFill()
        stroke(0, 255, 0);
        let mid = createVector(face.leftEye.centerX, face.leftEye.centerY);
        rect(
            mid.x - squareSize / 2,
            mid.y - squareSize / 2,
            squareSize,
            squareSize
        )

        let img = createImage(video.width, video.height);
        img.copy(
            video, 
            0, 
            0, 
            mid.x - squareSize / 2,
            mid.y - squareSize / 2,
            0, 
            0, 
            squareSize,
            squareSize
        );
        classifier.classify(img, gotResults);
    }
}

function gotResults(err, results) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(results);

    return results;
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
    // Save the output to the faces variable
    faces = results;
}
