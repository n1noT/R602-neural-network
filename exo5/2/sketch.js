/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */

let video;
let bodyPose;
let poses = [];
let connections;
let balls = [];
let rect

function preload() {
    // Load the bodyPose model
    bodyPose = ml5.bodyPose("BlazePose");
}

function setup() {
    createCanvas(640, 480);

    // Create the video and hide it
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Start detecting poses in the webcam video
    bodyPose.detectStart(video, gotPoses);
    // Get the skeleton connection information
    connections = bodyPose.getSkeleton();
}

function draw() {
    // Draw the webcam video
    image(video, 0, 0, width, height);

    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
        let rightArm = gotRightArm(pose);

        for (let j = 0; j < rightArm.length; j++) {
            let keypoint = rightArm[j];
            // Only draw a circle if the keypoint's confidence is bigger than 0.1
            if (keypoint.confidence > 0.1) {
                fill(0, 255, 0);
                noStroke();
                circle(keypoint.x, keypoint.y, 10);
            }
        }
    }


    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
        let rightArm = gotRightArm(pose);
        for (let j = 0; j < connections.length; j++) {
            let wrist = rightArm[0];
            let elbow = rightArm[1];
            let shoulder = rightArm[2];

            if (wrist.confidence > 0.1 && elbow.confidence > 0.1 && shoulder.confidence > 0.1) {
                stroke(255, 0, 0);
                strokeWeight(2);
                line(wrist.x, wrist.y, elbow.x, elbow.y);
                line(elbow.x, elbow.y, shoulder.x, shoulder.y);
            }
        }
    }

    if(poses.length > 0){
        let pose = poses[0];
        let rightArm = gotRightArm(pose);
        let wrist = rightArm[0];
        let elbow = rightArm[1];
        let shoulder = rightArm[2];

        if (wrist.confidence > 0.1 && elbow.confidence > 0.1 && shoulder.confidence > 0.1) {
            shoulderElbow = dist(shoulder.keypoint3D.x, shoulder.keypoint3D.y, shoulder.keypoint3D.z, elbow.keypoint3D.x, elbow.keypoint3D.y, elbow.keypoint3D.z);
            elbowWrist = dist(elbow.keypoint3D.x, elbow.keypoint3D.y, elbow.keypoint3D.z, wrist.keypoint3D.x, wrist.keypoint3D.y, wrist.keypoint3D.z);
            shoulderWrist = dist(shoulder.keypoint3D.x, shoulder.keypoint3D.y, shoulder.keypoint3D.z, wrist.keypoint3D.x, wrist.keypoint3D.y, wrist.keypoint3D.z);

            // Ratio of the arm
            let ratioBrut = shoulderWrist / (shoulderElbow + elbowWrist);

            let ratio = map(ratioBrut, 0.6, 1, 0, 1);

            let rectY = height * ratio;
            if(rectY > height){
                rectY = height;
            }
            if(rectY < 0){
                rectY = 0;
            }
            fill(0, 0, 255);
            noStroke();
            circle(25, 0, 50, 50);
        }
    }
}

function gotRightArm(pose) {
    let rightArm = [];

    rightArm.push(pose.right_wrist);
    rightArm.push(pose.right_elbow);
    rightArm.push(pose.right_shoulder);

    return rightArm;
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
    // Save the output to the poses variable
    poses = results;
}
