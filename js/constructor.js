// Constructor functionality for building custom AI training programs

class ProgramConstructor {
    constructor() {
        this.selectedCourses = [];
        this.draggedElement = null;
        this.initializeEventListeners();
        this.loadSavedProgram();
    }

    /**
     * Initialize event listeners for drag and drop functionality
     */
    initializeEventListeners() {
        // Course list drop zone
        const courseList = document.getElementById('selected-courses');
        if (courseList) {
            courseList.addEventListener('dragover', this.handleDragOver.bind(this));
            courseList.addEventListener('drop', this.handleDrop.bind(this));
            courseList.addEventListener('dragleave', this.handleDragLeave.bind(this));
        }

        // Constructor action buttons
        const saveButton = document.getElementById('save-program');
        const clearButton = document.getElementById('clear-program');
        const exportButton = document.getElementById('export-program');

        if (saveButton) {
            saveButton.addEventListener('click', this.saveProgram.bind(this));
        }
        if (clearButton) {
            clearButton.addEventListener('click', this.clearProgram.bind(this));
        }
        if (exportButton) {
            exportButton.addEventListener('click', this.exportProgram.bind(this));
        }
    }

    /**
     * Handle dragover event for drop zone
     */
    handleDragOver(e) {
        e.preventDefault();
        const courseList = document.getElementById('selected-courses');
        courseList.classList.add('drag-over');
    }

    /**
     * Handle drop event when course is dropped into constructor
     */
    handleDrop(e) {
        e.preventDefault();
        const courseList = document.getElementById('selected-courses');
        courseList.classList.remove('drag-over');

        const courseId = e.dataTransfer.getData('text/plain');
        const courseData = JSON.parse(e.dataTransfer.getData('application/json') || '{}');
        
        if (courseId && courseData.title) {
            this.addCourse(courseData);
        }
    }

