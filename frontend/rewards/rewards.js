function navigate(page) {
    if (page === 'dashboard') {
        window.location.href = "dashboard.html"; // Redirect to Dashboard
    } else if (page === 'logout') {
        window.location.href = "login.html"; // Redirect to Login
    } else if (page === 'about') {
        window.location.href = "about.html"; // Redirect to About
    } else {
        window.location.href = "index.html"; // Redirect to Home
    }
}

function calculateRewards() {
    let carbonReduced = prompt("Enter the amount of carbon reduced (in kg):");
    if (carbonReduced && !isNaN(carbonReduced) && carbonReduced > 0) {
        let bitcoinReward = (carbonReduced * 0.00001).toFixed(8); // Example formula
        document.getElementById("reward-message").innerHTML = 
            `You have earned <strong>${bitcoinReward} BTC</strong> for reducing ${carbonReduced} kg of CO₂!`;
    } else {
        alert("Please enter a valid number.");
    }
}
