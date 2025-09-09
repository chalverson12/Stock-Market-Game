// Game state variables
let gameData = {
    stockSymbol: '',
    stockData: [],
    currentDateIndex: 0,
    score: 0,
    chart: null,
    startDate: null,
    gameStarted: false
};

const API_KEY = 'U8CB7ISX127DVDAQ';
const API_BASE_URL = 'https://www.alphavantage.co/query';

// Brand colors for popular stocks
const STOCK_COLORS = {
    // Tech Giants
    'AAPL': { primary: '#007AFF', secondary: '#5AC8FA' }, // Apple Blue
    'MSFT': { primary: '#00BCF2', secondary: '#40E0D0' }, // Microsoft Blue
    'GOOGL': { primary: '#4285F4', secondary: '#34A853' }, // Google Blue/Green
    'GOOG': { primary: '#4285F4', secondary: '#34A853' }, // Google Blue/Green
    'AMZN': { primary: '#FF9900', secondary: '#232F3E' }, // Amazon Orange/Dark
    'META': { primary: '#1877F2', secondary: '#42B883' }, // Meta Blue
    'TSLA': { primary: '#CC0000', secondary: '#E31837' }, // Tesla Red
    'NVDA': { primary: '#76B900', secondary: '#00D4AA' }, // NVIDIA Green
    'NFLX': { primary: '#E50914', secondary: '#221F1F' }, // Netflix Red
    'CRM': { primary: '#00A1E0', secondary: '#1798C1' }, // Salesforce Blue
    
    // Financial
    'JPM': { primary: '#0066CC', secondary: '#003366' }, // JPMorgan Blue
    'BAC': { primary: '#E31837', secondary: '#012169' }, // Bank of America Red/Blue
    'WFC': { primary: '#D71E2B', secondary: '#FFD100' }, // Wells Fargo Red/Gold
    'GS': { primary: '#002A5C', secondary: '#0066CC' }, // Goldman Sachs Blue
    'MS': { primary: '#00529B', secondary: '#0099CC' }, // Morgan Stanley Blue
    'V': { primary: '#1A1F71', secondary: '#F7B600' }, // Visa Blue/Gold
    'MA': { primary: '#FF5F00', secondary: '#EB001B' }, // Mastercard Orange/Red
    'PYPL': { primary: '#003087', secondary: '#009CDE' }, // PayPal Blue
    
    // Consumer
    'KO': { primary: '#F40009', secondary: '#FFFFFF' }, // Coca-Cola Red
    'PEP': { primary: '#004B93', secondary: '#E32934' }, // Pepsi Blue/Red
    'MCD': { primary: '#FFC72C', secondary: '#DA020E' }, // McDonald's Yellow/Red
    'SBUX': { primary: '#00704A', secondary: '#F7F7F7' }, // Starbucks Green
    'NKE': { primary: '#111111', secondary: '#FF6900' }, // Nike Black/Orange
    'DIS': { primary: '#113CCF', secondary: '#FFD700' }, // Disney Blue/Gold
    'UBER': { primary: '#000000', secondary: '#1FBAD3' }, // Uber Black/Cyan
    'LYFT': { primary: '#FF00BF', secondary: '#352384' }, // Lyft Pink/Purple
    
    // Healthcare & Pharma
    'JNJ': { primary: '#CC0000', secondary: '#0066CC' }, // J&J Red/Blue
    'PFE': { primary: '#0093D0', secondary: '#00B5E2' }, // Pfizer Blue
    'ABBV': { primary: '#071D49', secondary: '#00A0DF' }, // AbbVie Dark Blue/Light Blue
    'MRK': { primary: '#0089CF', secondary: '#7CB518' }, // Merck Blue/Green
    
    // Energy
    'XOM': { primary: '#FF0000', secondary: '#000080' }, // Exxon Red/Blue
    'CVX': { primary: '#0066CC', secondary: '#FF6600' }, // Chevron Blue/Orange
    
    // Default colors for unknown tickers
    'DEFAULT': { primary: '#667eea', secondary: '#764ba2' }
};

// Update background gradient based on stock ticker
function updateBackgroundGradient(stockSymbol) {
    const colors = STOCK_COLORS[stockSymbol] || STOCK_COLORS['DEFAULT'];
    const gradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    
    // Apply the gradient to the body with smooth transition
    document.body.style.transition = 'background 1.5s ease-in-out';
    document.body.style.background = gradient;
    
    // Also update button colors to match the theme
    const startButton = document.getElementById('startGame');
    if (startButton) {
        startButton.style.background = gradient;
    }
    
    // Update prediction buttons and other elements
    const style = document.createElement('style');
    style.id = 'dynamic-theme';
    
    // Remove existing dynamic theme if it exists
    const existingStyle = document.getElementById('dynamic-theme');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    style.textContent = `
        .predict-btn.up {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%) !important;
        }
        .predict-btn.down {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
        }
        .next-btn {
            background: ${gradient} !important;
        }
        .info-card h3 {
            color: ${colors.primary} !important;
        }
        #stockChart {
            border: 2px solid ${colors.primary}15 !important;
            border-radius: 8px !important;
        }
    `;
    
    document.head.appendChild(style);
    
    console.log(`Updated theme for ${stockSymbol} with colors:`, colors);
}

