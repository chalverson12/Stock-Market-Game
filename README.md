# Stock Market Prediction Game

A web-based game that tests your ability to predict stock market movements using real-time data from the Alpha Vantage API.

## 🎮 How to Play

1. Enter a valid stock ticker symbol (e.g., AAPL, MSFT, TSLA)
2. The game will randomly select a starting date (1-100 days ago, weekdays only)
3. View 7 days of historical price data leading up to the starting date
4. Predict whether the stock will go UP or DOWN the next day
5. See if you're correct and watch your score grow!
6. Continue day by day to test your market instincts

## 🚀 Features

- **Real Stock Data**: Uses Alpha Vantage API for actual market data
- **Interactive Charts**: Beautiful line charts showing price movements
- **Smart Date Selection**: Automatically selects valid trading days
- **Responsive Design**: Works on desktop and mobile devices
- **Score Tracking**: Keep track of your prediction accuracy
- **Error Handling**: Validates stock symbols and handles API errors

## 🛠️ Technologies Used

- HTML5
- CSS3 (with modern gradients and animations)
- Vanilla JavaScript
- Chart.js for data visualization
- Alpha Vantage API for real-time stock data

## 📊 API Information

This game uses the Alpha Vantage API to fetch real stock market data. The API provides:
- Daily time series data
- Open, high, low, close prices
- Trading volume information
- Support for major stock exchanges

## 🎯 Game Rules

- **5 Round Format**: Each game consists of exactly 5 prediction rounds
- **Weekdays Only**: Only weekday (Monday-Friday) dates are used for predictions
- **Random Start Date**: Starting dates are randomly selected between 1-100 days ago
- **Historical Context**: You see 7 days of historical data before making predictions
- **Scoring**: Score increases by 1 for each correct prediction (max score: 5/5)
- **High Score Tracking**: Your best score is saved and you're notified of new records
- **Game Over**: After 5 rounds, see your final results and compare to your high score

## 🌐 Live Demo

Visit the live game at: https://chalverson12.github.io/Stock-Market-Game/

## 🎮 Game Features

- **Real-Time Stock Data**: Fetches actual market data using Alpha Vantage API
- **High Score System**: Track your best performance over exactly 5 rounds with persistent storage
- **Dynamic Brand Theming**: Background and UI colors change based on the stock's brand colors
- **Smart Date Selection**: Automatically selects valid trading days (weekdays only)
- **Interactive Predictions**: Make UP/DOWN predictions and track your accuracy
- **Beautiful Visualizations**: Dynamic charts that update with each prediction and match brand colors
- **Live Color Preview**: See theme colors change as you type popular stock symbols
- **Game Over Celebration**: Special messages for perfect scores and new records
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Persistent Progress**: High scores are saved locally and persist between sessions

### 🎨 Supported Brand Colors
The game includes custom color themes for 30+ popular stocks including:
- **Tech**: AAPL (Apple Blue), MSFT (Microsoft Blue), GOOGL (Google), TSLA (Tesla Red), NVDA (NVIDIA Green)
- **Financial**: JPM (JPMorgan Blue), V (Visa Blue/Gold), MA (Mastercard Orange/Red)
- **Consumer**: KO (Coca-Cola Red), MCD (McDonald's Yellow/Red), DIS (Disney Blue/Gold)
- And many more! Unknown tickers use a beautiful default gradient.

## 📝 License

This project is open source and available under the MIT License.