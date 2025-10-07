// utils.js - Utility functions for QuizMaster

class Utils {
    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    static generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format date to readable string
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Animate an element with specified animation
     * @param {HTMLElement} element - DOM element to animate
     * @param {string} animation - Animation name
     */
    static animateElement(element, animation) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = `${animation} 0.6s ease-out`;
        }, 10);
    }

    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (info, success, error, warning)
     */
    static showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);

        // Add close event listener
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                this.hideNotification(notification);
            }
        }, 5000);
    }

    /**
     * Hide notification with animation
     * @param {HTMLElement} notification - Notification element
     */
    static hideNotification(notification) {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string} Icon HTML
     */
    static getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    static validatePassword(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
            minLength: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers
        };
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Calculate percentage
     * @param {number} part - Part value
     * @param {number} total - Total value
     * @returns {number} Percentage
     */
    static calculatePercentage(part, total) {
        return total > 0 ? Math.round((part / total) * 100) : 0;
    }

    /**
     * Format time in MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get difficulty color
     * @param {string} difficulty - Difficulty level
     * @returns {string} Color code
     */
    static getDifficultyColor(difficulty) {
        const colors = {
            easy: '#4cc9f0',
            medium: '#f8961e',
            hard: '#f72585'
        };
        return colors[difficulty.toLowerCase()] || '#4361ee';
    }

    /**
     * Capitalize first letter of string
     * @param {string} string - String to capitalize
     * @returns {string} Capitalized string
     */
    static capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    static truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - DOM element
     * @returns {boolean} True if element is in viewport
     */
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     * @param {HTMLElement} element - Target element
     * @param {number} offset - Scroll offset
     */
    static smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (fallbackErr) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    /**
     * Get query parameter from URL
     * @param {string} name - Parameter name
     * @returns {string|null} Parameter value
     */
    static getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Set query parameter in URL
     * @param {string} name - Parameter name
     * @param {string} value - Parameter value
     */
    static setQueryParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    }

    /**
     * Remove query parameter from URL
     * @param {string} name - Parameter name
     */
    static removeQueryParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    }

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Generate random color
     * @returns {string} Hex color code
     */
    static generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    static isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if device is iOS
     * @returns {boolean} True if iOS device
     */
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * Check if device is Android
     * @returns {boolean} True if Android device
     */
    static isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    /**
     * Add loading state to button
     * @param {HTMLButtonElement} button - Button element
     * @param {string} loadingText - Loading text
     */
    static setButtonLoading(button, loadingText = 'Loading...') {
        button.disabled = true;
        button.setAttribute('data-original-text', button.textContent);
        button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
    }

    /**
     * Remove loading state from button
     * @param {HTMLButtonElement} button - Button element
     */
    static removeButtonLoading(button) {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }
    }

    /**
     * Create loading spinner
     * @returns {string} Loading spinner HTML
     */
    static createLoadingSpinner() {
        return '<div class="loading-spinner"></div>';
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Unescape HTML special characters
     * @param {string} text - Text to unescape
     * @returns {string} Unescaped text
     */
    static unescapeHtml(text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div.textContent;
    }
}

// Add notification styles to document
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid;
        max-width: 400px;
        overflow: hidden;
    }

    .notification.notification-success {
        border-left-color: #4cc9f0;
    }

    .notification.notification-error {
        border-left-color: #f72585;
    }

    .notification.notification-warning {
        border-left-color: #f8961e;
    }

    .notification.notification-info {
        border-left-color: #4361ee;
    }

    .notification-content {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        gap: 12px;
    }

    .notification-icon {
        font-weight: bold;
        font-size: 1.2em;
    }

    .notification-success .notification-icon {
        color: #4cc9f0;
    }

    .notification-error .notification-icon {
        color: #f72585;
    }

    .notification-warning .notification-icon {
        color: #f8961e;
    }

    .notification-info .notification-icon {
        color: #4361ee;
    }

    .notification-message {
        flex: 1;
        font-weight: 500;
        color: #212529;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: #6c757d;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #212529;
    }

    .notification-hiding {
        animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

// Add styles to document head
if (!document.querySelector('#notification-styles')) {
    notificationStyles.id = 'notification-styles';
    document.head.appendChild(notificationStyles);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}