// Answer key for all questions
const answers = {
    // Topic 1: Real Numbers
    '1-1': { correct: 'c', explanation: '√81 = 9, which is a whole number and therefore rational. √15, π, and √23 are all irrational.' },
    '1-2': { correct: 'b', explanation: '√25 = 5 and √36 = 6, so √30 is between 5 and 6.' },
    '1-3': { correct: 'b', explanation: 'Rational × Irrational = Irrational. Since √5 is irrational, 2 × √5 is also irrational.' },
    '1-4': { correct: 'b', explanation: '√26 ≈ 5.099, 5.1̄ = 5.111..., 5.2 = 5.2. So the order is: 5.1̄, √26, 5.2' },
    '1-5': { correct: 'b', explanation: '√100/25 = √4 = 2, which is a whole number.' },

    // Topic 2: Laws of Exponents
    '2-1': { correct: 'b', explanation: 'When multiplying with the same base, ADD exponents: y⁴ · y⁶ = y⁴⁺⁶ = y¹⁰' },
    '2-2': { correct: 'c', explanation: '(3x²)³ = 3³ · x²·³ = 27x⁶' },
    '2-3': { correct: 'b', explanation: 'When dividing with the same base, SUBTRACT exponents: b⁹ ÷ b³ = b⁹⁻³ = b⁶' },
    '2-4': { correct: 'c', explanation: 'Only the variable has the negative exponent: 7n⁻³ = 7 · (1/n³) = 7/n³' },
    '2-5': { correct: 'a', explanation: '(2a³b)² = 4a⁶b². Then ÷ (ab)² = ÷ a²b². Result: 4a⁶b² ÷ a²b² = 4a⁴' },

    // Topic 3: Scientific Notation & Radicals
    '3-1': { correct: 'b', explanation: '0.00000389 = 3.89 × 10⁻⁶ (move decimal 6 places right, so exponent is -6)' },
    '3-2': { correct: 'a', explanation: '(6 × 10³) × (5 × 10⁴) = 30 × 10⁷ = 3 × 10⁸' },
    '3-3': { correct: 'a', explanation: '√98 = √(49 × 2) = √49 × √2 = 7√2' },
    '3-4': { correct: 'a', explanation: '10 - 3√9 + 2 = 10 - 3(3) + 2 = 10 - 9 + 2 = 3' },
    '3-5': { correct: 'd', explanation: '(8 × 10⁻⁵) ÷ (2 × 10⁻⁹) = 4 × 10⁴ = 40,000 times wider' },

    // Topic 4: Equivalent Expressions
    '4-1': { correct: 'a', explanation: 'GCF of 15 and 25 is 5. 15x + 25 = 5(3x + 5)' },
    '4-2': { correct: 'a', explanation: 'GCF is 3ab. 6a²b - 9ab² = 3ab(2a - 3b)' },
    '4-3': { correct: 'a', explanation: '(x + 5)(x - 2) = x² - 2x + 5x - 10 = x² + 3x - 10' },
    '4-4': { correct: 'a', explanation: '2(4x - 3) + 5(x + 1) = 8x - 6 + 5x + 5 = 13x - 1' },
    '4-5': { correct: 'a', explanation: '(3x - 2)(x + 4) = 3x² + 12x - 2x - 8 = 3x² + 10x - 8' },

    // Topic 5: Equations & Inequalities
    '5-1': { correct: 'a', explanation: '4(x + 1) - 2 = 3x + 8 → 4x + 4 - 2 = 3x + 8 → 4x + 2 = 3x + 8 → x = 6' },
    '5-2': { correct: 'a', explanation: '3(x - 1) = 3x - 5 → 3x - 3 = 3x - 5 → -3 = -5. False statement means no solution.' },
    '5-3': { correct: 'b', explanation: '-3x - 4 ≥ 8 → -3x ≥ 12 → x ≤ -4 (flip the sign when dividing by negative!)' },
    '5-4': { correct: 'c', explanation: 'x² = 144 means x = ±√144 = ±12. Remember both positive and negative solutions!' },
    '5-5': { correct: 'b', explanation: 'x³ = 64 means x = ∛64 = 4. Cube roots have only one real solution.' }
};

