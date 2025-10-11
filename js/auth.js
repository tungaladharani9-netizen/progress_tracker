// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
        // Open modal buttons
        const openLoginBtn = document.getElementById('openLoginBtn');
        const openRegisterBtn = document.getElementById('openRegisterBtn');
        if (openLoginBtn) {
            openLoginBtn.addEventListener('click', () => {
                this.showAuthModal();
                // Switch to login tab
                const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                if (loginTab) this.switchAuthTab(loginTab);
                Utils.createSparkles(openLoginBtn);
            });
        }
        if (openRegisterBtn) {
            openRegisterBtn.addEventListener('click', () => {
                this.showAuthModal();
                // Switch to register tab
                const registerTab = document.querySelector('.auth-tab[data-tab="register"]');
                if (registerTab) this.switchAuthTab(registerTab);
                Utils.createSparkles(openRegisterBtn);
            });
        }
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

    async login() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const btn = document.getElementById('loginBtn');

        if (!email || !password) {
            Utils.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            Utils.setButtonLoading(btn, 'Logging in...');
            const res = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }
            this.currentUser = data.user;
            localStorage.setItem('quizmaster_current_user', JSON.stringify(data.user));
            this.hideAuthModal();
            Utils.showNotification(`Welcome back, ${data.user.name}!`, 'success');
        } catch (err) {
            Utils.showNotification(err.message || 'Check your email/password', 'error');
        } finally {
            Utils.removeButtonLoading(btn);
        }
    }

    async register() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const btn = document.getElementById('registerBtn');

        if (!name || !email || !password || !confirmPassword) {
            Utils.showNotification('Please fill in all fields', 'error');
            return;
        }
        if (password !== confirmPassword) {
            Utils.showNotification('Passwords do not match', 'error');
            return;
        }
        if (!Utils.validateEmail(email)) {
            Utils.showNotification('Enter a valid email address', 'error');
            return;
        }

        try {
            Utils.setButtonLoading(btn, 'Creating account...');
            const res = await fetch('api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Registration failed');
            }
            this.currentUser = data.user;
            localStorage.setItem('quizmaster_current_user', JSON.stringify(data.user));
            this.hideAuthModal();
            Utils.showNotification('Account created successfully!', 'success');
        } catch (err) {
            Utils.showNotification(err.message || 'Registration failed', 'error');
        } finally {
            Utils.removeButtonLoading(btn);
        }
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
        const pre = document.getElementById('preLogin');
        if (pre) pre.classList.remove('hidden');
    }

    hideAuthModal() {
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        const pre = document.getElementById('preLogin');
        if (pre) pre.classList.add('hidden');
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