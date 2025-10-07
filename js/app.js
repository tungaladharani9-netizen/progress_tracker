// Main application controller
class QuizMasterApp {
    constructor() {
        this.currentView = 'browseQuizzes';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showView('browseQuizzes');
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('browseQuizzesBtn').addEventListener('click', () => this.showView('browseQuizzes'));
        document.getElementById('createQuizBtn').addEventListener('click', () => this.showView('createQuiz'));
        document.getElementById('myResultsBtn').addEventListener('click', () => this.showView('myResults'));
        document.getElementById('backToQuizzesBtn').addEventListener('click', () => this.showView('browseQuizzes'));

        // Auth state changes
        document.addEventListener('authStateChange', () => {
            this.updateUI();
        });
    }

    showView(view) {
        // Hide all views
        document.getElementById('browseQuizzesView').classList.add('hidden');
        document.getElementById('createQuizView').classList.add('hidden');
        document.getElementById('quizView').classList.add('hidden');
        document.getElementById('resultsView').classList.add('hidden');
        document.getElementById('myResultsView').classList.add('hidden');
        
        // Show the selected view
        this.currentView = view;
        
        switch(view) {
            case 'browseQuizzes':
                document.getElementById('browseQuizzesView').classList.remove('hidden');
                quizManager.loadQuizzes();
                break;
            case 'createQuiz':
                document.getElementById('createQuizView').classList.remove('hidden');
                this.resetQuizCreation();
                break;
            case 'quiz':
                document.getElementById('quizView').classList.remove('hidden');
                break;
            case 'results':
                document.getElementById('resultsView').classList.remove('hidden');
                break;
            case 'myResults':
                document.getElementById('myResultsView').classList.remove('hidden');
                quizManager.loadMyResults();
                break;
        }
        
        quizManager.updateStats();
    }

    resetQuizCreation() {
        document.getElementById('quizTitle').value = '';
        document.getElementById('quizDescription').value = '';
        document.getElementById('questionsContainer').innerHTML = '';
        quizManager.addQuestion(); // Add one empty question by default
    }

    updateUI() {
        quizManager.updateStats();
    }
}

// Initialize the application when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new QuizMasterApp();
});