// Track current topic
let currentTopic = 1;
const totalTopics = 6;

// Track scores by topic
let topicScores = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
};

// Track if quiz has been submitted
let quizSubmitted = false;

// Track which questions have been answered (locked)
let lockedQuestions = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to topic dots
    document.querySelectorAll('.topic-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const topic = parseInt(this.dataset.topic);
            if (topic && !quizSubmitted) {
                goToTopic(topic);
            } else if (quizSubmitted) {
                goToTopic(topic);
            }
        });
    });

    // Add click handlers to all options for immediate feedback
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault(); // Always prevent default to control radio manually
            e.stopPropagation();

            const radio = this.querySelector('input[type="radio"]');
            if (!radio) return;

            const questionId = radio.name.replace('q', '');

            // If this question is already locked, do nothing
            if (lockedQuestions[questionId]) {
                return;
            }

            if (!quizSubmitted) {
                radio.checked = true;
                checkAnswer(questionId, radio.value);
                updateProgress();
            }
        });
    });

    // Prevent direct radio button interaction completely
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        ['mousedown', 'click', 'keydown', 'keyup', 'keypress'].forEach(eventType => {
            radio.addEventListener(eventType, function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
    });

    updateProgress();
});

// Navigate to a specific topic
function goToTopic(topicNum) {
    // Hide all topics
    document.querySelectorAll('.content-card').forEach(card => {
        card.classList.remove('active');
    });

    // Show selected topic
    document.getElementById('topic' + topicNum).classList.add('active');

    // Update navigation dots
    document.querySelectorAll('.topic-dot').forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.dataset.topic) === topicNum) {
            dot.classList.add('active');
        }
    });

    currentTopic = topicNum;
    updateProgress();
}

// Navigate to next topic
function nextTopic() {
    if (currentTopic < totalTopics) {
        goToTopic(currentTopic + 1);
    }
}

// Navigate to previous topic
function prevTopic() {
    if (currentTopic > 1) {
        goToTopic(currentTopic - 1);
    }
}

// Check individual answer and provide feedback
function checkAnswer(questionId, selectedValue) {
    // Mark this question as locked
    lockedQuestions[questionId] = true;

    const answer = answers[questionId];
    const feedbackEl = document.getElementById('feedback-' + questionId);
    const questionBlock = document.querySelector(`[data-question="${questionId}"]`);
    const options = questionBlock.querySelectorAll('.option');
    const radioButtons = questionBlock.querySelectorAll('input[type="radio"]');

    // Lock all radio buttons for this question after selection
    radioButtons.forEach(radio => {
        radio.disabled = true;
        radio.parentElement.classList.add('locked');
    });

    // Reset option styling
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
    });

    // Mark selected option
    const selectedOption = questionBlock.querySelector(`input[value="${selectedValue}"]`).parentElement;
    selectedOption.classList.add('selected');

    if (selectedValue === answer.correct) {
        feedbackEl.textContent = '✓ Correct! ' + answer.explanation;
        feedbackEl.className = 'feedback show correct';
        questionBlock.classList.remove('incorrect');
        questionBlock.classList.add('correct');
        selectedOption.classList.add('correct-answer');
    } else {
        feedbackEl.textContent = '✗ Not quite. ' + answer.explanation;
        feedbackEl.className = 'feedback show incorrect';
        questionBlock.classList.remove('correct');
        questionBlock.classList.add('incorrect');
        selectedOption.classList.add('wrong-answer');

        // Also show the correct answer
        const correctOption = questionBlock.querySelector(`input[value="${answer.correct}"]`).parentElement;
        correctOption.classList.add('correct-answer');
    }
}

