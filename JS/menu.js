// menu.js
function toggleMenu() {
    const menu = document.querySelector('.hidden-menu');
    const button = document.querySelector('.menu-toggle');

    if (!menu || !button) {
        console.error('Меню или кнопка не найдены.');
        return;
    }

    // Переключение видимости меню
    menu.classList.toggle('visible');

    // Изменение символа кнопки
    button.textContent = menu.classList.contains('visible') ? '✖' : '☰';
}

document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);