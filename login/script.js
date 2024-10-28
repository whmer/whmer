const divFaceUsers = document.querySelector('.divfaceusers');
const divUserItems = document.querySelectorAll('.divuser1');
const totalItems = divUserItems.length;
let isUserDragging = false;
let startPosition = 0;
let currentTranslateX = 0;
let previousTranslateX = 0;
let animationFrameId;
let userIndex = 0;
const itemWidth = window.innerWidth * 0.5;

// Adiciona eventos de toque para mobile e mouse para desktop
divUserItems.forEach((item) => {
    item.addEventListener('touchstart', handleTouchStart);
    item.addEventListener('touchmove', handleTouchMove);
    item.addEventListener('touchend', handleTouchEnd);

    item.addEventListener('mousedown', handleTouchStart);
    item.addEventListener('mousemove', handleTouchMove);
    item.addEventListener('mouseup', handleTouchEnd);
    item.addEventListener('mouseleave', handleTouchEnd);
});

function handleTouchStart(event) {
    isUserDragging = true;
    startPosition = getPosition(event);
    animationFrameId = requestAnimationFrame(updateAnimation);
}

function handleTouchMove(event) {
    if (!isUserDragging) return;
    const currentPosition = getPosition(event);
    currentTranslateX = previousTranslateX + currentPosition - startPosition;
    updateSliderPosition();
}

function handleTouchEnd() {
    cancelAnimationFrame(animationFrameId);
    isUserDragging = false;

    const draggedBy = currentTranslateX - previousTranslateX;

    // Verifica se arrastou mais de meio item para a esquerda ou direita
    if (draggedBy < -itemWidth / 2 && userIndex < totalItems - 1) {
        userIndex++;
    }
    if (draggedBy > itemWidth / 2 && userIndex > 0) {
        userIndex--;
    }

    divFaceUsers.style.transition = 'transform 0.3s ease-in-out';
    updatePositionByIndex();
}

function getPosition(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function updateAnimation() {
    updateSliderPosition();
    if (isUserDragging) requestAnimationFrame(updateAnimation);
}

function updateSliderPosition() {
    divUserItems.forEach((item) => {
        item.style.transform = `translateX(${currentTranslateX}px)`;
    });
}

function updatePositionByIndex() {
    currentTranslateX = userIndex * -itemWidth;
    previousTranslateX = currentTranslateX;
    divUserItems.forEach((item) => {
        item.style.transform = `translateX(${currentTranslateX}px)`;
    });
}