    /**
     * Handle dragleave event
     */
    handleDragLeave(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            const courseList = document.getElementById('selected-courses');
            courseList.classList.remove('drag-over');
        }
    }

    /**
     * Add a course to the selected program by ID
     * @param {number} courseId - Course ID to add
     */
    addCourseById(courseId) {
        if (!window.aiTrainingApp) {
            showNotification('Приложение не инициализировано', 'error');
            return;
        }

        const courseData = window.aiTrainingApp.getCourseById(courseId);
        if (!courseData) {
            showNotification('Курс не найден', 'error');
            return;
        }

        this.addCourse(courseData);
    }

    /**
     * Add a course to the selected program
     * @param {Object} courseData - Course object to add
     */
    addCourse(courseData) {
        // Check if course is already added
        if (this.selectedCourses.find(course => course.id === courseData.id)) {
            showNotification('Этот урок уже добавлен в программу', 'warning');
            return;
        }

        // Check prerequisites
        if (courseData.prerequisites && courseData.prerequisites.length > 0) {
            const missingPrereqs = courseData.prerequisites.filter(prereqId => 
                !this.selectedCourses.find(course => course.id === prereqId)
            );
            
            if (missingPrereqs.length > 0) {
                showNotification('Для этого урока требуются предварительные знания. Добавьте сначала базовые уроки.', 'warning');
                return;
            }
        }

        this.selectedCourses.push(courseData);
        this.renderSelectedCourses();
        this.updateSummary();
        this.markCourseAsSelected(courseData.id);
        
        showNotification(`Урок "${courseData.title}" добавлен в программу`, 'success');
        
        // Scroll to constructor section
        scrollToSection('constructor');
    }

    /**
     * Remove a course from the selected program
     * @param {number} courseId - ID of course to remove
     */
    removeCourse(courseId) {
        const courseIndex = this.selectedCourses.findIndex(course => course.id === courseId);
        if (courseIndex === -1) return;

        const removedCourse = this.selectedCourses[courseIndex];
        
        // Check if other courses depend on this one
        const dependentCourses = this.selectedCourses.filter(course => 
            course.prerequisites && course.prerequisites.includes(courseId)
        );

        if (dependentCourses.length > 0) {
            const dependentTitles = dependentCourses.map(course => course.title).join(', ');
            showNotification(`Нельзя удалить этот урок, так как от него зависят: ${dependentTitles}`, 'error');
            return;
        }

        this.selectedCourses.splice(courseIndex, 1);
        this.renderSelectedCourses();
        this.updateSummary();
        this.markCourseAsSelected(courseId, false);
        
        showNotification(`Урок "${removedCourse.title}" удален из программы`, 'info');
    }

    /**
     * Move course up in the program order
     * @param {number} courseId - ID of course to move
     */
    moveCourseUp(courseId) {
        const courseIndex = this.selectedCourses.findIndex(course => course.id === courseId);
        if (courseIndex <= 0) return;

        // Swap with previous course
        [this.selectedCourses[courseIndex - 1], this.selectedCourses[courseIndex]] = 
        [this.selectedCourses[courseIndex], this.selectedCourses[courseIndex - 1]];

        this.renderSelectedCourses();
    }

    /**
     * Move course down in the program order
     * @param {number} courseId - ID of course to move
     */
    moveCourseDown(courseId) {
        const courseIndex = this.selectedCourses.findIndex(course => course.id === courseId);
        if (courseIndex === -1 || courseIndex >= this.selectedCourses.length - 1) return;

        // Swap with next course
        [this.selectedCourses[courseIndex], this.selectedCourses[courseIndex + 1]] = 
        [this.selectedCourses[courseIndex + 1], this.selectedCourses[courseIndex]];

        this.renderSelectedCourses();
    }

    /**
     * Render the list of selected courses in the constructor
     */
    renderSelectedCourses() {
        const courseList = document.getElementById('selected-courses');
        if (!courseList) return;

        if (this.selectedCourses.length === 0) {
            courseList.innerHTML = `
                <div class="empty-state">
                    <p>Перетащите уроки сюда для создания программы</p>
                </div>
            `;
            return;
        }

        courseList.innerHTML = this.selectedCourses.map((course, index) => `
            <div class="selected-course" data-course-id="${course.id}">
                <div class="selected-course-info">
                    <h4>${sanitizeHTML(course.title)}</h4>
                    <div class="selected-course-meta">
                        ${formatDuration(course.duration)} • ${course.tools.join(', ')} • ${getDifficultyLabel(course.difficulty)}
                    </div>
                </div>
                <div class="selected-course-actions">
                    ${index > 0 ? `<button class="course-action-btn" onclick="programConstructor.moveCourseUp(${course.id})" title="Переместить вверх">↑</button>` : ''}
                    ${index < this.selectedCourses.length - 1 ? `<button class="course-action-btn" onclick="programConstructor.moveCourseDown(${course.id})" title="Переместить вниз">↓</button>` : ''}
                    <button class="remove-course" onclick="programConstructor.removeCourse(${course.id})" title="Удалить из программы">×</button>
                </div>
            </div>
        `).join('');

        // Add styles for course action buttons if not already added
        this.addCourseActionStyles();
    }

    /**
     * Add CSS styles for course action buttons
     */
    addCourseActionStyles() {
        if (document.querySelector('#course-action-styles')) return;

        const style = document.createElement('style');
        style.id = 'course-action-styles';
        style.textContent = `
            .selected-course {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            
            .selected-course-actions {
                display: flex;
                gap: 0.25rem;
                align-items: center;
            }
            
            .course-action-btn {
                background: none;
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0.25rem 0.5rem;
                border-radius: var(--radius-sm);
                transition: all 0.2s ease;
                font-size: 0.75rem;
                min-width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .course-action-btn:hover {
                background-color: var(--background-color);
                border-color: var(--accent-color);
                color: var(--accent-color);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Update the program summary (duration, count, price)
     */
    updateSummary() {
        const totalDuration = this.selectedCourses.reduce((sum, course) => sum + course.duration, 0);
        const totalLessons = this.selectedCourses.length;
        const totalPrice = this.selectedCourses.reduce((sum, course) => sum + (course.price || 0), 0);

        const durationElement = document.getElementById('total-duration');
        const lessonsElement = document.getElementById('total-lessons');
        const priceElement = document.getElementById('total-price');

        if (durationElement) {
            durationElement.textContent = formatDuration(totalDuration);
        }
        if (lessonsElement) {
            lessonsElement.textContent = totalLessons.toString();
        }
        if (priceElement) {
            priceElement.textContent = formatPrice(totalPrice);
        }
    }

    /**
     * Mark course as selected in the catalog
     * @param {number} courseId - Course ID
     * @param {boolean} selected - Whether course is selected
     */
    markCourseAsSelected(courseId, selected = true) {
        const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
        if (courseCard) {
            if (selected) {
                courseCard.classList.add('selected');
            } else {
                courseCard.classList.remove('selected');
            }
        }
    }

    /**
     * Save the current program to localStorage
     */
    saveProgram() {
        if (this.selectedCourses.length === 0) {
            showNotification('Нечего сохранять. Добавьте уроки в программу.', 'warning');
            return;
        }

        const programData = {
            courses: this.selectedCourses,
            createdAt: new Date().toISOString(),
            totalDuration: this.selectedCourses.reduce((sum, course) => sum + course.duration, 0),
            totalPrice: this.selectedCourses.reduce((sum, course) => sum + (course.price || 0), 0)
        };

        if (saveToStorage('saved-program', programData)) {
            showNotification('Программа сохранена', 'success');
        }
    }

    /**
     * Load saved program from localStorage
     */
    loadSavedProgram() {
        const savedProgram = loadFromStorage('saved-program');
        if (savedProgram && savedProgram.courses && savedProgram.courses.length > 0) {
            this.selectedCourses = savedProgram.courses;
            this.renderSelectedCourses();
            this.updateSummary();
            
            // Mark courses as selected in catalog
            this.selectedCourses.forEach(course => {
                this.markCourseAsSelected(course.id);
            });

            showNotification('Загружена сохраненная программа', 'info');
        }
    }

    /**
     * Clear the current program
     */
    clearProgram() {
        if (this.selectedCourses.length === 0) {
            return;
        }

        if (confirm('Вы уверены, что хотите очистить программу? Все несохраненные изменения будут потеряны.')) {
            // Unmark all courses in catalog
            this.selectedCourses.forEach(course => {
                this.markCourseAsSelected(course.id, false);
            });

            this.selectedCourses = [];
            this.renderSelectedCourses();
            this.updateSummary();
            
            showNotification('Программа очищена', 'info');
        }
    }

    /**
     * Export program to text format
     */
    async exportProgram() {
        if (this.selectedCourses.length === 0) {
            showNotification('Нет курсов для экспорта. Добавьте уроки в программу.', 'warning');
            return;
        }

        const programText = formatCoursesForExport(this.selectedCourses);
        
        if (await copyToClipboard(programText)) {
            showNotification('Программа скопирована в буфер обмена', 'success');
        } else {
            showNotification('Ошибка копирования. Попробуйте еще раз.', 'error');
        }
    }

    /**
     * Load predefined program
     * @param {string} programType - Type of program (basic, intensive, advanced)
     */
    loadPredefinedProgram(programType) {
        if (!window.aiTrainingApp || !window.aiTrainingApp.programs) {
            showNotification('Данные программ не загружены', 'error');
            return;
        }

        const program = window.aiTrainingApp.programs[programType];
        if (!program) {
            showNotification(`Программа "${programType}" не найдена`, 'error');
            return;
        }

        // Clear current program
        this.selectedCourses.forEach(course => {
            this.markCourseAsSelected(course.id, false);
        });
        this.selectedCourses = [];

        // Load courses for this program
        const programCourses = program.courses.map(courseId => 
            window.aiTrainingApp.getCourseById(courseId)
        ).filter(course => course !== null);

        if (programCourses.length === 0) {
            showNotification('Курсы для программы не найдены', 'error');
            return;
        }

        this.selectedCourses = programCourses;
        this.renderSelectedCourses();
        this.updateSummary();

        // Mark courses as selected in catalog
        this.selectedCourses.forEach(course => {
            this.markCourseAsSelected(course.id);
        });

        showNotification(`Загружена программа "${program.name}" (${formatDuration(program.duration)})`, 'success');
        
        // Scroll to constructor section
        scrollToSection('constructor');
    }

    /**
     * Get current program data
     * @returns {Object} Current program data
     */
    getCurrentProgram() {
        return {
            courses: this.selectedCourses,
            totalDuration: this.selectedCourses.reduce((sum, course) => sum + course.duration, 0),
            totalPrice: this.selectedCourses.reduce((sum, course) => sum + (course.price || 0), 0),
            totalLessons: this.selectedCourses.length
        };
    }

    /**
     * Validate current program for completeness
     * @returns {Object} Validation result with warnings/errors
     */
    validateProgram() {
        const result = {
            isValid: true,
            warnings: [],
            errors: []
        };

        if (this.selectedCourses.length === 0) {
            result.isValid = false;
            result.errors.push('Программа не содержит уроков');
            return result;
        }

        // Check for proper difficulty progression
        const difficulties = this.selectedCourses.map(course => course.difficulty);
        const hasBeginnerCourse = difficulties.includes('beginner');
        const hasAdvancedCourse = difficulties.includes('advanced');

        if (hasAdvancedCourse && !hasBeginnerCourse) {
            result.warnings.push('Рекомендуется добавить базовые уроки перед продвинутыми');
        }

        // Check total duration
        const totalDuration = this.selectedCourses.reduce((sum, course) => sum + course.duration, 0);
        if (totalDuration < 60) {
            result.warnings.push('Программа слишком короткая (менее 1 часа)');
        } else if (totalDuration > 480) {
            result.warnings.push('Программа очень длинная (более 8 часов). Рассмотрите разделение на несколько сессий.');
        }

        return result;
    }
}

// Load predefined program function for global access
function loadProgram(programType) {
    if (window.programConstructor) {
        window.programConstructor.loadPredefinedProgram(programType);
    }
}