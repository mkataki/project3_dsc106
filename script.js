d3.csv('dataclean.csv').then(function(data) {
    // Convert necessary columns to numeric
    data.forEach(function(d) {
        d.HR = +d.HR;
        d.Age = +d.Age;
        d.Weight = +d.Weight;
        d.Height = +d.Height;
        d.Sex = +d.Sex; // 0 = Female, 1 = Male
    });

    const ageRanges = [
        { label: "10-19", min: 10, max: 19 },
        { label: "20-29", min: 20, max: 29 },
        { label: "30-39", min: 30, max: 39 },
        { label: "40-49", min: 40, max: 49 },
        { label: "50-63", min: 50, max: 63 },
    ];

    // Populate age range dropdown
    const ageRangeSelect = document.getElementById("ageRange");
    ageRanges.forEach(range => {
        const option = document.createElement("option");
        option.value = range.label;
        option.text = range.label;
        ageRangeSelect.appendChild(option);
    });

    // Populate gender dropdown
    const genderSelect = document.getElementById("gender");
    const genders = ["Male", "Female", "All"];
    genders.forEach(gender => {
        const option = document.createElement("option");
        option.value = gender;
        option.text = gender;
        genderSelect.appendChild(option);
    });

    function updateChart() {
        const ageRange = document.getElementById("ageRange").value;
        const genderInput = document.getElementById("gender").value;
        const enteredHR = parseFloat(document.getElementById("HRInput").value);
    
        const selectedRange = ageRanges.find(range => range.label === ageRange);
        const ageMin = selectedRange.min;
        const ageMax = selectedRange.max;
    
        let filteredData = data.filter(d => d.Age >= ageMin && d.Age <= ageMax && !isNaN(d.HR));
    
        if (genderInput !== "All") {
            const genderValue = genderInput === "Male" ? 1 : 0;
            filteredData = filteredData.filter(d => d.Sex === genderValue);
        }
    
        if (filteredData.length === 0) {
            alert(`No data available for Age range: ${ageRange}`);
            return;
        }
    
        const meanHR = d3.mean(filteredData, d => d.HR);
        const stdDevHR = d3.deviation(filteredData, d => d.HR);
    
        document.getElementById("stats").innerHTML = `
            <p><strong>Mean Heart Rate for ${ageRange} (${genderInput}):</strong> ${meanHR.toFixed(2)} BPM</p>
            <p><strong>Standard Deviation:</strong> ${stdDevHR.toFixed(2)} BPM</p>
        `;
    
        const metricData = filteredData.map(d => d.HR);
        const bins = d3.bin().thresholds(20)(metricData);
    
        const svg = d3.select("#chart");
        svg.selectAll("*").remove();
    
        const margin = { top: 100, right: 30, bottom: 60, left: 70 };
        const width = svg.attr("width") - margin.left - margin.right;
        const height = svg.attr("height") - margin.top - margin.bottom;
    
        const xScale = d3.scaleLinear()
            .domain([d3.min(metricData), d3.max(metricData)])
            .range([0, width]);
    
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);
    
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    
        g.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
            .attr("height", d => height - yScale(d.length))
            .attr("fill", "pink")
            .attr("opacity", 0.7);
    
        g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
        g.append("g").call(d3.axisLeft(yScale));
    
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(`Heart Rate (BPM) Distribution`);
    
        // **Plot Mean HR Line**
        const meanX = xScale(meanHR);
        g.append("line")
            .attr("class", "mean-line")
            .attr("x1", meanX)
            .attr("y1", height)
            .attr("x2", meanX)
            .attr("y2", 0)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");
    
        g.append("text")
            .attr("x", meanX)
            .attr("y", -25)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "blue")
            .text(`Mean: ${meanHR.toFixed(2)}`);
    
        if (!isNaN(enteredHR)) {
            const customX = xScale(enteredHR);
            g.append("line")
                .attr("class", "highlight-line")
                .attr("x1", customX)
                .attr("y1", height)
                .attr("x2", customX)
                .attr("y2", 0)
                .attr("stroke", "deeppink")
                .attr("stroke-width", 2);
    
            g.append("text")
                .attr("x", customX)
                .attr("y", -45)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "deeppink")
                .text(`You: ${enteredHR}`);
        }
    }
    
    function updateHRZones() {
        const age = parseInt(document.getElementById("ageInput").value);
        const enteredHR = parseFloat(document.getElementById("HRInput").value);
    
        if (isNaN(age) || age <= 0) {
            alert("Please enter a valid age.");
            return;
        }
    
        const maxHR = 220 - age;
        const zones = {
            fatBurnZone: [maxHR * 0.5, maxHR * 0.7],
            cardioZone: [maxHR * 0.7, maxHR * 0.85],
            peakZone: [maxHR * 0.85, maxHR * 1.0]
        };
    
        // Select or create message div
        let messageDiv = document.getElementById("hrZoneMessage");
        if (!messageDiv) {
            messageDiv = document.createElement("div");
            messageDiv.id = "hrZoneMessage";
            document.body.appendChild(messageDiv);
        }
    
        // Determine user's HR zone
        let hrZoneMessage = "";
        if (!isNaN(enteredHR)) {
            if (enteredHR >= zones.fatBurnZone[0] && enteredHR < zones.fatBurnZone[1]) {
                hrZoneMessage = `<p style="color: green;"><strong>You are in the Fat Burn Zone!</strong></p>`;
            } else if (enteredHR >= zones.cardioZone[0] && enteredHR < zones.cardioZone[1]) {
                hrZoneMessage = `<p style="color: orange;"><strong>You are in the Cardio Zone!</strong></p>`;
            } else if (enteredHR >= zones.peakZone[0] && enteredHR <= zones.peakZone[1]) {
                hrZoneMessage = `<p style="color: red;"><strong>You are in the Peak Zone!</strong></p>`;
            }
        }
        messageDiv.innerHTML = hrZoneMessage; // Update message
    
        // ** Update Graph with Zones **
        const svg = d3.select("#chart");
        svg.selectAll(".hr-zone").remove(); // Remove old zones
    
        const margin = { top: 100, right: 30, bottom: 60, left: 70 };
        const width = svg.attr("width") - margin.left - margin.right;
        const height = svg.attr("height") - margin.top - margin.bottom;
    
        const xScale = d3.scaleLinear()
            .domain([0, maxHR])
            .range([0, width]);
    
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Select or create a div to display clicked HR zone range
        let zoneInfoDiv = document.getElementById("zoneInfo");
        if (!zoneInfoDiv) {
            zoneInfoDiv = document.createElement("div");
            zoneInfoDiv.id = "zoneInfo";
            document.body.appendChild(zoneInfoDiv);
        }
    
        function addZone(zone, bgColor, textColor, label, yOffset, range) {
            const rect = g.append("rect")
                .attr("class", "hr-zone")
                .attr("x", xScale(zone[0]))
                .attr("y", 0)
                .attr("width", xScale(zone[1]) - xScale(zone[0]))
                .attr("height", height)
                .attr("fill", bgColor)  // Background color
                .attr("opacity", 0.3)
                .style("cursor", "pointer")  // Make it clickable
                .on("click", function () {  
                    // Show HR range when the zone is clicked
                    let zoneInfoDiv = document.getElementById("zoneInfo");
                    if (!zoneInfoDiv) {
                        zoneInfoDiv = document.createElement("div");
                        zoneInfoDiv.id = "zoneInfo";
                        document.body.appendChild(zoneInfoDiv);
                    }
                    zoneInfoDiv.innerHTML = `<p style="color: ${textColor}; font-weight: bold;">${label} Range: ${range}</p>`;
                });
        
            g.append("text")
                .attr("x", (xScale(zone[0]) + xScale(zone[1])) / 2)
                .attr("y", height - yOffset)
                .attr("text-anchor", "middle")
                .attr("font-size", "18px")  // Slightly larger font for readability
                .attr("font-weight", "bold")  // Make text bold
                .attr("fill", textColor)  // Set text color dynamically
                .text(label);
        }
        
        // Use the function with improved colors and click functionality
        addZone(zones.fatBurnZone, "#39FF14", "#228B22", "Fat Burn Zone", 10, `${zones.fatBurnZone[0].toFixed(1)} - ${zones.fatBurnZone[1].toFixed(1)} BPM`);
        addZone(zones.cardioZone, "#FFA500", "#CC5500", "Cardio Zone", 30, `${zones.cardioZone[0].toFixed(1)} - ${zones.cardioZone[1].toFixed(1)} BPM`);
        addZone(zones.peakZone, "#FF0000", "#8B0000", "Peak Zone", 50, `${zones.peakZone[0].toFixed(1)} - ${zones.peakZone[1].toFixed(1)} BPM`);
        
        // ** Plot the user's HR on the graph **
        if (!isNaN(enteredHR)) {
            const customX = xScale(enteredHR);
            g.append("line")
                .attr("class", "highlight-line")
                .attr("x1", customX)
                .attr("y1", height)
                .attr("x2", customX)
                .attr("y2", 0)
                .attr("stroke", "deeppink")
                .attr("stroke-width", 2);
    
            g.append("text")
                .attr("x", customX)
                .attr("y", -10)
                .attr("text-anchor", "middle")
        }
    }
    
    
    
    
    function clearChart() {
        document.getElementById("ageInput").value = ""; 
        document.getElementById("HRInput").value = "";
        
        const svg = d3.select("#chart");
    
        svg.selectAll(".hr-zone").remove();

        svg.selectAll(".highlight-line").remove();
        
        svg.selectAll("text").filter(function() {
            return d3.select(this).text().includes("Fat Burn Zone") ||
                   d3.select(this).text().includes("Cardio Zone") ||
                   d3.select(this).text().includes("Peak Zone") ||
                   d3.select(this).text().includes("You:");
        }).remove();

        let messageDiv = document.getElementById("hrZoneMessage");
        if (messageDiv) messageDiv.innerHTML = ""; 

        let zoneInfoDiv = document.getElementById("zoneInfo");
        if (zoneInfoDiv) zoneInfoDiv.innerHTML = "";
    }
    
    
    document.getElementById("HRInput").addEventListener("input", updateChart);
    document.getElementById("ageRange").addEventListener("change", updateChart);
    document.getElementById("gender").addEventListener("change", updateChart);
    document.getElementById("updateZonesBtn").addEventListener("click", updateHRZones);
    document.getElementById("clearBtn").addEventListener("click", clearChart);

    updateChart();
});
