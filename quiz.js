document.addEventListener("DOMContentLoaded", function () {
    const quizOptions = document.querySelectorAll(".quiz-option");
    const quizFeedback = document.getElementById("quiz-feedback");
    const continueButton = document.getElementById("continue-button");

    let selectedAnswers = {};
    let correctAnswers = {
        "1": "zone3", // Marathon training → Zone 3
        "2": "zone2", // Losing weight → Zone 2
        "3": "zone4"  // Racing a friend → Zone 4
    };

    quizOptions.forEach(button => {
        button.addEventListener("click", function () {
            let questionNum = this.dataset.question;
            let selectedAnswer = this.dataset.answer;
            let feedbackElement = document.getElementById(`feedback-${questionNum}`);

            // Disable all buttons for this question
            document.querySelectorAll(`.quiz-option[data-question="${questionNum}"]`).forEach(btn => {
                btn.disabled = true; // Prevent multiple selections
                btn.classList.remove("correct", "incorrect"); // Reset classes
            });

            // Store the user's answer
            selectedAnswers[questionNum] = selectedAnswer;

            // Show feedback
            if (selectedAnswer === correctAnswers[questionNum]) {
                feedbackElement.textContent = "✔️ Correct!";
                feedbackElement.style.color = "green";
                this.classList.add("correct"); // Highlight correct answer
            } else {
                feedbackElement.textContent = "❌ Incorrect!";
                feedbackElement.style.color = "red";
                this.classList.add("incorrect"); // Highlight incorrect answer
            }

            // If all questions are answered, check if the user can proceed
            if (Object.keys(selectedAnswers).length === 3) {
                let allCorrect = Object.keys(correctAnswers).every(q => selectedAnswers[q] === correctAnswers[q]);

                if (allCorrect) {
                    quizFeedback.textContent = "🎉 Great job! You answered all correctly.";
                    quizFeedback.style.color = "green";
                    continueButton.classList.remove("hidden");
                } else {
                    quizFeedback.textContent = "❌ Some answers are incorrect. Try again!";
                    quizFeedback.style.color = "red";
                }
            }
        });
    });

    // Proceed to heart rate tracker
    continueButton.addEventListener("click", function () {
        window.location.href = "tracker.html";
    });
});
