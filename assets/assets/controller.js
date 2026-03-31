document.addEventListener('DOMContentLoaded', () => {
    // --- Original Calculator Logic ---
    const form = document.getElementById('form');
    const resultado = document.getElementById('resultado');
    const mensagem = document.getElementById('mensagem');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const nota1 = parseInt(document.getElementById("nota1").value);
        const nota2 = parseInt(document.getElementById("nota2").value);
        const nota3 = parseInt(document.getElementById("nota3").value);

        const media = Math.round((nota1 + nota2 + nota3) / 3);

        if (media > 59) {
            mensagem.innerText = `Parabéns, ${name}! Sua média é ${media}`;
        } else {
            mensagem.innerText = `Lamento, ${name}! Sua média é ${media}`;
        }

        resultado.style.display = 'block';
    });

    // --- Window Management ---
    const calcWindow = document.getElementById('calculator-window');
    const calcIcon = document.getElementById('calculator-icon');
    const titleBar = calcWindow.querySelector('.window-title-bar');
    const closeBtn = calcWindow.querySelector('.close');
    const minimizeBtn = calcWindow.querySelector('.minimize');
    const maximizeBtn = calcWindow.querySelector('.maximize');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const activeTasks = document.getElementById('active-tasks');

    let taskbarButton = null;

    // Desktop Icon Double Click
    calcIcon.addEventListener('dblclick', () => {
        if (calcWindow.style.display === 'none' || !calcWindow.style.display) {
            openCalculator();
        }
    });

    function openCalculator() {
        calcWindow.style.display = 'flex';
        calcWindow.classList.remove('minimized');
        
        // Center window on first open
        if (!calcWindow.style.top) {
            calcWindow.style.top = '100px';
            calcWindow.style.left = '100px';
        }

        // Create Taskbar Button if not exists
        if (!taskbarButton) {
            taskbarButton = document.createElement('div');
            taskbarButton.className = 'taskbar-button active';
            taskbarButton.innerHTML = `
                <img src="images/Windows XP Icons/Calculator.png" class="taskbar-icon">
                <span>Calculadora de Média</span>
            `;
            taskbarButton.addEventListener('click', toggleMinimize);
            activeTasks.appendChild(taskbarButton);
        } else {
            taskbarButton.classList.add('active');
        }
    }

    function toggleMinimize() {
        if (calcWindow.style.display === 'none') {
            calcWindow.style.display = 'flex';
            taskbarButton.classList.add('active');
        } else {
            calcWindow.style.display = 'none';
            taskbarButton.classList.remove('active');
        }
    }

    // Close Window
    closeBtn.addEventListener('click', () => {
        calcWindow.style.display = 'none';
        if (taskbarButton) {
            taskbarButton.remove();
            taskbarButton = null;
        }
    });

    // Minimize button in window
    minimizeBtn.addEventListener('click', () => {
        calcWindow.style.display = 'none';
        if (taskbarButton) {
            taskbarButton.classList.remove('active');
        }
    });

    // Maximize
    let isMaximized = false;
    let originalRect = null;

    maximizeBtn.addEventListener('click', () => {
        if (!isMaximized) {
            originalRect = calcWindow.getBoundingClientRect();
            calcWindow.style.top = '0';
            calcWindow.style.left = '0';
            calcWindow.style.width = '100%';
            calcWindow.style.height = 'calc(100% - 30px)';
            isMaximized = true;
        } else {
            calcWindow.style.top = originalRect.top + 'px';
            calcWindow.style.left = originalRect.left + 'px';
            calcWindow.style.width = originalRect.width + 'px';
            calcWindow.style.height = originalRect.height + 'px';
            isMaximized = false;
        }
    });

    // Drag and Drop
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    titleBar.addEventListener('mousedown', (e) => {
        if (isMaximized) return;
        
        try {
            isDragging = true;
            dragOffsetX = e.clientX - calcWindow.offsetLeft;
            dragOffsetY = e.clientY - calcWindow.offsetTop;
            calcWindow.style.zIndex = 1000;
            
            // Força o cursor padrão durante o arraste (XP behavior)
            document.body.style.cursor = 'default';
            
            // Make active in taskbar when clicked/dragged
            if (taskbarButton) taskbarButton.classList.add('active');
        } catch (err) {
            console.error("Error starting drag:", err);
            stopDragging();
        }
    });

    function stopDragging() {
        isDragging = false;
        document.body.style.cursor = ''; // Restaura o cursor original
    }

    // Resizing
    let isResizing = false;
    let currentResizer = null;

    const resizers = calcWindow.querySelectorAll('.resize-handle');
    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', (e) => {
            if (isMaximized) return;
            isResizing = true;
            currentResizer = resizer;
            calcWindow.style.zIndex = 1000;
            e.preventDefault();
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            try {
                calcWindow.style.left = (e.clientX - dragOffsetX) + 'px';
                calcWindow.style.top = (e.clientY - dragOffsetY) + 'px';
            } catch (err) {
                console.error("Error during dragging:", err);
                stopDragging();
            }
        }

        if (isResizing) {
            const rect = calcWindow.getBoundingClientRect();
            if (currentResizer.classList.contains('e')) {
                calcWindow.style.width = (e.clientX - rect.left) + 'px';
            } else if (currentResizer.classList.contains('s')) {
                calcWindow.style.height = (e.clientY - rect.top) + 'px';
            } else if (currentResizer.classList.contains('w')) {
                const newWidth = rect.right - e.clientX;
                if (newWidth > 300) {
                    calcWindow.style.width = newWidth + 'px';
                    calcWindow.style.left = e.clientX + 'px';
                }
            } else if (currentResizer.classList.contains('n')) {
                const newHeight = rect.bottom - e.clientY;
                if (newHeight > 200) {
                    calcWindow.style.height = newHeight + 'px';
                    calcWindow.style.top = e.clientY + 'px';
                }
            } else if (currentResizer.classList.contains('se')) {
                calcWindow.style.width = (e.clientX - rect.left) + 'px';
                calcWindow.style.height = (e.clientY - rect.top) + 'px';
            } else if (currentResizer.classList.contains('sw')) {
                const newWidth = rect.right - e.clientX;
                const newHeight = e.clientY - rect.top;
                if (newWidth > 300) {
                    calcWindow.style.width = newWidth + 'px';
                    calcWindow.style.left = e.clientX + 'px';
                }
                calcWindow.style.height = newHeight + 'px';
            } else if (currentResizer.classList.contains('ne')) {
                const newWidth = e.clientX - rect.left;
                const newHeight = rect.bottom - e.clientY;
                calcWindow.style.width = newWidth + 'px';
                if (newHeight > 200) {
                    calcWindow.style.height = newHeight + 'px';
                    calcWindow.style.top = e.clientY + 'px';
                }
            } else if (currentResizer.classList.contains('nw')) {
                const newWidth = rect.right - e.clientX;
                const newHeight = rect.bottom - e.clientY;
                if (newWidth > 300) {
                    calcWindow.style.width = newWidth + 'px';
                    calcWindow.style.left = e.clientX + 'px';
                }
                if (newHeight > 200) {
                    calcWindow.style.height = newHeight + 'px';
                    calcWindow.style.top = e.clientY + 'px';
                }
            }
        }
    });

    document.addEventListener('mouseup', () => {
        stopDragging();
        isResizing = false;
        currentResizer = null;
    });



    // --- Taskbar & Start Menu ---
    startButton.addEventListener('click', (e) => {
        startMenu.classList.toggle('hidden');
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) {
            startMenu.classList.add('hidden');
        }
    });

    // Clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').innerText = `${hours}:${minutes}`;
    }
    setInterval(updateClock, 1000);
    updateClock();
});
