const divFaceUsers = document.querySelector('.divfaceusers');
const divUserItems = document.querySelectorAll('.divuser1');
const totalItems = divUserItems.length;
let isUserDragging = false;
let startPosition = 0;
let currentTranslateX = 0;
let previousTranslateX = 0;
let animationFrameId;
let userIndex = 1; // Começamos no índice 1, pois clonaremos itens
const itemWidth = window.innerWidth * 0.5; // 50vw em pixels

// Clone o primeiro e o último item para criar o loop
const firstClone = divUserItems[0].cloneNode(true);
const lastClone = divUserItems[totalItems - 1].cloneNode(true);
divFaceUsers.appendChild(firstClone);
divFaceUsers.insertBefore(lastClone, divUserItems[0]);

const allItems = document.querySelectorAll('.divuser1'); // Atualizamos para incluir os clones

// Adiciona eventos de toque para mobile e mouse para desktop
allItems.forEach((item) => {
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

    // Arrasta para a próxima ou anterior com base em 50vw
    if (draggedBy < -itemWidth / 2) {
        userIndex++;
    }
    if (draggedBy > itemWidth / 2) {
        userIndex--;
    }

    updatePositionByIndex();

    // Verifica se estamos no clone e reposiciona para o loop
    if (userIndex === 0) {
        userIndex = totalItems; // Volta ao último item real
        setTimeout(() => {
            divFaceUsers.style.transition = 'none';
            updatePositionByIndex();
        }, 300);
    }

    if (userIndex === totalItems + 1) {
        userIndex = 1; // Volta ao primeiro item real
        setTimeout(() => {
            divFaceUsers.style.transition = 'none';
            updatePositionByIndex();
        }, 300);
    }
}

function getPosition(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function updateAnimation() {
    updateSliderPosition();
    if (isUserDragging) requestAnimationFrame(updateAnimation);
}

function updateSliderPosition() {
    allItems.forEach((item) => {
        item.style.transform = `translateX(${currentTranslateX}px)`;
    });
}

function updatePositionByIndex() {
    currentTranslateX = userIndex * -itemWidth;
    previousTranslateX = currentTranslateX;
    allItems.forEach((item) => {
        item.style.transform = `translateX(${currentTranslateX}px)`;
    });
    divFaceUsers.style.transition = 'transform 0.3s ease-in-out';
}
