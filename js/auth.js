// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('quizmaster_users')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target));
        });

        // Login/Register buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Enter key support
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
        
        document.getElementById('registerConfirmPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.register();
        });
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    }

    login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            Utils.showNotification('Please fill in all fields', 'error');
            return;
        }

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('quizmaster_current_user', JSON.stringify(user));
            this.hideAuthModal();
            Utils.showNotification(`Welcome back, ${user.name}!`, 'success');
        } else {
            Utils.showNotification('Invalid email or password', 'error');
        }
    }

    register() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            Utils.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Utils.showNotification('Passwords do not match', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            Utils.showNotification('Email already registered', 'error');
            return;
        }

        const newUser = {
            id: Utils.generateId(),
            name,
            email,
            password,
            joinedDate: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('quizmaster_users', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('quizmaster_current_user', JSON.stringify(newUser));
        
        this.hideAuthModal();
        Utils.showNotification('Account created successfully!', 'success');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('quizmaster_current_user');
        this.showAuthModal();
        Utils.showNotification('Logged out successfully', 'info');
    }

    showAuthModal() {
        document.getElementById('authModal').style.display = 'flex';
        document.getElementById('app').classList.add('hidden');
    }

    hideAuthModal() {
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        this.updateUI();
    }

    checkExistingSession() {
        const savedUser = localStorage.getItem('quizmaster_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.hideAuthModal();
        } else {
            this.showAuthModal();
        }
    }

    updateUI() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager
const authManager = new AuthManager();