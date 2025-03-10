let dataset = [];
document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");

    if (startButton) {
        startButton.addEventListener("click", function () {
            document.getElementById("intro-screen").classList.add("fade-out");
            setTimeout(() => {
                window.location.href = "zones.html";  // Redirect to the Heart Rate Zone explanation page
            }, 1000);
        });
    }
});


// Function to remove duplicates by ID
function removeDuplicatesByID(data) {
    const uniqueData = [];
    const seenIDs = new Set();

    data.forEach(row => {
        if (!seenIDs.has(row.ID)) {
            seenIDs.add(row.ID);
            uniqueData.push(row);
        }
    });

    return uniqueData;
}

// Load CSV file using D3.js
d3.csv("dataclean.csv", function(row) {
    return {
        time: +row.time,
        speed: +row.Speed,
        HR: +row.HR,
        VO2: +row.VO2,
        VCO2: +row.VCO2,
        RR: +row.RR,
        VE: +row.VE,
        ID: row.ID,
        age: +row.Age,
        weight: +row.Weight,
        height: +row.Height,
        humidity: +row.Humidity,
        temperature: +row.Temperature,
        gender: +row.Sex
    };
}).then(data => {
    dataset = data;
    console.log("CSV loaded successfully! Dataset:", dataset);
}).catch(error => {
    console.error("Error loading CSV file:", error);
    alert("Failed to load CSV file. Please check the console for details.");
});

// Function to update speed label dynamically
function updateSpeedLabel() {
    let speed = document.getElementById("speed").value;
    document.getElementById("speedValue").textContent = speed + " km/h";
}

// Function to predict HR based on bins and speed
function predictHeartRate() {
    const speed = parseFloat(document.getElementById("speed").value);
    const age = parseInt(document.getElementById("age").value);
    const gender = parseInt(document.getElementById("gender").value);

    let maxHR = gender === 0 ? 211 - (0.64 * age) : 210 - (0.67 * age);

    let basePercentage = 50;
    let speedAdjustment = (speed - 3) * 5;
    let percentageHR = Math.min(basePercentage + speedAdjustment, 95);

    let estimatedHR = Math.round((maxHR * percentageHR) / 100);
    document.getElementById("predictedHR").textContent = estimatedHR + " bpm";

    let zone = "";
    if (percentageHR < 60) zone = "zone1";
    else if (percentageHR < 70) zone = "zone2";
    else if (percentageHR < 80) zone = "zone3";
    else if (percentageHR < 90) zone = "zone4";
    else zone = "zone5";

    document.getElementById("zoneDisplay").textContent = document.getElementById(zone).textContent;
    highlightZone(zone);
}

// Function to highlight the correct HR zone box
function highlightZone(activeZone) {
    const zones = document.querySelectorAll(".zone");
    const descriptions = document.querySelectorAll(".zone-info");

    zones.forEach(zone => {
        if (zone.id === activeZone) {
            zone.classList.add("highlight"); // Highlight active zone
        } else {
            zone.classList.remove("highlight"); // Remove highlight from other zones
        }
    });

    descriptions.forEach(desc => {
        if (desc.id === `info-${activeZone}`) {
            desc.style.display = "block"; // Show correct description
        } else {
            desc.style.display = "none"; // Hide other descriptions
        }
    });
}


// Keep track of the running state
let lastSpeed = 5;
let marioGif = document.getElementById("marioGif");

// Function to smoothly update animation speed without restarting
document.getElementById("speed").addEventListener("input", function () {
    let speed = parseFloat(this.value);

    if (speed !== lastSpeed) { 
        let newDuration = 8 - (speed - 3) * 0.5;
        marioGif.style.animationDuration = `${newDuration}s`;
    }

    lastSpeed = speed;
    document.getElementById("speedValue").textContent = speed + " km/h";
});

// Function to update Mario/Peach based on gender selection
document.getElementById("gender").addEventListener("change", function () {
    if (this.value === "1") {
        marioGif.src = "peach.gif";
        marioGif.style.transform = "scaleX(-1)";
    } else {
        marioGif.src = "mario.gif";
        marioGif.style.transform = "scaleX(1)";
    }
});

// Automatically update HR and zones when speed slider changes
document.getElementById("speed").addEventListener("input", function () {
    updateSpeedLabel();
    predictHeartRate();
});

// Function to update animation speed based on slider
document.getElementById("speed").addEventListener("input", function () {
    let speed = parseFloat(this.value);
    let animationSpeed = 6 - (speed - 3) * 0.2; // Adjusting speed dynamically

    let marioGif = document.getElementById("marioGif");
    marioGif.style.animation = `run-animation ${animationSpeed}s infinite linear`;

    document.getElementById("speedValue").textContent = speed + " km/h";
});

// Function to update Mario/Peach based on gender selection
document.getElementById("gender").addEventListener("change", function () {
    let marioGif = document.getElementById("marioGif");

    if (this.value === "1") { // Female selected
        marioGif.src = "peach.gif"; // Change to Peach
        marioGif.style.transform = "scaleX(-1)"; // Flip horizontally
    } else { // Male selected
        marioGif.src = "mario.gif"; // Change back to Mario
        marioGif.style.transform = "scaleX(1)"; // Restore normal orientation
    }
});