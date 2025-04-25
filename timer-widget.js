// Timer Widget
// A customizable timer widget that can toggle between minimized and fullscreen modes
// with dark/light theme toggle functionality

class TimerWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container element not found');
            return;
        }
        
        // Timer state
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.showHours = false;
        this.showDays = false;
        
        // UI state
        this.isFullscreen = false;
        this.isBrowserFullscreen = false; // Track browser fullscreen separately
        this.isDarkTheme = false; // Default to light theme
        
        // Create and append the widget elements
        this.createWidgetElements();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initial update of the timer display
        this.updateTimerDisplay();
        
        console.log('Timer widget initialized');
    }
    
    createWidgetElements() {
        // Create container for the widget
        this.container.classList.add('timer-widget', 'light-theme'); // Default to light theme
        
        // Create reset message
        this.resetMessage = document.createElement('div');
        this.resetMessage.classList.add('reset-message');
        this.resetMessage.textContent = 'Timer resets on exit.';
        this.resetMessage.style.display = 'none'; // Initially hidden
        
        // Create timer display
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.classList.add('timer-display');
        this.timerDisplay.style.display = 'none'; // Initially hidden until fullscreen
        
        // Create each time unit with a wrapper for fixed width
        // Days
        this.daysWrapper = document.createElement('div');
        this.daysWrapper.classList.add('time-unit-wrapper', 'days-wrapper');
        this.daysDigit1 = document.createElement('span');
        this.daysDigit1.classList.add('digit', 'days-digit-1');
        this.daysDigit1.textContent = '0';
        this.daysDigit2 = document.createElement('span');
        this.daysDigit2.classList.add('digit', 'days-digit-2');
        this.daysDigit2.textContent = '0';
        this.daysWrapper.appendChild(this.daysDigit1);
        this.daysWrapper.appendChild(this.daysDigit2);
        
        // Hours
        this.hoursWrapper = document.createElement('div');
        this.hoursWrapper.classList.add('time-unit-wrapper', 'hours-wrapper');
        this.hoursDigit1 = document.createElement('span');
        this.hoursDigit1.classList.add('digit', 'hours-digit-1');
        this.hoursDigit1.textContent = '0';
        this.hoursDigit2 = document.createElement('span');
        this.hoursDigit2.classList.add('digit', 'hours-digit-2');
        this.hoursDigit2.textContent = '0';
        this.hoursWrapper.appendChild(this.hoursDigit1);
        this.hoursWrapper.appendChild(this.hoursDigit2);
        
        // Minutes
        this.minutesWrapper = document.createElement('div');
        this.minutesWrapper.classList.add('time-unit-wrapper', 'minutes-wrapper');
        this.minutesDigit1 = document.createElement('span');
        this.minutesDigit1.classList.add('digit', 'minutes-digit-1');
        this.minutesDigit1.textContent = '0';
        this.minutesDigit2 = document.createElement('span');
        this.minutesDigit2.classList.add('digit', 'minutes-digit-2');
        this.minutesDigit2.textContent = '0';
        this.minutesWrapper.appendChild(this.minutesDigit1);
        this.minutesWrapper.appendChild(this.minutesDigit2);
        
        // Seconds
        this.secondsWrapper = document.createElement('div');
        this.secondsWrapper.classList.add('time-unit-wrapper', 'seconds-wrapper');
        this.secondsDigit1 = document.createElement('span');
        this.secondsDigit1.classList.add('digit', 'seconds-digit-1');
        this.secondsDigit1.textContent = '0';
        this.secondsDigit2 = document.createElement('span');
        this.secondsDigit2.classList.add('digit', 'seconds-digit-2');
        this.secondsDigit2.textContent = '0';
        this.secondsWrapper.appendChild(this.secondsDigit1);
        this.secondsWrapper.appendChild(this.secondsDigit2);
        
        // Create separators
        this.daySeparator = document.createElement('span');
        this.daySeparator.classList.add('separator', 'day-separator');
        this.daySeparator.textContent = ':';
        
        this.hourSeparator = document.createElement('span');
        this.hourSeparator.classList.add('separator', 'hour-separator');
        this.hourSeparator.textContent = ':';
        
        this.minuteSeparator = document.createElement('span');
        this.minuteSeparator.classList.add('separator', 'minute-separator');
        this.minuteSeparator.textContent = ':';
        
        // Append time units and separators to timer display
        this.timerDisplay.appendChild(this.daysWrapper);
        this.timerDisplay.appendChild(this.daySeparator);
        this.timerDisplay.appendChild(this.hoursWrapper);
        this.timerDisplay.appendChild(this.hourSeparator);
        this.timerDisplay.appendChild(this.minutesWrapper);
        this.timerDisplay.appendChild(this.minuteSeparator);
        this.timerDisplay.appendChild(this.secondsWrapper);
        
        // Create iOS-style back button header (initially hidden)
        this.backHeader = document.createElement('div');
        this.backHeader.classList.add('ios-back-header');
        this.backHeader.innerHTML = `
            <button class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
                Brain Bard
            </button>
        `;
        this.backHeader.style.display = 'none'; // Initially hidden
        
        // Create controls container
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.classList.add('timer-controls');
        
        // Create start/pause button (initially hidden)
        this.startPauseButton = document.createElement('button');
        this.startPauseButton.classList.add('timer-button', 'start-pause');
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.style.display = 'none';
        
        // Create reset button (initially hidden)
        this.resetButton = document.createElement('button');
        this.resetButton.classList.add('timer-button', 'reset');
        this.resetButton.textContent = 'Reset';
        this.resetButton.style.display = 'none';
        
        // Append buttons to controls container
        this.controlsContainer.appendChild(this.startPauseButton);
        this.controlsContainer.appendChild(this.resetButton);
        
        // Create fullscreen controls (initially hidden)
        this.fullscreenControls = document.createElement('div');
        this.fullscreenControls.classList.add('fullscreen-controls');
        
        // Create theme toggle button
        this.themeToggleButton = document.createElement('button');
        this.themeToggleButton.classList.add('theme-toggle');
        this.themeToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" fill="currentColor"/></svg>';
        
        // Create fullscreen toggle button
        this.fullscreenToggleButton = document.createElement('button');
        this.fullscreenToggleButton.classList.add('fullscreen-toggle');
        this.fullscreenToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z" fill="currentColor"/></svg>';
        
        // Append buttons to fullscreen controls
        this.fullscreenControls.appendChild(this.themeToggleButton);
        this.fullscreenControls.appendChild(this.fullscreenToggleButton);
        this.fullscreenControls.style.display = 'none';
        
        // Append all elements to the container
        this.container.appendChild(this.backHeader);
        this.container.appendChild(this.timerDisplay);
        this.container.appendChild(this.controlsContainer);
        this.container.appendChild(this.fullscreenControls);
        this.container.appendChild(this.resetMessage); // Add the reset message

        // Initial style setup
        this.applyStyles();
        this.toggleUnitsVisibility();
        
        console.log('Widget elements created');
    }
    
    applyStyles() {
        // Create and append CSS for the widget
        if (!document.getElementById('timer-widget-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'timer-widget-styles';
            styleElement.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@500&display=swap');

                .timer-widget.fullscreen.exiting-right {
                    transform: translateX(100%);
                    /* You might want a specific easing for the exit */
                    transition: transform 0.2s ease-in; /* Adjust duration/easing as needed */
                }

                /* Ensure the normal fullscreen state starts with no transform */
                .timer-widget.fullscreen {
                    /* ... other fullscreen styles ... */
                    transform: translateX(0);
                    /* Ensure the main transition covers transform or add it here */
                    /* transition: all 0.3s ease; /* This should already cover transform */
                }

                .timer-widget {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    
                    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                    background-color: #000000;
                    color: #ffffff;
                    transition: all 0.3s ease;
                    position: relative;
                    border-radius: 50px;
                    width: 0px;
                }
                
                .timer-widget.fullscreen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    border-radius: 0;
                    background-color: #000000;
                }
                
                #timer-widget-container:fullscreen {
                    border-radius: 50px; /* Or your desired radius value */
                }

                .timer-widget.light-theme {
                    background-color: #f9f9f9;
                    color: #000000;
                }
                
                .ios-back-header {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    z-index: 100;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .timer-widget.fullscreen:hover .ios-back-header {
                    opacity: 1;
                }
                
                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background: none;
                    border: none;
                    color: #007bff;
                    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 18px;
                    font-weight: 350;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 8px;
                }
                
                .back-button:hover {
                    background-color: rgba(128, 128, 128, 0.1);
                }
                
                .timer-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    font-size: 40px;
                    font-weight: 500;
                }
                
                .timer-widget.fullscreen .timer-display {
                    font-size: 250px;
                }
                
                .time-unit-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .digit {
                    display: inline-block; /* Or block */
                    width: 162px; /* Fixed width for each digit container */
                    text-align: center; /* Center the digit character within its container */
                    font-variant-numeric: tabular-nums; /* Helps ensure numeric characters have the same width */
                }
                
                .separator {
                    display: inline-block;
                    position: relative;
                    bottom: 25px; 
                }
                
                .time-unit-wrapper.days-wrapper, 
                .time-unit-wrapper.hours-wrapper, 
                .separator.day-separator, 
                .separator.hour-separator {
                    display: none;
                }
                
                .timer-widget.show-hours .time-unit-wrapper.hours-wrapper,
                .timer-widget.show-hours .separator.hour-separator,
                .timer-widget.show-days .time-unit-wrapper.days-wrapper, 
                .timer-widget.show-days .separator.day-separator {
                    display: flex;
                }
                
                .timer-controls {
                    display: flex;
                    gap: 10px;
                }
                
                .timer-button {
                    background-color: #9DD2EF;
                    color: #000000;
                    border: none;
                    border-radius: 80px;
                    padding: 10px 20px;
                    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                    font-weight: 400;
                    font-size: 13px;
                    cursor: pointer;
                    height: 40px;
                    width: 120px;
                }

                .timer-button.start-pause, .timer-button.reset {
                    background: none;
                    color: inherit;
                    padding: 5px;
                    text-decoration: underline;
                    border-radius: 0;
                    width: auto;
                    height: auto;
                }
    
                .timer-button.start-pause:hover, .timer-button.reset:hover {
                    opacity: 0.7;
                }

                .timer-widget.fullscreen .timer-button.start-pause:not([data-running="true"]) {
                    height: 80px;
                    width: 300px;
                }
 
                .reset-message {
                    position: absolute;
                    bottom: 20px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 16px;
                    color: #828282;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }

                .timer-button.start-pause:not([data-running="true"]) {
                    background-color: #9DD2EF;
                    color: #000000;
                    border: none;
                    text-decoration: none;
                    border-radius: 80px;
                    padding: 10px 20px;
                    height: 80px;
                    width: 260px;
                }
                    
                .timer-widget.fullscreen .timer-button {
                    height: 80px;
                    width: 160px;
                    font-size: 35px;
                }
                
                .timer-button:hover {
                    opacity: 0.9;
                }
                
                .fullscreen-controls {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    gap: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .timer-widget.fullscreen:hover .fullscreen-controls {
                    opacity: 1;
                }
                
                .theme-toggle, .fullscreen-toggle {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }

                .theme-toggle:hover, .fullscreen-toggle:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styleElement);
            console.log('Styles applied');
        }
    }
    
    initEventListeners() {
        // Back button
        this.backHeader.querySelector('.back-button').addEventListener('click', () => {
            console.log('Back button clicked');
            // First exit browser fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen().then(() => {
                    this.isBrowserFullscreen = false;
                }).catch(err => {
                    console.error(`Error exiting fullscreen: ${err.message}`);
                });
            }
            // Then exit our app fullscreen
            this.toggleFullscreen();
        });
        
        // Start/Pause button
        this.startPauseButton.addEventListener('click', () => {
            console.log('Start/Pause button clicked');
            if (!this.isRunning) {
                this.startTimer();
            } else {
                this.pauseTimer();
            }
        });
        
        // Reset button
        this.resetButton.addEventListener('click', () => {
            console.log('Reset button clicked');
            this.resetTimer();
        });
        
        // Fullscreen toggle - only toggles browser fullscreen now
        this.fullscreenToggleButton.addEventListener('click', () => {
            console.log('Fullscreen toggle clicked');
            this.toggleBrowserFullscreen();
        });
        
        // Theme toggle
        this.themeToggleButton.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            this.toggleTheme();
        });
        
        // Mouse movement in fullscreen
        document.addEventListener('mousemove', () => {
            if (this.isFullscreen) {
                // Show cursor and controls
                document.body.style.cursor = 'default';
                this.fullscreenControls.style.opacity = '1';
                this.backHeader.style.opacity = '1';
                this.resetMessage.style.opacity = '1'; // Show reset message
                
                // Hide cursor and controls after 0.5 seconds
                clearTimeout(this.hideControlsTimeout);
                this.hideControlsTimeout = setTimeout(() => {
                    if (this.isFullscreen && !this.fullscreenControls.matches(':hover') && !this.backHeader.matches(':hover')) {
                        this.fullscreenControls.style.opacity = '0';
                        this.backHeader.style.opacity = '0';
                        this.resetMessage.style.opacity = '0'; // Hide reset message
                        document.body.style.cursor = 'none'; // Hide cursor
                    }
                }, 1000); // How long it takes for the cursor and elements to disappear
            }
        });
        
        // Keyboard shortcuts - Modified to handle Escape properly
        document.addEventListener('keydown', (e) => {
            if (this.isFullscreen) {
                if (e.key === 'Escape') {
                    // Only exit our fullscreen if browser fullscreen is not active
                    // if (!document.fullscreenElement) {
                    //     this.toggleFullscreen();
                    //     e.preventDefault(); // Prevent default escape behavior
                    // }
                    // If browser fullscreen is active, let the browser handle Escape
                } else if (e.key === ' ') {
                    if (!this.isRunning) {
                        this.startTimer();
                    } else {
                        this.pauseTimer();
                    }
                    e.preventDefault();
                }
            }
        });
        
        // Handle browser fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            this.isBrowserFullscreen = !!document.fullscreenElement;
            console.log(`Browser fullscreen changed: ${this.isBrowserFullscreen ? 'ON' : 'OFF'}`);
            
            // Update fullscreen toggle button icon based on browser fullscreen state
            if (this.isBrowserFullscreen) {
                this.fullscreenToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z" fill="currentColor"/></svg>';
            } else {
                this.fullscreenToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z" fill="currentColor"/></svg>';
                
                // Add this line to reset the cursor when exiting browser fullscreen
                document.body.style.cursor = 'default';
            }
        });
        
        
        console.log('Event listeners initialized');
    }
    
    startTimer() {
        if (!this.isRunning) {
            if (this.isPaused) {
                // Resume from pause
                this.startTime = Date.now() - this.elapsedTime;
            } else {
                // Start fresh
                this.startTime = Date.now();
                this.elapsedTime = 0;
            }
            
            this.isRunning = true;
            this.isPaused = false;
            this.startPauseButton.textContent = 'Pause';
            this.startPauseButton.setAttribute('data-running', 'true'); // Add attribute for styling
            this.resetButton.style.display = 'block';
            
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateTimerDisplay();
                this.checkTimeUnitsVisibility();
            }, 100); // Update more frequently for smoother display
            
            console.log('Timer started');
        }
    }
    
    pauseTimer() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.isPaused = true;
            this.startPauseButton.textContent = 'Resume';
            this.startPauseButton.setAttribute('data-running', 'true'); // Keep same style for Resume
            console.log('Timer paused');
        }
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.removeAttribute('data-running'); // Remove attribute to reset style
        this.resetButton.style.display = 'none';
        this.showHours = false;
        this.showDays = false;
        this.updateTimerDisplay();
        this.toggleUnitsVisibility();
        console.log('Timer reset');
    }
    
    updateTimerDisplay() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const daysStr = days.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        this.daysDigit1.textContent = daysStr[0];
        this.daysDigit2.textContent = daysStr[1];
        this.hoursDigit1.textContent = hoursStr[0];
        this.hoursDigit2.textContent = hoursStr[1];
        this.minutesDigit1.textContent = minutesStr[0];
        this.minutesDigit2.textContent = minutesStr[1];
        this.secondsDigit1.textContent = secondsStr[0];
        this.secondsDigit2.textContent = secondsStr[1];
    }
    
    checkTimeUnitsVisibility() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const days = Math.floor(totalSeconds / 86400);
        
        if (days > 0 && !this.showDays) {
            this.showDays = true;
            this.showHours = true;
            this.toggleUnitsVisibility();
            console.log('Days display enabled');
        } else if (hours > 0 && !this.showHours) {
            this.showHours = true;
            this.toggleUnitsVisibility();
            console.log('Hours display enabled');
        }
    }
    
    toggleUnitsVisibility() {
        if (this.showDays) {
            this.container.classList.add('show-days');
        } else {
            this.container.classList.remove('show-days');
        }
        
        if (this.showHours) {
            this.container.classList.add('show-hours');
        } else {
            this.container.classList.remove('show-hours');
        }
    }
    
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        console.log(`Toggling app fullscreen mode: ${this.isFullscreen ? 'ON' : 'OFF'}`);
        this.updateFullscreenUI(this.isFullscreen);
    }
    
    updateFullscreenUI(isFullscreen) {
        console.log(`Updating UI for app fullscreen: ${isFullscreen ? 'ON' : 'OFF'}`);

        if (isFullscreen) {
            // --- Entering Fullscreen --- (Keep this part as it was)
            this.container.classList.add('fullscreen');
            // Reset transform just in case it wasn't cleared properly on a previous exit
            this.container.style.transform = '';
            document.body.style.overflow = 'hidden';

            // Show/hide appropriate elements
            this.timerDisplay.style.display = 'flex';
            this.backHeader.style.display = 'block';
            this.startPauseButton.style.display = 'block';
            this.resetButton.style.display = (this.isRunning || this.isPaused) ? 'block' : 'none';
            this.resetMessage.style.display = 'block';
            this.fullscreenControls.style.display = 'flex';

            // Show controls briefly
            document.body.style.cursor = 'default';
            this.fullscreenControls.style.opacity = '1';
            this.backHeader.style.opacity = '1';
            this.resetMessage.style.opacity = '1';

            clearTimeout(this.hideControlsTimeout);
            this.hideControlsTimeout = setTimeout(() => {
                if (this.isFullscreen && !this.fullscreenControls.matches(':hover') && !this.backHeader.matches(':hover')) {
                    this.fullscreenControls.style.opacity = '0';
                    this.backHeader.style.opacity = '0';
                    this.resetMessage.style.opacity = '0';
                    document.body.style.cursor = 'none';
                 }
            }, 1000);

            console.log('Fullscreen UI elements shown');

        } else {
            // --- Exiting Fullscreen - SLIDE RIGHT ---
            clearTimeout(this.hideControlsTimeout); // Clear any pending hide operations
            document.body.style.cursor = 'default'; // Restore cursor immediately
            // Hide fading controls immediately as they are part of the fullscreen view
            this.fullscreenControls.style.opacity = '0';
            this.backHeader.style.opacity = '0';
            this.resetMessage.style.opacity = '0';


            // 1. ADD the exiting class to START the slide animation
            // Keep the 'fullscreen' class for now so it slides while still full size
            this.container.classList.add('exiting-right');
            console.log('Starting exit fullscreen slide transition...');

            // 2. Wait for the slide animation to finish (match CSS transition duration)
            const slideDuration = 200; // ms - MUST match your CSS transition-duration
            setTimeout(() => {
                // Check if the exiting class is still there (safeguard against rapid clicks)
                if (this.container.classList.contains('exiting-right')) {

                    // 3. Clean up AFTER animation:
                    this.container.classList.remove('fullscreen'); // Now remove fullscreen state
                    this.container.classList.remove('exiting-right'); // Remove the animation trigger class
                    // Reset transform style directly to prevent it affecting future states
                    this.container.style.transform = '';

                    // Restore body overflow AFTER animation is fully done and element is effectively gone
                    document.body.style.overflow = '';

                    // Hide/show elements appropriate for minimized state
                    this.timerDisplay.style.display = 'none';
                    this.backHeader.style.display = 'none';
                    this.startPauseButton.style.display = 'none';
                    this.resetButton.style.display = 'none';
                    this.fullscreenControls.style.display = 'none';
                    this.resetMessage.style.display = 'none';

                    // Reset timer
                    this.resetTimer();

                    console.log('Fullscreen UI elements hidden after slide transition');
                }

            }, slideDuration);
        }
    }
    
    toggleBrowserFullscreen() {
        if (!document.fullscreenElement) {
            // Enter browser fullscreen
            this.container.requestFullscreen().then(() => {
                this.isBrowserFullscreen = true;
                console.log('Entered browser fullscreen mode');
                // Update fullscreen button icon
                this.fullscreenToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z" fill="currentColor"/></svg>';
            }).catch(err => {
                console.error(`Error attempting to enable browser fullscreen: ${err.message}`);
            });
        } else {
            // Exit browser fullscreen
            document.exitFullscreen().then(() => {
                this.isBrowserFullscreen = false;
                console.log('Exited browser fullscreen mode');
                // Update fullscreen button icon
                this.fullscreenToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z" fill="currentColor"/></svg>';
                
                // Add this line to reset the cursor when exiting browser fullscreen
                document.body.style.cursor = 'default';
            }).catch(err => {
                console.error(`Error exiting browser fullscreen: ${err.message}`);
            });
        }
    }
    
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        
        if (this.isDarkTheme) {
            this.container.classList.remove('light-theme');
        } else {
            this.container.classList.add('light-theme');
        }
        
        console.log(`Theme toggled to: ${this.isDarkTheme ? 'dark' : 'light'}`);
    }
    
    // Public API methods
    setShowHours(show) {
        this.showHours = show;
        this.toggleUnitsVisibility();
    }
    
    setShowDays(show) {
        this.showDays = show;
        if (show) this.showHours = true;
        this.toggleUnitsVisibility();
    }
}

// Initialize the widget when the page loads
// Initialize the widget when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if the container exists before creating the widget
    if (!document.getElementById('timer-widget-container')) {
        const container = document.createElement('div');
        container.id = 'timer-widget-container';
        document.body.appendChild(container);
    }

    // Initialize the widget
    window.timerWidget = new TimerWidget('timer-widget-container');
    console.log('Timer widget loaded and initialized');

    // --- START: Added External Button Listener ---
    const externalButton = document.getElementById('external-open-timer-button');
    if (externalButton && window.timerWidget) {
        externalButton.addEventListener('click', () => {
            console.log('External Open Timer button clicked');
            window.timerWidget.toggleFullscreen();
        });
    } else {
        console.error('External open timer button or timer widget instance not found.');
    }
    // --- END: Added External Button Listener ---
});