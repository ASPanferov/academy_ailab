// Utility functions for the AI Training Constructor

/**
 * Scroll to a specific section on the page
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Format duration in minutes to human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} мин`;
    } else if (minutes === 60) {
        return '1 час';
    } else if (minutes < 120) {
        return `1 час ${minutes - 60} мин`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 
            ? `${hours} ч ${remainingMinutes} мин`
            : `${hours} ч`;
    }
}

/**
 * Format price in rubles
 * @param {number} price - Price in rubles
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
}

/**
 * Get difficulty label in Russian
 * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced)
 * @returns {string} Russian difficulty label
 */
function getDifficultyLabel(difficulty) {
    const labels = {
        'beginner': 'Начинающий',
        'intermediate': 'Средний', 
        'advanced': 'Продвинутый'
    };
    return labels[difficulty] || difficulty;
}

/**
 * Get difficulty CSS class
 * @param {string} difficulty - Difficulty level
 * @returns {string} CSS class name
 */
function getDifficultyClass(difficulty) {
    return `difficulty-${difficulty}`;
}

/**
 * Debounce function to limit the frequency of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
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
 * Generate unique ID for elements
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an element matches filter criteria
 * @param {Object} item - Item to check
 * @param {Object} filters - Filter criteria
 * @returns {boolean} Whether item matches filters
 */
function matchesFilters(item, filters) {
    // Check difficulty filter
    if (filters.difficulty && filters.difficulty !== item.difficulty) {
        return false;
    }
    
    // Check tools filter
    if (filters.tools && !item.tools.includes(filters.tools)) {
        return false;
    }
    
    // Check duration filter
    if (filters.duration) {
        const maxDuration = parseInt(filters.duration);
        if (item.duration > maxDuration) {
            return false;
        }
    }
    
    return true;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration to show notification (ms)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${sanitizeHTML(message)}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success { background-color: #d4edda; color: #155724; border-left: 4px solid #28a745; }
            .notification-error { background-color: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
            .notification-warning { background-color: #fff3cd; color: #856404; border-left: 4px solid #ffc107; }
            .notification-info { background-color: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8; }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification && notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Ошибка сохранения данных', 'error');
        return false;
    }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} Loaded data or default value
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Validate course data structure
 * @param {Object} course - Course object to validate
 * @returns {boolean} Whether course is valid
 */
function validateCourse(course) {
    const required = ['id', 'title', 'duration', 'category', 'tools', 'difficulty'];
    return required.every(field => course.hasOwnProperty(field) && course[field] !== null);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Whether copy was successful
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            textArea.remove();
            return successful;
        }
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
    }
}

/**
 * Format course list for export
 * @param {Array} courses - Array of course objects
 * @returns {string} Formatted course list
 */
function formatCoursesForExport(courses) {
    if (!courses || courses.length === 0) {
        return 'Курсы не выбраны';
    }
    
    let output = 'ПРОГРАММА ОБУЧЕНИЯ ИИ-ИНСТРУМЕНТАМ\n\n';
    let totalDuration = 0;
    
    courses.forEach((course, index) => {
        output += `${index + 1}. ${course.title}\n`;
        output += `   Длительность: ${formatDuration(course.duration)}\n`;
        output += `   Инструменты: ${course.tools.join(', ')}\n`;
        output += `   Уровень: ${getDifficultyLabel(course.difficulty)}\n`;
        if (course.description) {
            output += `   Описание: ${course.description}\n`;
        }
        output += '\n';
        totalDuration += course.duration;
    });
    
    output += `ОБЩАЯ ДЛИТЕЛЬНОСТЬ: ${formatDuration(totalDuration)}\n`;
    output += `КОЛИЧЕСТВО УРОКОВ: ${courses.length}`;
    
    return output;
}