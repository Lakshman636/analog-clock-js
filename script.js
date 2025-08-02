 const hourMarksContainer = document.querySelector('.hour-marks');
        for (let i = 0; i < 12; i++) {
            const hourMark = document.createElement('div');
            hourMark.classList.add('hour-mark');
            hourMark.style.transform = `rotate(${i * 30}deg)`;
            hourMarksContainer.appendChild(hourMark);
        }

        // Create minute marks
        const minuteMarksContainer = document.querySelector('.minute-marks');
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) {  // Skip positions where hour marks are
                const minuteMark = document.createElement('div');
                minuteMark.classList.add('minute-mark');
                minuteMark.style.transform = `rotate(${i * 6}deg)`;
                minuteMarksContainer.appendChild(minuteMark);
            }
        }

        // Create stars
        const sky = document.querySelector('.sky');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 60}%`;
            sky.appendChild(star);
        }

        // Create clouds
        for (let i = 0; i < 5; i++) {
            createCloud();
        }

        function createCloud() {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            
            // Create composite cloud shape
            for (let j = 0; j < 5; j++) {
                const part = document.createElement('div');
                const size = Math.random() * 50 + 30;
                part.style.width = `${size}px`;
                part.style.height = `${size}px`;
                part.style.borderRadius = '50%';
                part.style.position = 'absolute';
                part.style.background = 'rgba(255, 255, 255, 0.8)';
                part.style.left = `${j * 20}px`;
                part.style.top = `${j % 2 === 0 ? 0 : 10}px`;
                cloud.appendChild(part);
            }
            
            cloud.style.position = 'absolute';
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${Math.random() * 40 + 5}%`;
            cloud.style.opacity = '0';
            cloud.style.zIndex = '-1';
            
            sky.appendChild(cloud);
            
            animateCloud(cloud);
        }

        function animateCloud(cloud) {
            const speed = Math.random() * 0.05 + 0.01;
            let position = parseFloat(cloud.style.left);
            
            function moveCloud() {
                position += speed;
                if (position > 120) {
                    position = -20;
                    cloud.style.top = `${Math.random() * 40 + 5}%`;
                }
                cloud.style.left = `${position}%`;
                requestAnimationFrame(moveCloud);
            }
            
            moveCloud();
        }

        const hourHand = document.querySelector('.hour');
        const minuteHand = document.querySelector('.minute');
        const secondHand = document.querySelector('.second');
        const digitalTime = document.querySelector('.digital-time');
        const timePeriod = document.querySelector('.time-period');
        const sun = document.querySelector('.sun');
        const moon = document.querySelector('.moon');
        const stars = document.querySelectorAll('.star');
        const clouds = document.querySelectorAll('.cloud');
        
        // Control elements
        const hourInput = document.getElementById('hourInput');
        const minuteInput = document.getElementById('minuteInput');
        const secondInput = document.getElementById('secondInput');
        const updateBtn = document.getElementById('updateBtn');
        const resetBtn = document.getElementById('resetBtn');
        const autoUpdateToggle = document.getElementById('autoUpdateToggle');
        const speedControl = document.getElementById('speedControl');
        
        // Clock state variables
        let customTime = null;
        let clockInterval;
        let speedFactor = 1;
        let lastUpdateTime = Date.now();
        let isUpdatingFromInput = false;
        
        function updateClock() {
            const now = customTime ? new Date(customTime) : new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();
            
            // If auto-update is enabled and we have a custom time, advance it
            if (autoUpdateToggle.checked && customTime) {
                const currentTime = Date.now();
                const elapsed = currentTime - lastUpdateTime;
                customTime += elapsed * speedFactor;
                lastUpdateTime = currentTime;
            }
            
            // Update digital clock
            digitalTime.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // Update input fields (commented out to prevent loop)
        if (!isUpdatingFromInput) {
            hourInput.value = hours;
            minuteInput.value = minutes;
            secondInput.value = seconds;
        }
            
            // Set time period
            let period = '';
            if (hours >= 5 && hours < 12) {
                period = 'Morning';
            } else if (hours >= 12 && hours < 17) {
                period = 'Afternoon';
            } else if (hours >= 17 && hours < 20) {
                period = 'Evening';
            } else {
                period = 'Night';
            }
            timePeriod.textContent = period;
            
            // Calculate hand rotations
            const hoursDegrees = ((hours % 12 + minutes / 60) / 12) * 360;
            const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
            const secondsDegrees = (seconds / 60) * 360;
            
            // Rotate hands
            secondHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
            minuteHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
            hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;
            
            // Update background theme based on time
            updateTimeTheme(hours);
        }

        function updateTimeTheme(hour) {
            // Morning: 5am-11am (light blue sky, visible sun rising)
            // Afternoon: 12pm-4pm (bright blue sky, sun high)
            // Evening: 5pm-7pm (orange/pink sky, sun setting)
            // Night: 8pm-4am (dark blue/black sky, moon and stars)
            
            let backgroundColor, sunOpacity = 0, moonOpacity = 0, starOpacity = 0, cloudOpacity = 0;
            let sunPosition = { top: '50%', left: '50%' };
            let moonPosition = { top: '30%', left: '70%' };
            
            if (hour >= 5 && hour < 12) { // Morning
                backgroundColor = `rgb(${135 + (hour - 5) * 12}, ${206 + (hour - 5) * 5}, ${235})`;
                sunOpacity = 0.8;
                sunPosition = { top: `${70 - (hour - 5) * 5}%`, left: `${20 + (hour - 5) * 3}%` };
                cloudOpacity = 0.8;
            } else if (hour >= 12 && hour < 17) { // Afternoon
                backgroundColor = 'rgb(135, 206, 235)';
                sunOpacity = 1;
                sunPosition = { top: '30%', left: '50%' };
                cloudOpacity = 0.9;
            } else if (hour >= 17 && hour < 20) { // Evening
                backgroundColor = `rgb(${255 - (hour - 17) * 55}, ${125 - (hour - 17) * 35}, ${50 + (hour - 17) * 30})`;
                sunOpacity = 0.9 - (hour - 17) * 0.3;
                sunPosition = { top: `${30 + (hour - 17) * 10}%`, left: `${50 + (hour - 17) * 10}%` };
                moonOpacity = (hour - 17) * 0.3;
                starOpacity = (hour - 17) * 0.3;
            } else { // Night
                backgroundColor = 'rgb(25, 25, 50)';
                moonOpacity = 1;
                starOpacity = 1;
            }
            
            document.body.style.backgroundColor = backgroundColor;
            
            // Update sun
            sun.style.opacity = sunOpacity;
            sun.style.top = sunPosition.top;
            sun.style.left = sunPosition.left;
            
            // Update moon
            moon.style.opacity = moonOpacity;
            moon.style.top = moonPosition.top;
            moon.style.left = moonPosition.left;
            
            // Update stars
            stars.forEach(star => {
                star.style.opacity = starOpacity;
                if (starOpacity > 0) {
                    // Twinkle effect for stars at night
                    const twinkle = () => {
                        const newOpacity = 0.5 + Math.random() * 0.5;
                        star.style.opacity = starOpacity * newOpacity;
                        setTimeout(twinkle, Math.random() * 5000 + 1000);
                    };
                    setTimeout(twinkle, Math.random() * 3000);
                }
            });
            
            // Update clouds
            clouds.forEach(cloud => {
                cloud.style.opacity = cloudOpacity;
            });
        }

        // Set up control event listeners
        hourInput.addEventListener('change', () => {
            updateTimeFromInputs();
        });
        
        minuteInput.addEventListener('change', () => {
            updateTimeFromInputs();
        });
        
        secondInput.addEventListener('change', () => {
            updateTimeFromInputs();
        });
        
        function updateTimeFromInputs() {
            isUpdatingFromInput = true;
            const hours = parseInt(hourInput.value, 10) || 0;
            const minutes = parseInt(minuteInput.value, 10) || 0;
            const seconds = parseInt(secondInput.value, 10) || 0;
            
            const date = new Date();
            date.setHours(hours, minutes, seconds, 0);
            customTime = date.getTime();
            lastUpdateTime = Date.now();
            
            updateClock();
            isUpdatingFromInput = false;
        }
        
        updateBtn.addEventListener('click', () => {
            updateTimeFromInputs();
        });
        
        resetBtn.addEventListener('click', () => {
            customTime = null;
            updateClock();
        });
        
        autoUpdateToggle.addEventListener('change', () => {
            if (autoUpdateToggle.checked) {
                lastUpdateTime = Date.now();
            }
        });
        
        speedControl.addEventListener('change', () => {
            speedFactor = parseFloat(speedControl.value);
            lastUpdateTime = Date.now();
        });

        // Initialize the clock and start the interval
        function startClock() {
            // Update clock immediately
            updateClock();
            
            // Clear any existing interval
            if (clockInterval) {
                clearInterval(clockInterval);
            }
            
            // Start a new interval for updating the clock
            clockInterval = setInterval(() => {
                if (autoUpdateToggle.checked) {
                    updateClock();
                }
            }, 1000);
        }

        // Start the clock
        startClock();