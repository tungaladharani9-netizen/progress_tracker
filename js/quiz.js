// Quiz functionality
class QuizManager {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.userQuizzes = JSON.parse(localStorage.getItem('userQuizzes')) || [];
        this.quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Quiz creation
        document.getElementById('addQuestionBtn').addEventListener('click', () => this.addQuestion());
        document.getElementById('saveQuizBtn').addEventListener('click', () => this.saveQuiz());

        // Quiz taking
        document.getElementById('prevQuestionBtn').addEventListener('click', () => this.showPreviousQuestion());
        document.getElementById('nextQuestionBtn').addEventListener('click', () => this.showNextQuestion());
        document.getElementById('submitQuizBtn').addEventListener('click', () => this.submitQuiz());

        // Results
        document.getElementById('retakeQuizBtn').addEventListener('click', () => this.retakeQuiz());
    }

    loadQuizzes() {
        const quizList = document.getElementById('quizList');
        quizList.innerHTML = '';
        
        // Add sample quizzes
        sampleQuizzes.forEach(quiz => {
            this.createQuizCard(quiz, false);
        });
        
        // Add user-created quizzes
        this.userQuizzes.forEach(quiz => {
            this.createQuizCard(quiz, true);
        });
        
        document.getElementById('quizCount').textContent = sampleQuizzes.length + this.userQuizzes.length;
    }

    createQuizCard(quiz, isUserQuiz) {
        const quizList = document.getElementById('quizList');
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.innerHTML = `
            <div class="quiz-title">${quiz.title}</div>
            <div class="quiz-description">${quiz.description}</div>
            <div class="quiz-meta">
                <span>${quiz.questions.length} questions</span>
                <span>${quiz.difficulty || 'Mixed'}</span>
                ${isUserQuiz ? '<span class="user-quiz-badge">Your Quiz</span>' : ''}
            </div>
        `;
        quizCard.addEventListener('click', () => this.startQuiz(quiz));
        quizList.appendChild(quizCard);
    }

    startQuiz(quiz) {
        if (!authManager.isAuthenticated()) {
            Utils.showNotification('Please login to take quizzes', 'error');
            authManager.showAuthModal();
            return;
        }

        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(quiz.questions.length).fill(null);
        
        document.getElementById('currentQuizTitle').textContent = quiz.title;
        document.getElementById('currentQuizDescription').textContent = quiz.description;
        document.getElementById('totalQuestions').textContent = quiz.questions.length;
        
        app.showView('quiz');
        this.showQuestion();
    }

    showQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        document.getElementById('questionText').textContent = question.text;
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        document.getElementById('quizProgress').style.width = `${progress}%`;
        document.getElementById('currentQuestionNumber').textContent = this.currentQuestionIndex + 1;
        
        // Update navigation buttons
        document.getElementById('prevQuestionBtn').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextQuestionBtn').classList.toggle('hidden', this.currentQuestionIndex === this.currentQuiz.questions.length - 1);
        document.getElementById('submitQuizBtn').classList.toggle('hidden', this.currentQuestionIndex !== this.currentQuiz.questions.length - 1);
    }

    selectOption(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        this.showQuestion();
    }

    showPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    showNextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        }
    }

    submitQuiz() {
        let correctCount = 0;
        this.currentQuiz.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });
        
        const score = (correctCount / this.currentQuiz.questions.length) * 100;
        
        // Save result
        const result = {
            id: Utils.generateId(),
            quizId: this.currentQuiz.id,
            quizTitle: this.currentQuiz.title,
            userId: authManager.getCurrentUser().id,
            userName: authManager.getCurrentUser().name,
            score: score,
            correctAnswers: correctCount,
            totalQuestions: this.currentQuiz.questions.length,
            date: new Date().toISOString(),
            userAnswers: [...this.userAnswers]
        };
        
        this.quizResults.push(result);
        localStorage.setItem('quizResults', JSON.stringify(this.quizResults));
        
        app.showView('results');
        this.showResults(result);
    }

    showResults(result) {
        document.getElementById('finalScore').textContent = `${Math.round(result.score)}%`;
        document.getElementById('correctAnswers').textContent = result.correctAnswers;
        document.getElementById('totalQuestionsResult').textContent = result.totalQuestions;
        
        const questionReview = document.getElementById('questionReview');
        questionReview.innerHTML = '';
        
        this.currentQuiz.questions.forEach((question, index) => {
            const isCorrect = result.userAnswers[index] === question.correctAnswer;
            const userAnswer = result.userAnswers[index] !== null ? question.options[result.userAnswers[index]] : 'Not answered';
            const correctAnswer = question.options[question.correctAnswer];
            
            const reviewItem = document.createElement('div');
            reviewItem.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            reviewItem.innerHTML = `
                <h4>Question ${index + 1}: ${question.text}</h4>
                <p><strong>Your answer:</strong> ${userAnswer}</p>
                <p><strong>Correct answer:</strong> ${correctAnswer}</p>
            `;
            
            questionReview.appendChild(reviewItem);
        });

        Utils.showNotification(`Quiz completed! Score: ${Math.round(result.score)}%`, 'success');
    }

    retakeQuiz() {
        this.startQuiz(this.currentQuiz);
    }

    addQuestion() {
        const questionsContainer = document.getElementById('questionsContainer');
        const questionIndex = questionsContainer.children.length;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'card';
        questionDiv.innerHTML = `
            <h4>Question ${questionIndex + 1}</h4>
            <div class="form-group">
                <label>Question Text</label>
                <input type="text" class="question-text" placeholder="Enter question text">
            </div>
            <div class="form-group">
                <label>Options</label>
                <div class="option-input">
                    <input type="text" class="option" placeholder="Option 1">
                </div>
                <div class="option-input">
                    <input type="text" class="option" placeholder="Option 2">
                </div>
                <div class="option-input">
                    <input type="text" class="option" placeholder="Option 3">
                </div>
                <div class="option-input">
                    <input type="text" class="option" placeholder="Option 4">
                </div>
            </div>
            <div class="form-group">
                <div class="correct-option">
                    <label>Correct Option:</label>
                    <select class="correct-option-select">
                        <option value="0">Option 1</option>
                        <option value="1">Option 2</option>
                        <option value="2">Option 3</option>
                        <option value="3">Option 4</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-danger remove-question-btn">Remove Question</button>
        `;
        
        questionsContainer.appendChild(questionDiv);
        
        // Add event listener to remove button
        questionDiv.querySelector('.remove-question-btn').addEventListener('click', function() {
            if (questionsContainer.children.length > 1) {
                questionDiv.remove();
                // Update question numbers
                Array.from(questionsContainer.children).forEach((child, index) => {
                    child.querySelector('h4').textContent = `Question ${index + 1}`;
                });
            } else {
                Utils.showNotification('A quiz must have at least one question!', 'error');
            }
        });
    }

    saveQuiz() {
        if (!authManager.isAuthenticated()) {
            Utils.showNotification('Please login to create quizzes', 'error');
            authManager.showAuthModal();
            return;
        }

        const title = document.getElementById('quizTitle').value.trim();
        const description = document.getElementById('quizDescription').value.trim();
        
        if (!title) {
            Utils.showNotification('Please enter a quiz title', 'error');
            return;
        }
        
        const questions = [];
        const questionElements = document.getElementById('questionsContainer').children;
        
        for (let i = 0; i < questionElements.length; i++) {
            const questionElement = questionElements[i];
            const questionText = questionElement.querySelector('.question-text').value.trim();
            const optionInputs = questionElement.querySelectorAll('.option');
            const correctOption = parseInt(questionElement.querySelector('.correct-option-select').value);
            
            if (!questionText) {
                Utils.showNotification(`Please enter text for question ${i + 1}`, 'error');
                return;
            }
            
            const options = [];
            for (let j = 0; j < optionInputs.length; j++) {
                const optionText = optionInputs[j].value.trim();
                if (!optionText) {
                    Utils.showNotification(`Please enter all options for question ${i + 1}`, 'error');
                    return;
                }
                options.push(optionText);
            }
            
            questions.push({
                id: i + 1,
                text: questionText,
                options: options,
                correctAnswer: correctOption
            });
        }
        
        const newQuiz = {
            id: Utils.generateId(),
            title: title,
            description: description,
            questions: questions,
            createdBy: authManager.getCurrentUser().id,
            createdAt: new Date().toISOString()
        };
        
        this.userQuizzes.push(newQuiz);
        localStorage.setItem('userQuizzes', JSON.stringify(this.userQuizzes));
        
        Utils.showNotification('Quiz saved successfully!', 'success');
        app.showView('browseQuizzes');
    }

    loadMyResults() {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';
        
        const userResults = this.quizResults.filter(result => 
            result.userId === authManager.getCurrentUser().id
        );
        
        if (userResults.length === 0) {
            resultsList.innerHTML = '<p>You haven\'t taken any quizzes yet.</p>';
            return;
        }
        
        userResults.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        userResults.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'card';
            resultCard.innerHTML = `
                <h4>${result.quizTitle}</h4>
                <div class="score">${Math.round(result.score)}%</div>
                <p>${result.correctAnswers} out of ${result.totalQuestions} correct</p>
                <p class="quiz-meta">Taken on: ${Utils.formatDate(result.date)}</p>
            `;
            resultsList.appendChild(resultCard);
        });
    }

    updateStats() {
        const userResults = this.quizResults.filter(result => 
            result.userId === authManager.getCurrentUser().id
        );
        
        let totalQuestionsAnswered = 0;
        let totalScore = 0;
        
        userResults.forEach(result => {
            totalQuestionsAnswered += result.totalQuestions;
            totalScore += result.score;
        });
        
        document.getElementById('questionsAnswered').textContent = totalQuestionsAnswered;
        
        if (userResults.length > 0) {
            document.getElementById('averageScore').textContent = `${Math.round(totalScore / userResults.length)}%`;
        } else {
            document.getElementById('averageScore').textContent = '0%';
        }
    }
}

// Initialize quiz manager
const quizManager = new QuizManager();