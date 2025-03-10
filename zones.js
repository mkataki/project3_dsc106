document.addEventListener("DOMContentLoaded", function () {
    const zones = document.querySelectorAll(".zone");
    const zoneTitle = document.getElementById("zone-title");
    const zoneDescription = document.getElementById("zone-description");
    const marioGif = document.getElementById("marioGif");
    const startQuizButton = document.getElementById("start-quiz-button");

    const zoneData = {
        "zone1": {
            title: "Zone 1 – Recovery (50-60%)",
            description: "Purpose: Recovery, warm-ups, and cool-downs. Improves circulation and muscle recovery. Feels easy, like a slow walk."
        },
        "zone2": {
            title: "Zone 2 – Fat Burning (60-70%)",
            description: "Purpose: Weight loss and endurance building. Uses fat as fuel, improves aerobic capacity, and strengthens the heart. Feels like a brisk walk or light jog."
        },
        "zone3": {
            title: "Zone 3 – Endurance Training (70-80%)",
            description: "Purpose: Improves cardiovascular fitness and aerobic power. Great for marathon training. Feels like a steady run."
        },
        "zone4": {
            title: "Zone 4 – Speed & Performance (80-90%)",
            description: "Purpose: Improves lactate threshold and high-speed endurance. Increases speed and performance for sports. Feels hard, like sprinting short distances."
        },
        "zone5": {
            title: "Zone 5 – Maximum Effort (90-100%)",
            description: "Purpose: High-intensity sprinting for power. Used for short bursts of effort. Feels like an all-out sprint, difficult to sustain for long."
        }
    };

    zones.forEach(zone => {
        zone.addEventListener("click", function () {
            let zoneId = this.classList[1]; // Get zone class name (e.g., "zone1", "zone2")
            let speed = parseInt(this.dataset.speed);

            // Update zone title and description
            if (zoneData[zoneId]) {
                zoneTitle.textContent = zoneData[zoneId].title;
                zoneDescription.textContent = zoneData[zoneId].description;
            }

            // Change Mario's speed
            let animationSpeed = Math.max(2, 12 - speed); // Prevents disappearing issue
            marioGif.style.animation = `run-animation ${animationSpeed}s infinite linear`;

            // Highlight the selected zone
            zones.forEach(z => z.classList.remove("highlight"));
            this.classList.add("highlight");
        });
    });

    // Redirect to quiz page when "Start Quiz" is clicked
    startQuizButton.addEventListener("click", function () {
        window.location.href = "quiz.html";
    });
});