// Submit the entire quiz
function submitQuiz() {
    quizSubmitted = true;

    // Calculate scores for each topic
    for (let topic = 1; topic <= 5; topic++) {
        topicScores[topic] = 0;
        for (let q = 1; q <= 5; q++) {
            const questionId = `${topic}-${q}`;
            const selectedInput = document.querySelector(`input[name="q${questionId}"]:checked`);

            if (selectedInput && selectedInput.value === answers[questionId].correct) {
                topicScores[topic]++;
            }

            // Make sure feedback is shown for all questions
            if (selectedInput) {
                checkAnswer(questionId, selectedInput.value);
            }
        }
    }

    // Calculate total score
    const totalScore = Object.values(topicScores).reduce((a, b) => a + b, 0);
    const percentage = Math.round((totalScore / 25) * 100);

    // Update results page
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('scorePercent').textContent = percentage + '%';

    // Update topic bars
    for (let topic = 1; topic <= 5; topic++) {
        const score = topicScores[topic];
        const bar = document.getElementById('bar-topic' + topic);
        const text = document.getElementById('score-topic' + topic);

        bar.style.width = (score / 5 * 100) + '%';
        text.textContent = score + '/5';

        // Color the bar based on score
        if (score >= 4) {
            bar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        } else if (score >= 3) {
            bar.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
        } else {
            bar.style.background = 'linear-gradient(90deg, #f44336, #ff5722)';
        }
    }

    // Generate recommendations
    const recommendations = document.getElementById('recommendations');
    const weakTopics = [];
    const topicNames = {
        1: 'Real Numbers',
        2: 'Laws of Exponents',
        3: 'Scientific Notation & Radicals',
        4: 'Equivalent Expressions',
        5: 'Equations & Inequalities'
    };

    for (let topic = 1; topic <= 5; topic++) {
        if (topicScores[topic] < 4) {
            weakTopics.push(topicNames[topic]);
        }
    }

    if (weakTopics.length === 0) {
        recommendations.className = 'recommendations perfect';
        recommendations.innerHTML = `
            <h4>Excellent Work!</h4>
            <p>You've demonstrated mastery across all topics! You're well-prepared for what's ahead.</p>
        `;
    } else {
        recommendations.innerHTML = `
            <h4>Areas to Review</h4>
            <p>Consider reviewing these topics before moving on:</p>
            <ul>
                ${weakTopics.map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        `;
    }

    // Mark topic dots as completed based on scores
    document.querySelectorAll('.topic-dot').forEach(dot => {
        const topic = parseInt(dot.dataset.topic);
        if (topic && topic <= 5 && topicScores[topic] >= 4) {
            dot.classList.add('completed');
        }
    });

    // Go to results page
    goToTopic(6);
    updateProgress();
}

// Retry the quiz
function retryQuiz() {
    quizSubmitted = false;
    lockedQuestions = {}; // Reset locked questions

    // Reset all scores
    for (let topic = 1; topic <= 5; topic++) {
        topicScores[topic] = 0;
    }

    // Clear all selections and feedback, and re-enable radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.disabled = false;
        radio.parentElement.classList.remove('locked');
    });

    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.className = 'feedback';
        feedback.textContent = '';
    });

    document.querySelectorAll('.question-block').forEach(block => {
        block.classList.remove('correct', 'incorrect');
    });

    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
    });

    document.querySelectorAll('.topic-dot').forEach(dot => {
        dot.classList.remove('completed');
    });

    // Go back to first topic
    goToTopic(1);
    updateProgress();
}

// Update progress bar
function updateProgress() {
    let answeredCount = 0;

    for (let topic = 1; topic <= 5; topic++) {
        for (let q = 1; q <= 5; q++) {
            const questionId = `${topic}-${q}`;
            const selectedInput = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (selectedInput) {
                answeredCount++;
            }
        }
    }

    const percentage = Math.round((answeredCount / 25) * 100);
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = percentage + '%';
}

