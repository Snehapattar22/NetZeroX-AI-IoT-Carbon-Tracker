document.addEventListener("DOMContentLoaded", async function () {
    let username = prompt("Enter your name:");
    document.getElementById("greeting").innerText = 'Hello, ${username}!';

    async function fetchCarbonData() {
        try {
            const response = await fetch("https://api.carbonintensity.org.uk/intensity");
            const data = await response.json();

            let reduction = Math.floor(Math.random() * 50) + 20;
            let emitted = data.data[0].intensity.actual || 100;

            document.getElementById("emitted").innerText = emitted;
            document.getElementById("reduced").innerText = reduction;

            updateCarbonChart(reduction, emitted);
        } catch (error) {
            console.error("Error fetching carbon data:", error);
        }
    }

    function updateCarbonChart(reduction, emitted) {
        let ctx = document.getElementById("carbonChart").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Reduced CO₂", "Emitted CO₂"],
                datasets: [{
                    data: [reduction, emitted],
                    backgroundColor: ["#4CAF50", "#FF5733"]
                }]
            },
            options: { responsive: true }
        });
    }

    fetchCarbonData();
    setInterval(fetchCarbonData, 30000);
});