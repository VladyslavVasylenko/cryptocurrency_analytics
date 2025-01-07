let chartInstance = null;

async function getHistoricalData(symbol) {
    const interval = '1h'; // Интервал 1 час
    const limit = 168; // Последние 7 дней (24 * 7)

    try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
            params: { symbol, interval, limit },
        });

        const data = response.data.map(item => ({
            time: new Date(item[0]),
            close: parseFloat(item[4]),
        }));

        createChart(data);

        document.getElementById('selected-symbol').querySelector('span').innerText = symbol;

        const rsi = calculateRSI(data.map(item => item.close));
        document.getElementById('rsi').innerText = `RSI: ${rsi.toFixed(2)}`;

        const sma = calculateSMA(data.map(item => item.close), 14);
        document.getElementById('sma').innerText = `SMA: ${sma[sma.length - 1].toFixed(2)}`;

        const trend = getTrend(data);
        document.getElementById('trend-info').innerText = `Тренд: ${trend}`;

        const recommendation = trend === 'Восходящий' ? 'Продавать' : trend === 'Нисходящий' ? 'Покупать' : 'Нет сигнала';
        document.getElementById('recommendation').innerText = `Рекомендация: ${recommendation}`;

        document.getElementById('last-update').innerText = `Данные актуальны на: ${new Date().toLocaleString()}`;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}

function createChart(data) {
    const canvas = document.getElementById('priceChart');
    if (!canvas) {
        console.error('Элемент canvas с id "priceChart" не найден.');
        return;
    }

    const ctx = canvas.getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = data.map(item => item.time.toLocaleString());
    const closePrices = data.map(item => item.close);

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Цена',
                    data: closePrices,
                    borderColor: '#f3ba2f',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'SMA',
                    data: calculateSMA(closePrices, 14),
                    borderColor: '#2fa4f3',
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Отменяет сохранение пропорций
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
                legend: {
                    position: 'top',
                },
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false,
            },
            scales: {
                x: {
                    ticks: { maxRotation: 45 },
                },
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

function calculateSMA(data, period) {
    return data.map((_, index, arr) => {
        if (index < period - 1) return null;
        const slice = arr.slice(index - period + 1, index + 1);
        return slice.reduce((sum, value) => sum + value, 0) / period;
    });
}

function calculateRSI(data, period = 14) {
    const gains = [];
    const losses = [];
    for (let i = 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        gains.push(diff > 0 ? diff : 0);
        losses.push(diff < 0 ? Math.abs(diff) : 0);
    }
    const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
}

function getTrend(data) {
    const start = data[0].close;
    const end = data[data.length - 1].close;
    return end > start ? 'Восходящий' : end < start ? 'Нисходящий' : 'Боковой';
}

document.getElementById('analyzeButton').addEventListener('click', () => {
    const symbol = document.getElementById('cryptoSymbol').value.toUpperCase();
    if (symbol) {
        getHistoricalData(symbol);
    } else {
        alert('Введите тикер криптовалюты.');
    }
});