// Utility function to format dates
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Check if a date is a weekday (Monday-Friday)
function isWeekday(date) {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
}

// Generate a random weekday date between 1-100 days ago
function generateRandomStartDate() {
    const today = new Date();
    const minDaysAgo = 7;
    const maxDaysAgo = 100;
    
    let attempts = 0;
    let randomDate;
    
    do {
        const daysAgo = Math.floor(Math.random() * (maxDaysAgo - minDaysAgo + 1)) + minDaysAgo;
        randomDate = new Date(today);
        randomDate.setDate(today.getDate() - daysAgo);
        attempts++;
    } while (!isWeekday(randomDate) && attempts < 50);
    
    return randomDate;
}

// Fetch stock data from Alpha Vantage API
async function fetchStockData(symbol) {
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(
            `${API_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}&outputsize=full`,
            { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Check for API errors
        if (data['Error Message']) {
            throw new Error('Invalid stock symbol. Please check the ticker and try again.');
        }
        
        if (data['Note']) {
            throw new Error('API call frequency limit reached. Please wait a minute and try again.');
        }
        
        if (data['Information']) {
            throw new Error('API call frequency limit reached. Please wait a minute and try again.');
        }
        
        const timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) {
            throw new Error('No data available for this symbol. Please try a different ticker.');
        }
        
        // Convert to array format and sort by date
        const stockArray = Object.entries(timeSeries).map(([date, values]) => ({
            date: date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'])
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return stockArray;
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
    }
}

// Find the index of the start date in the stock data
function findStartDateIndex(stockData, startDate) {
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Find the closest available date (market might be closed on the exact date)
    let closestIndex = -1;
    let closestDistance = Infinity;
    
    for (let i = 0; i < stockData.length; i++) {
        const stockDate = new Date(stockData[i].date);
        const distance = Math.abs(stockDate - startDate);
        
        if (distance < closestDistance && stockDate <= startDate) {
            closestDistance = distance;
            closestIndex = i;
        }
    }
    
    return closestIndex;
}

// Start the game
async function startGame() {
    const stockInput = document.getElementById('stockInput');
    const symbol = stockInput.value.trim().toUpperCase();
    
    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }
    
    // Show loading state
    const startButton = document.getElementById('startGame');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    startButton.disabled = true;
    loadingMessage.classList.add('show');
    errorMessage.classList.remove('show');
    
    try {
        // Fetch stock data
        const stockData = await fetchStockData(symbol);
        
        // Generate random start date
        const startDate = generateRandomStartDate();
        
        // Find the start date index in the stock data
        const startIndex = findStartDateIndex(stockData, startDate);
        
        if (startIndex < 7) {
            throw new Error('Not enough historical data available for this stock');
        }
        
        // Initialize game data
        gameData = {
            stockSymbol: symbol,
            stockData: stockData,
            currentDateIndex: startIndex,
            score: 0,
            chart: null,
            startDate: startDate,
            gameStarted: true
        };
        
        // Update background gradient based on stock brand colors
        updateBackgroundGradient(symbol);
        
        // Hide input section and show game section
        document.getElementById('inputSection').style.display = 'none';
        document.getElementById('gameSection').style.display = 'block';
        
        // Initialize the game UI
        initializeGameUI();
        
    } catch (error) {
        showError(error.message);
        startButton.disabled = false;
        loadingMessage.classList.remove('show');
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Initialize game UI
function initializeGameUI() {
    // Update stock symbol and current date
    document.getElementById('stockSymbol').textContent = gameData.stockSymbol;
    document.getElementById('currentDate').textContent = formatDate(gameData.stockData[gameData.currentDateIndex].date);
    document.getElementById('score').textContent = gameData.score;
    
    // Create the chart with initial 7 days of data
    createChart();
    
    // Show prediction section
    document.getElementById('predictionSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
}

// Create the stock chart
function createChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Get data for chart (7 days before current date + current date)
    const chartStartIndex = Math.max(0, gameData.currentDateIndex - 6);
    const chartData = gameData.stockData.slice(chartStartIndex, gameData.currentDateIndex + 1);
    
    const labels = chartData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const prices = chartData.map(item => item.close);
    
    // Get brand colors for the stock
    const colors = STOCK_COLORS[gameData.stockSymbol] || STOCK_COLORS['DEFAULT'];
    
    // Destroy existing chart if it exists
    if (gameData.chart) {
        gameData.chart.destroy();
    }
    
    gameData.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${gameData.stockSymbol} Stock Price`,
                data: prices,
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}20`, // 20% opacity
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `Stock Price History - ${gameData.stockSymbol}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: colors.secondary
                }
            }
        }
    });
}

// Make a prediction
function makePrediction(direction) {
    if (gameData.currentDateIndex >= gameData.stockData.length - 1) {
        alert('No more data available. Game over!');
        endGame();
        return;
    }
    
    const currentPrice = gameData.stockData[gameData.currentDateIndex].close;
    const nextPrice = gameData.stockData[gameData.currentDateIndex + 1].close;
    const actualDirection = nextPrice > currentPrice ? 'up' : 'down';
    
    const isCorrect = direction === actualDirection;
    
    // Update score
    if (isCorrect) {
        gameData.score++;
    }
    
    // Show result
    showPredictionResult(isCorrect, currentPrice, nextPrice, actualDirection);
    
    // Hide prediction section, show result section
    document.getElementById('predictionSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
}

// Show prediction result
function showPredictionResult(isCorrect, currentPrice, nextPrice, actualDirection) {
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    resultTitle.className = isCorrect ? 'correct' : 'incorrect';
    resultTitle.textContent = isCorrect ? '🎉 Correct!' : '❌ Incorrect!';
    
    const priceChange = nextPrice - currentPrice;
    const percentChange = ((priceChange / currentPrice) * 100).toFixed(2);
    const changeSymbol = priceChange >= 0 ? '+' : '';
    
    resultMessage.innerHTML = `
        The stock price ${actualDirection === 'up' ? 'increased' : 'decreased'} from 
        <strong>$${currentPrice.toFixed(2)}</strong> to <strong>$${nextPrice.toFixed(2)}</strong><br>
        Change: <strong>${changeSymbol}$${priceChange.toFixed(2)} (${changeSymbol}${percentChange}%)</strong>
    `;
}

// Continue to next day
function nextDay() {
    // Move to next day
    gameData.currentDateIndex++;
    
    // Update current date display
    document.getElementById('currentDate').textContent = formatDate(gameData.stockData[gameData.currentDateIndex].date);
    
    // Update score display
    document.getElementById('score').textContent = gameData.score;
    
    // Update chart with new data point
    updateChart();
    
    // Check if we have more data
    if (gameData.currentDateIndex >= gameData.stockData.length - 1) {
        alert(`Game Over! Your final score is ${gameData.score}. No more data available.`);
        endGame();
        return;
    }
    
    // Show prediction section, hide result section
    document.getElementById('predictionSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
}

// Update chart with new data point
function updateChart() {
    if (!gameData.chart) return;
    
    // Get updated data for chart (7 days before current date + current date)
    const chartStartIndex = Math.max(0, gameData.currentDateIndex - 6);
    const chartData = gameData.stockData.slice(chartStartIndex, gameData.currentDateIndex + 1);
    
    const labels = chartData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const prices = chartData.map(item => item.close);
    
    // Update chart data
    gameData.chart.data.labels = labels;
    gameData.chart.data.datasets[0].data = prices;
    gameData.chart.update();
}

// End game
function endGame() {
    const finalScore = gameData.score;
    const totalPredictions = gameData.currentDateIndex - findStartDateIndex(gameData.stockData, gameData.startDate);
    
    alert(`Game Over!\n\nFinal Score: ${finalScore}/${totalPredictions}\nAccuracy: ${totalPredictions > 0 ? ((finalScore/totalPredictions) * 100).toFixed(1) : 0}%`);
    
    // Reset background to default
    updateBackgroundGradient('DEFAULT');
    
    // Reset game
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Allow Enter key to start game and add input validation
document.addEventListener('DOMContentLoaded', function() {
    const stockInput = document.getElementById('stockInput');
    
    stockInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });
    
    // Auto-uppercase and validate input
    stockInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (value.length > 5) value = value.substring(0, 5); // Limit to 5 characters
        e.target.value = value;
        
        // Clear any existing error messages when user starts typing
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.classList.remove('show');
        
        // Preview theme color if it's a known stock
        if (value.length >= 2 && STOCK_COLORS[value]) {
            const colors = STOCK_COLORS[value];
            const previewGradient = `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`;
            document.body.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%), ${previewGradient}`;
            document.body.style.backgroundBlendMode = 'overlay';
        } else if (value.length === 0) {
            // Reset to default when input is cleared
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            document.body.style.backgroundBlendMode = 'normal';
        }
    });
    
    // Add some popular stock suggestions
    const suggestions = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'JNJ', 'V'];
    stockInput.setAttribute('placeholder', suggestions[Math.floor(Math.random() * suggestions.length)] + ' (example)');
});