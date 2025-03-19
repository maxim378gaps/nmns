// Создание звезд
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

createStars();

// Инициализация сетки
const grid = document.querySelector('.grid');
for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
}

// Управление количеством ловушек
const numTrapsElement = document.getElementById('num-traps');
const decreaseTrapsButton = document.getElementById('decrease-traps');
const increaseTrapsButton = document.getElementById('increase-traps');
const trapValues = [1, 3, 5, 7];
let currentTrapIndex = 2;

function updateTraps() {
    numTrapsElement.textContent = trapValues[currentTrapIndex];
}

decreaseTrapsButton.addEventListener('click', () => {
    if (currentTrapIndex > 0) {
        currentTrapIndex--;
        updateTraps();
    }
});

increaseTrapsButton.addEventListener('click', () => {
    if (currentTrapIndex < trapValues.length - 1) {
        currentTrapIndex++;
        updateTraps();
    }
});

updateTraps();

// Таймер
const timerBar = document.querySelector('.timer-bar');
const timerText = document.getElementById('timer-text');
const highlightButton = document.getElementById('highlight-btn');
let isTimerRunning = false;

function startTimer() {
    isTimerRunning = true;
    highlightButton.disabled = true;
    decreaseTrapsButton.disabled = true;
    increaseTrapsButton.disabled = true;
    timerText.textContent = "Wait for the next signal...";

    // Сохраняем время начала таймера
    const startTime = Date.now();
    localStorage.setItem('timerStartTime', startTime);

    // Сбрасываем ширину индикатора
    timerBar.style.transition = 'none';
    timerBar.style.width = '0';

    // Включаем анимацию и запускаем заполнение
    setTimeout(() => {
        timerBar.style.transition = 'width 15s linear';
        timerBar.style.width = '100%';
    }, 10);

    // Разблокируем кнопки через 15 секунд
    setTimeout(() => {
        isTimerRunning = false;
        highlightButton.disabled = false;
        decreaseTrapsButton.disabled = false;
        increaseTrapsButton.disabled = false;
        timerText.textContent = "Signal is available!";
        localStorage.removeItem('timerStartTime'); // Удаляем сохраненное время
    }, 15000);
}

function checkTimer() {
    const startTime = localStorage.getItem('timerStartTime');
    if (startTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(startTime, 10);
        const remainingTime = Math.max(0, 15000 - elapsedTime);

        if (remainingTime > 0) {
            isTimerRunning = true;
            highlightButton.disabled = true;
            decreaseTrapsButton.disabled = true;
            increaseTrapsButton.disabled = true;
            timerText.textContent = "Wait for the next signal...";

            // Устанавливаем ширину индикатора в соответствии с оставшимся временем
            const progress = (elapsedTime / 15000) * 100;
            timerBar.style.transition = 'none';
            timerBar.style.width = `${progress}%`;

            // Включаем анимацию и продолжаем заполнение
            setTimeout(() => {
                timerBar.style.transition = `width ${remainingTime}ms linear`;
                timerBar.style.width = '100%';
            }, 10);

            // Разблокируем кнопки через оставшееся время
            setTimeout(() => {
                isTimerRunning = false;
                highlightButton.disabled = false;
                decreaseTrapsButton.disabled = false;
                increaseTrapsButton.disabled = false;
                timerText.textContent = "Signal is available!";
                localStorage.removeItem('timerStartTime'); // Удаляем сохраненное время
            }, remainingTime);
        } else {
            localStorage.removeItem('timerStartTime'); // Удаляем сохраненное время, если таймер уже завершен
        }
    }
}

// Проверяем состояние таймера при загрузке страницы
checkTimer();

// Функция для открытия безопасных ячеек
highlightButton.addEventListener('click', () => {
    if (isTimerRunning) return;

    const safeCellsMapping = {
        1: 14, 3: 7, 5: 5, 7: 4
    };

    const bombs = trapValues[currentTrapIndex];
    const optimalSafeCells = safeCellsMapping[bombs];

    if (!optimalSafeCells) {
        alert('Please select a valid number of traps!');
        return;
    }

    // Очищаем все предыдущие подсветки
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('active'));

    // Случайный выбор безопасных ячеек
    const cells = Array.from(document.querySelectorAll('.cell'));
    const selectedIndices = [];

    while (selectedIndices.length < optimalSafeCells) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        if (!selectedIndices.includes(randomIndex)) {
            selectedIndices.push(randomIndex);
        }
    }

    // Подсвечиваем выбранные безопасные ячейки
    selectedIndices.forEach(index => cells[index].classList.add('active'));

    // Запускаем таймер
    startTimer();
});