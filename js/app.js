// Main application logic for AI Training Constructor

class AITrainingApp {
    constructor() {
        this.courses = [];
        this.filteredCourses = [];
        this.currentFilters = {
            difficulty: '',
            tools: '',
            duration: ''
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.loadCourses();
            this.setupEventListeners();
            this.renderCourses();
            this.initializeDragAndDrop();
            
            // Initialize program constructor
            window.programConstructor = new ProgramConstructor();
            
            console.log('AI Training Constructor initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            showNotification('Ошибка инициализации приложения', 'error');
        }
    }

    /**
     * Load courses data from JSON file
     */
    async loadCourses() {
        try {
            const response = await fetch('data/courses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.courses = data.courses || [];
            this.filteredCourses = [...this.courses];
            
            // Store programs data for later use
            this.programs = data.programs || {};
            
            console.log(`Loaded ${this.courses.length} courses`);
        } catch (error) {
            console.error('Error loading courses:', error);
            // Fallback to sample data if JSON loading fails
            this.courses = this.getSampleCourses();
            this.filteredCourses = [...this.courses];
            showNotification('Загружены демонстрационные данные курсов', 'warning');
        }
    }

    /**
     * Get sample courses data (temporary until JSON file is created)
     */
    getSampleCourses() {
        return [
            {
                id: 1,
                title: "Введение в искусственный интеллект",
                duration: 60,
                category: "basic",
                tools: ["Общая теория"],
                description: "Основы ИИ, история развития, современные возможности и ограничения. Понимание того, как работают нейронные сети.",
                topics: ["История ИИ", "Типы нейросетей", "Современные возможности", "Этические аспекты"],
                practicalTasks: ["Анализ примеров ИИ в повседневной жизни"],
                prerequisites: [],
                difficulty: "beginner",
                price: 0
            },
            {
                id: 2,
                title: "Основы работы с ChatGPT",
                duration: 60,
                category: "basic",
                tools: ["ChatGPT"],
                description: "Знакомство с интерфейсом ChatGPT, основные функции, настройки безопасности и создание первых промптов.",
                topics: ["Интерфейс ChatGPT", "Настройки безопасности", "Базовые промпты", "Работа с файлами"],
                practicalTasks: ["Настройка рабочего пространства", "Создание персонального GPT-ассистента"],
                prerequisites: [1],
                difficulty: "beginner",
                price: 0
            },
            {
                id: 3,
                title: "Промпт-инжиниринг и контекст-инжиниринг",
                duration: 75,
                category: "intermediate",
                tools: ["ChatGPT", "Claude"],
                description: "Углубленное изучение создания эффективных промптов и работы с контекстом для получения лучших результатов.",
                topics: ["Структура промптов", "Роли и задачи", "Сбор контекста", "Итеративное улучшение"],
                practicalTasks: ["Создание промпт-шаблонов", "Сбор контекста для реального проекта"],
                prerequisites: [2],
                difficulty: "intermediate",
                price: 0
            },
            {
                id: 4,
                title: "Продвинутые функции ChatGPT",
                duration: 90,
                category: "intermediate",
                tools: ["ChatGPT"],
                description: "DeepSearch, проекты, артефакты, анализ данных и выполнение кода в ChatGPT.",
                topics: ["DeepSearch", "Создание проектов", "Canvas и артефакты", "Анализ данных"],
                practicalTasks: ["Создание интерактивного проекта", "Анализ реальных данных"],
                prerequisites: [3],
                difficulty: "intermediate",
                price: 0
            },
            {
                id: 5,
                title: "Claude и создание артефактов",
                duration: 60,
                category: "intermediate",
                tools: ["Claude"],
                description: "Особенности работы с Claude, создание интерактивных артефактов, веб-страниц и приложений.",
                topics: ["Интерфейс Claude", "Создание артефактов", "HTML/CSS генерация", "Развертывание на GitHub"],
                practicalTasks: ["Создание интерактивной веб-страницы", "Размещение на GitHub Pages"],
                prerequisites: [3],
                difficulty: "intermediate",
                price: 0
            },
            {
                id: 6,
                title: "Perplexity для исследований",
                duration: 45,
                category: "intermediate",
                tools: ["Perplexity"],
                description: "Использование Perplexity для исследований, поиска актуальной информации и создания отчетов с источниками.",
                topics: ["Поисковые запросы", "Работа с источниками", "Создание отчетов", "Pro функции"],
                practicalTasks: ["Исследование рынка", "Создание аналитического отчета"],
                prerequisites: [1],
                difficulty: "intermediate",
                price: 0
            },
            {
                id: 7,
                title: "Microsoft Copilot в корпоративной среде",
                duration: 60,
                category: "intermediate",
                tools: ["Copilot"],
                description: "Интеграция Copilot в рабочие процессы, работа с Office 365, автоматизация задач.",
                topics: ["Интеграция с Office", "Автоматизация документооборота", "Совместная работа", "Безопасность"],
                practicalTasks: ["Автоматизация отчетов", "Создание презентаций"],
                prerequisites: [2],
                difficulty: "intermediate",
                price: 0
            },
            {
                id: 8,
                title: "Создание ИИ-агентов",
                duration: 120,
                category: "advanced",
                tools: ["ChatGPT", "Claude", "Специальные платформы"],
                description: "Разработка автономных ИИ-агентов для решения сложных задач и автоматизации процессов.",
                topics: ["Архитектура агентов", "Цепочки рассуждений", "Интеграция с API", "Мониторинг работы"],
                practicalTasks: ["Создание агента для автоматизации", "Интеграция с внешними сервисами"],
                prerequisites: [4, 5],
                difficulty: "advanced",
                price: 0
            },
            {
                id: 9,
                title: "Работа с изображениями и мультимедиа",
                duration: 75,
                category: "intermediate",
                tools: ["ChatGPT", "DALL-E", "Sora"],
                description: "Генерация и обработка изображений, создание видео контента с помощью ИИ-инструментов.",
                topics: ["Генерация изображений", "Обработка фото", "Создание видео", "Промпты для визуала"],
                practicalTasks: ["Создание брендинговых материалов", "Монтаж видео-презентации"],
                prerequisites: [2],
                difficulty: "intermediate",
                price: 0
            },
            {
                id: 10,
                title: "Этика и безопасность ИИ",
                duration: 45,
                category: "basic",
                tools: ["Общая теория"],
                description: "Важные аспекты этичного использования ИИ, безопасность данных, предотвращение злоупотреблений.",
                topics: ["Этические принципы", "Защита данных", "Предвзятость ИИ", "Корпоративные политики"],
                practicalTasks: ["Создание политики использования ИИ", "Аудит ИИ-процессов"],
                prerequisites: [1],
                difficulty: "beginner",
                price: 0
            }
        ];
    }

    /**
     * Setup event listeners for filters and interactions
     */
    setupEventListeners() {
        // Filter controls
        const difficultyFilter = document.getElementById('difficulty-filter');
        const toolsFilter = document.getElementById('tools-filter');
        const durationFilter = document.getElementById('duration-filter');
        const clearFiltersBtn = document.getElementById('clear-filters');

        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (toolsFilter) {
            toolsFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (durationFilter) {
            durationFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', this.clearFilters.bind(this));
        }
    }

    /**
     * Handle filter changes
     */
    handleFilterChange(event) {
        const filterType = event.target.id.replace('-filter', '');
        this.currentFilters[filterType] = event.target.value;
        this.applyFilters();
        this.renderCourses();
    }

    /**
     * Apply current filters to courses
     */
    applyFilters() {
        this.filteredCourses = this.courses.filter(course => {
            return matchesFilters(course, {
                difficulty: this.currentFilters.difficulty,
                tools: this.currentFilters.tools,
                duration: this.currentFilters.duration
            });
        });
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.currentFilters = {
            difficulty: '',
            tools: '',
            duration: ''
        };

        // Reset filter controls
        const difficultyFilter = document.getElementById('difficulty-filter');
        const toolsFilter = document.getElementById('tools-filter');
        const durationFilter = document.getElementById('duration-filter');

        if (difficultyFilter) difficultyFilter.value = '';
        if (toolsFilter) toolsFilter.value = '';
        if (durationFilter) durationFilter.value = '';

        this.filteredCourses = [...this.courses];
        this.renderCourses();

        showNotification('Фильтры сброшены', 'info');
    }

    /**
     * Render courses in the catalog
     */
    renderCourses() {
        const coursesGrid = document.getElementById('courses-grid');
        if (!coursesGrid) return;

        if (this.filteredCourses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="no-courses">
                    <p>Курсы не найдены. Попробуйте изменить фильтры.</p>
                </div>
            `;
            return;
        }

        coursesGrid.innerHTML = this.filteredCourses.map(course => this.createCourseCard(course)).join('');
        
        // Re-initialize drag and drop for new elements
        this.initializeDragAndDrop();
    }

    /**
     * Create HTML for a course card
     * @param {Object} course - Course data
     * @returns {string} HTML string for course card
     */
    createCourseCard(course) {
        const difficultyClass = getDifficultyClass(course.difficulty);
        const difficultyLabel = getDifficultyLabel(course.difficulty);
        
        return `
            <div class="course-card" 
                 draggable="true" 
                 data-course-id="${course.id}"
                 data-course-title="${sanitizeHTML(course.title)}">
                
                <div class="course-card-header">
                    <div class="course-difficulty ${difficultyClass}">
                        ${difficultyLabel}
                    </div>
                    <h3 class="course-title">${sanitizeHTML(course.title)}</h3>
                    <div class="course-meta">
                        <span class="course-duration">${formatDuration(course.duration)}</span>
                    </div>
                </div>
                
                <div class="course-card-body">
                    <div class="course-tools">
                        ${course.tools.map(tool => `<span class="course-tool" data-tool="${sanitizeHTML(tool)}">${sanitizeHTML(tool)}</span>`).join('')}
                    </div>
                    
                    <p class="course-description">${sanitizeHTML(course.description)}</p>
                    
                    <div class="course-topics">
                        <h4>Темы урока:</h4>
                        <ul>
                            ${course.topics.slice(0, 4).map(topic => `<li>${sanitizeHTML(topic)}</li>`).join('')}
                            ${course.topics.length > 4 ? `<li>и еще ${course.topics.length - 4} тем...</li>` : ''}
                        </ul>
                    </div>
                    
                    <div class="course-actions">
                        <button class="btn-add-course" onclick="window.programConstructor.addCourseById(${course.id})" title="Добавить в программу">
                            <span class="btn-icon">+</span>
                            Добавить
                        </button>
                        <button class="btn-edit-course" onclick="editCourse(${course.id})" title="Редактировать урок">
                            <span class="btn-icon">✏️</span>
                        </button>
                        <button class="btn-view-course" onclick="viewCourseDetails(${course.id})" title="Подробнее">
                            <span class="btn-icon">👁</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize drag and drop functionality for course cards
     */
    initializeDragAndDrop() {
        const courseCards = document.querySelectorAll('.course-card[draggable="true"]');
        
        courseCards.forEach(card => {
            card.addEventListener('dragstart', this.handleDragStart.bind(this));
            card.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
    }

    /**
     * Handle drag start event
     * @param {Event} e - Drag event
     */
    handleDragStart(e) {
        const courseId = e.currentTarget.getAttribute('data-course-id');
        const courseData = this.courses.find(course => course.id == courseId);
        
        if (courseData) {
            e.dataTransfer.setData('text/plain', courseId);
            e.dataTransfer.setData('application/json', JSON.stringify(courseData));
            e.dataTransfer.effectAllowed = 'copy';
            
            e.currentTarget.classList.add('dragging');
        }
    }

    /**
     * Handle drag end event
     * @param {Event} e - Drag event
     */
    handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    }

    /**
     * Get course by ID
     * @param {number} courseId - Course ID
     * @returns {Object|null} Course object or null
     */
    getCourseById(courseId) {
        return this.courses.find(course => course.id == courseId) || null;
    }

    /**
     * Get courses by tool
     * @param {string} tool - Tool name
     * @returns {Array} Array of courses
     */
    getCoursesByTool(tool) {
        return this.courses.filter(course => course.tools.includes(tool));
    }

    /**
     * Get courses by difficulty
     * @param {string} difficulty - Difficulty level
     * @returns {Array} Array of courses
     */
    getCoursesByDifficulty(difficulty) {
        return this.courses.filter(course => course.difficulty === difficulty);
    }

    /**
     * Search courses by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} Array of matching courses
     */
    searchCourses(keyword) {
        const searchTerm = keyword.toLowerCase();
        return this.courses.filter(course => 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            course.topics.some(topic => topic.toLowerCase().includes(searchTerm)) ||
            course.tools.some(tool => tool.toLowerCase().includes(searchTerm))
        );
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiTrainingApp = new AITrainingApp();
});

// Global functions for course actions
function editCourse(courseId) {
    if (!window.aiTrainingApp) return;
    
    const course = window.aiTrainingApp.getCourseById(courseId);
    if (!course) {
        showNotification('Курс не найден', 'error');
        return;
    }
    
    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'course-edit-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>Редактировать урок</h3>
                    <button class="modal-close" onclick="this.closest('.course-edit-modal').remove()">×</button>
                </div>
                <form class="course-edit-form" onsubmit="saveCourseEdit(event, ${courseId})">
                    <div class="form-group">
                        <label>Название урока:</label>
                        <input type="text" name="title" value="${course.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Длительность (минуты):</label>
                        <input type="number" name="duration" value="${course.duration}" min="60" max="60" required>
                        <small>Все уроки должны быть ровно 60 минут</small>
                    </div>
                    <div class="form-group">
                        <label>Описание:</label>
                        <textarea name="description" required>${course.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Инструменты (через запятую):</label>
                        <input type="text" name="tools" value="${course.tools.join(', ')}" required>
                    </div>
                    <div class="form-group">
                        <label>Темы урока (по одной на строке):</label>
                        <textarea name="topics" required>${course.topics.join('\\n')}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Уровень сложности:</label>
                        <select name="difficulty" required>
                            <option value="beginner" ${course.difficulty === 'beginner' ? 'selected' : ''}>Начинающий</option>
                            <option value="intermediate" ${course.difficulty === 'intermediate' ? 'selected' : ''}>Средний</option>
                            <option value="advanced" ${course.difficulty === 'advanced' ? 'selected' : ''}>Продвинутый</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                        <button type="button" class="btn btn-outline" onclick="this.closest('.course-edit-modal').remove()">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveCourseEdit(event, courseId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const updatedCourse = {
        title: formData.get('title'),
        duration: parseInt(formData.get('duration')),
        description: formData.get('description'),
        tools: formData.get('tools').split(',').map(t => t.trim()),
        topics: formData.get('topics').split('\\n').map(t => t.trim()).filter(t => t),
        difficulty: formData.get('difficulty')
    };
    
    // Update course in app data
    const courseIndex = window.aiTrainingApp.courses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
        Object.assign(window.aiTrainingApp.courses[courseIndex], updatedCourse);
        window.aiTrainingApp.applyFilters();
        window.aiTrainingApp.renderCourses();
        
        showNotification('Урок успешно обновлен', 'success');
        event.target.closest('.course-edit-modal').remove();
    }
}

function viewCourseDetails(courseId) {
    if (!window.aiTrainingApp) return;
    
    const course = window.aiTrainingApp.getCourseById(courseId);
    if (!course) {
        showNotification('Курс не найден', 'error');
        return;
    }
    
    // Create details modal
    const modal = document.createElement('div');
    modal.className = 'course-details-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content modal-large" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${course.title}</h3>
                    <button class="modal-close" onclick="this.closest('.course-details-modal').remove()">×</button>
                </div>
                <div class="course-details-content">
                    <div class="course-meta-info">
                        <span class="course-duration-large">${formatDuration(course.duration)}</span>
                        <span class="course-difficulty-large difficulty-${course.difficulty}">${getDifficultyLabel(course.difficulty)}</span>
                    </div>
                    
                    <div class="course-tools-large">
                        ${course.tools.map(tool => `<span class="course-tool" data-tool="${tool}">${tool}</span>`).join('')}
                    </div>
                    
                    <div class="course-description-large">
                        <h4>Описание урока:</h4>
                        <p>${course.description}</p>
                    </div>
                    
                    <div class="course-topics-large">
                        <h4>Темы урока:</h4>
                        <ul>
                            ${course.topics.map(topic => `<li>${topic}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${course.practicalTasks && course.practicalTasks.length > 0 ? `
                        <div class="course-tasks-large">
                            <h4>Практические задания:</h4>
                            <ul>
                                ${course.practicalTasks.map(task => `<li>${task}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="course-actions-large">
                        <button class="btn btn-primary" onclick="window.programConstructor.addCourseById(${course.id}); this.closest('.course-details-modal').remove();">
                            Добавить в программу
                        </button>
                        <button class="btn btn-secondary" onclick="editCourse(${course.id}); this.closest('.course-details-modal').remove();">
                            Редактировать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITrainingApp;
}