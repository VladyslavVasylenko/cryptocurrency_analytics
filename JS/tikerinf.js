// Функция для получения данных о тикере через API Binance
async function fetchTickerData(ticker) {
    const apiUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${ticker.toUpperCase()}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Тикер не найден');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
}

// Функция для создания ссылки на сайт тикера
function createTickerLink(ticker) {
    const container = document.getElementById('tickerLinkContainer');
    container.innerHTML = ''; // Очистка контейнера

    const link = document.createElement('a');
    link.href = `https://www.binance.com/en/trade/${ticker.toLowerCase()}`;
    link.target = '_blank';
    link.textContent = `Перейти к ${ticker.toUpperCase()} на Binance`;
    link.style.display = 'block'

    container.appendChild(link);
}

// Функция обработки ввода тикера
async function handleTickerInput() {
    const input = document.getElementById('cryptoSymbol').value.trim();

    if (!input) {
        alert('Введите тикер');
        return;
    }

    const tickerData = await fetchTickerData(input);
    if (tickerData) {
        // Успешно получили данные — добавляем ссылку
        createTickerLink(input);
        console.log(`Текущая цена ${tickerData.symbol}: ${tickerData.price} USD`);
    } else {
        alert('Тикер не найден или произошла ошибка');
    }
}

// Добавляем обработчик на кнопку
document.getElementById('analyzeButton').addEventListener('click', handleTickerInput);