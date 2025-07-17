document.addEventListener('DOMContentLoaded', function() {
  // Initialize booking page without requiring authentication
  initializeBookingPage();

  // Weather API configuration
  const WEATHER_API_KEY = '645c3704f8d5416979ca31e2c072cab4'; 
  const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
  
  // IIEST Shibpur coordinates
  const LOCATION = {
    lat: 22.5558,
    lon: 88.3087,
    name: 'IIEST Shibpur, Howrah'
  };

  // Email verification state
  let isEmailVerified = false;
  let otpSent = false;

  function initializeBookingPage() {
    // Get room type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('type');
    
    if (!roomType) {
      window.location.href = 'rooms.html';
      return;
    }

    // Load room data and initialize form
    loadRoomData(roomType);
    setupFormEventListeners();
    setupDateValidation();
    initializeAttractionsAndTransportation();
    setupPaymentModal();
    setupEmailVerification(); // NEW: Setup email verification
  }

  async function loadRoomData(roomType) {
    try {
      // Show loading
      const roomSummary = document.getElementById('room-summary');
      roomSummary.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading room details...</p>
        </div>
      `;

      // Use mock data for now since backend might not be ready
      const roomData = {
        'double-bed-ac': {
          _id: '1',
          title: 'Double Bed AC Room',
          type: 'double-bed-ac',
          description: 'Comfortable double bed room with air conditioning and attached bathroom.',
          features: [
            { icon: 'fa-bed', name: 'Double Bed' },
            { icon: 'fa-wind', name: 'Air Conditioning' },
            { icon: 'fa-shower', name: 'Attached Bathroom' },
            { icon: 'fa-wifi', name: 'Free WiFi' },
            { icon: 'fa-tv', name: 'Television' },
            { icon: 'fa-couch', name: 'Sofa' }
          ],
          images: [
            'images/dbr1-1.jpg'
          ],
          capacity: 2,
          totalRooms: 4
        },
        'twin-bed-ac': {
          _id: '2',
          title: 'Twin Bed AC Room',
          type: 'twin-bed-ac',
          description: 'Room with two separate single beds, air conditioning and attached bathroom.',
          features: [
            { icon: 'fa-bed', name: 'Twin Beds' },
            { icon: 'fa-wind', name: 'Air Conditioning' },
            { icon: 'fa-shower', name: 'Attached Bathroom' },
            { icon: 'fa-wifi', name: 'Free WiFi' },
            { icon: 'fa-tv', name: 'Television' },
            { icon: 'fa-couch', name: 'Sofa' }
          ],
          images: [
            'images/dsb1.jpg'
          ],
          capacity: 2,
          totalRooms: 4
        }
      };

      const room = roomData[roomType];

      if (!room) {
        throw new Error('Room type not found');
      }

      // Display room summary with availability section
      displayRoomSummary(room);
      
      // Store room data globally for form submission
      window.selectedRoom = room;

    } catch (error) {
      console.error('Error loading room data:', error);
      document.getElementById('room-summary').innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load room details. Please try again.</p>
          <button onclick="window.location.reload()" class="primary-btn">Retry</button>
        </div>
      `;
    }
  }

  function displayRoomSummary(room) {
    const roomSummary = document.getElementById('room-summary');
    
    roomSummary.innerHTML = `
      <div class="summary-image">
        <img src="${room.images[0]}" alt="${room.title}">
      </div>
      <div class="summary-details">
        <h2 class="summary-title">${room.title}</h2>
        <p class="summary-description">${room.description}</p>
        <div class="summary-features">
          ${room.features.map(feature => 
            `<div class="summary-feature">
              <i class="fas ${feature.icon}"></i> ${feature.name}
            </div>`
          ).join('')}
        </div>
        <div class="summary-capacity">Capacity: ${room.capacity} guests per room</div>
        
        <!-- Real-time Availability Section -->
        <div class="room-availability-section">
          <h3><i class="fas fa-calendar-check"></i> Room Availability</h3>
          <div class="availability-info">
            <div class="total-rooms">
              <i class="fas fa-building"></i>
              <span>Total Rooms: ${room.totalRooms}</span>
            </div>
            <div class="availability-status" id="room-availability-status">
              <i class="fas fa-info-circle"></i>
              <span>Select dates to check availability</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Update booking summary
    document.getElementById('summary-room-type').textContent = room.title;
  }

  function initializeAttractionsAndTransportation() {
    // Create attractions and transportation section after weather forecast
    const bookingInfo = document.querySelector('.booking-info');
    const guestHouseLat = 22.5558;
    const guestHouseLng = 88.3087;

    
    // Add attractions and transportation section
    const attractionsTransportSection = document.createElement('div');
    attractionsTransportSection.className = 'attractions-transport-section';
    attractionsTransportSection.innerHTML = `
      <h3><i class="fas fa-compass"></i> Nearby Attractions & Transportation</h3>
      <div class="attractions-transport-container">
        <div class="nearby-attractions">
          <h4><i class="fas fa-map-marked-alt"></i> Nearby Attractions</h4>
          <div class="attractions-table">
            ${generateAttractionsList()}
          </div>
        </div>
        
        <div class="transportation-info">
          <h4><i class="fas fa-bus"></i> Transportation</h4>
          <div class="transport-options">
            <a class="transport-option" href="https://www.google.com/maps/dir/?api=1&origin=${guestHouseLat},${guestHouseLng}&destination=Shalimar Railway Station" target="_blank" rel="noopener">
              <i class="fas fa-train"></i>
              <span>Shalimar Railway Station (2 km)</span>
            </a>
            <a class="transport-option" href="https://www.google.com/maps/dir/?api=1&origin=${guestHouseLat},${guestHouseLng}&destination=Howrah Maidan metro Station" target="_blank" rel="noopener">
              <i class="fas fa-subway"></i>
              <span>Howrah Maidan Metro Station (8 km)</span>
            </a>
            <a class="transport-option" href="https://www.google.com/maps/dir/?api=1&origin=${guestHouseLat},${guestHouseLng}&destination=Netaji Subhash Chandra International Airport" target="_blank" rel="noopener">
              <i class="fas fa-plane"></i>
              <span>Netaji Subhash Airport (25 km)</span>
            </a>
            <div class="transport-option">
              <i class="fas fa-bus"></i>
              <span>Regular Bus Services</span>
            </div>
            <div class="transport-option">
              <i class="fas fa-taxi"></i>
              <span>Taxi & Auto Available</span>
            </div>
            <div class="transport-option">
              <i class="fas fa-car"></i>
              <span>Parking Available</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Insert at the end of booking-info
    bookingInfo.appendChild(attractionsTransportSection);
  }

  function generateAttractionsList() {
    const GUEST_HOUSE_COORDS = { lat: 22.5558, lng: 88.3087 };
    const attractions = [
      {
        name: 'Howrah Bridge',
        distance: '7 km',
        icon: 'fa-bridge-water',
        destination: 'Howrah Bridge, Howrah, West Bengal, India'
      },
      {
        name: 'Victoria Memorial',
        distance: '8 km',
        icon: 'fa-monument',
        destination: 'Victoria Memorial, 1, Queens Way, Maidan, Kolkata, West Bengal, India'
      },
      {
        name: 'Indian Museum',
        distance: '9 km',
        icon: 'fa-university',
        destination: 'Indian Museum, 27, Jawaharlal Nehru Road, Chowringhee, Kolkata, West Bengal, India'
      },
      {
        name: 'Dakshineswar Temple',
        distance: '15 km',
        icon: 'fa-place-of-worship',
        destination: 'Dakshineswar Kali Temple, Dakshineswar, Kolkata, West Bengal, India'
      },
      {
        name: 'Belur Math',
        distance: '12 km',
        icon: 'fa-om',
        destination: 'Belur Math, Belur, Howrah, West Bengal, India'
      },
      {
        name: 'Eden Gardens',
        distance: '9 km',
        icon: 'fa-baseball-ball',
        destination: 'Eden Gardens, 1, Eden Gardens, B.B.D. Bagh, Kolkata, West Bengal, India'
      },
      {
        name: 'Botanical Garden',
        distance: '2 km',
        icon: 'fa-tree',
        destination: 'Acharya Jagadish Chandra Bose Indian Botanic Garden, Shibpur, Howrah, West Bengal, India'
      },
      {
        name: 'Princep Ghat',
        distance: '7 km',
        icon: 'fa-water',
        destination: 'Princep Ghat, Strand Road, Babu Ghat, Kolkata, West Bengal, India'
      },
      {
        name: 'Science City',
        distance: '14 km',
        icon: 'fa-rocket',
        destination: 'Science City, JBS Haldane Avenue, Kolkata, West Bengal, India'
      },
      {
        name: 'Millennium Park',
        distance: '9 km',
        icon: 'fa-leaf',
        destination: 'Millennium Park, Strand Road, B.B.D. Bagh, Kolkata, West Bengal, India'
      }
    ];

    return attractions.map(attraction => `
      <a class="attraction-item" href="https://www.google.com/maps/dir/?api=1&origin=${GUEST_HOUSE_COORDS.lat},${GUEST_HOUSE_COORDS.lng}&destination=${encodeURIComponent(attraction.destination)}" target="_blank" rel="noopener">
        <div class="attraction-icon">
          <i class="fas ${attraction.icon}"></i>
        </div>
        <div class="attraction-info">
          <div class="attraction-name">${attraction.name}</div>
          <div class="attraction-distance">
            <i class="fas fa-map-marker-alt"></i>
            <span>${attraction.distance}</span>
          </div>
        </div>
      </a>
    `).join('');
  }
function setupDateValidation() {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const checkInInput = document.getElementById('check-in');
  const checkOutInput = document.getElementById('check-out');

  // Enable both inputs
  checkInInput.disabled = false;
  checkOutInput.disabled = false;

  // Initialize Flatpickr on check-in input
  flatpickr(checkInInput, {
    altInput: true,
    altFormat: "d-m-Y",     // Shown to user
    dateFormat: "Y-m-d",    // Sent to backend
    minDate: today,
    maxDate: maxDate,
    onChange: function (selectedDates) {
      if (selectedDates.length > 0) {
        const checkInDate = selectedDates[0];

        // Calculate min checkout date
        const minCheckout = new Date(checkInDate);
        minCheckout.setDate(minCheckout.getDate() + 1);

        // Reinitialize checkout picker
        flatpickr(checkOutInput, {
          altInput: true,
          altFormat: "d-m-Y",
          dateFormat: "Y-m-d",
          minDate: minCheckout,
          maxDate: maxDate,
        });

        checkOutInput.disabled = false;

        // Optional: Clear any previous value
        checkOutInput.value = '';

        updateBookingSummary();
        checkRoomAvailabilityForDates();
        checkWeatherForecast();
      }
    }
  });

  // Optional: Add listener to update when check-out changes
  checkOutInput.addEventListener('change', () => {
    updateBookingSummary();
    checkRoomAvailabilityForDates();
  });
}



  // NEW: Check room availability when dates are selected
  async function checkRoomAvailabilityForDates() {
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const availabilityStatus = document.getElementById('room-availability-status');
    
    if (!checkInInput.value || !checkOutInput.value || !window.selectedRoom) {
      availabilityStatus.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Select dates to check availability</span>
      `;
      availabilityStatus.style.color = 'var(--text-muted)';
      return;
    }
    
    try {
      // Show loading
      availabilityStatus.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>Checking availability...</span>
      `;
      availabilityStatus.style.color = 'var(--primary-color)';
      
      const response = await fetch(`http://localhost:3000/api/bookings/availability?roomType=${window.selectedRoom.type}&checkIn=${checkInInput.value}&checkOut=${checkOutInput.value}`);
      const data = await response.json();
      
      if (response.ok) {
        const { totalRooms, bookedRooms, availableRooms } = data;
        
        if (availableRooms > 0) {
          availabilityStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${availableRooms} of ${totalRooms} rooms available</span>
            ${bookedRooms > 0 ? `<br><small style="font-size: 0.8rem; opacity: 0.8;">(${bookedRooms} currently booked for these dates)</small>` : ''}
          `;
          availabilityStatus.style.color = 'var(--success-color)';
        } else {
          availabilityStatus.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <span>Fully booked for selected dates</span>
            <br><small style="font-size: 0.8rem; opacity: 0.8;">(${totalRooms} rooms all booked)</small>
          `;
          availabilityStatus.style.color = 'var(--danger-color)';
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Availability check error:', error);
      availabilityStatus.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Unable to check availability</span>
      `;
      availabilityStatus.style.color = 'var(--warning-color)';
    }
  }

  async function checkWeatherForecast() {
    const checkInInput = document.getElementById('check-in');
    let weatherContainer = document.querySelector('.weather-forecast');
    
    if (!checkInInput.value) {
      if (weatherContainer) {
        weatherContainer.style.display = 'none';
      }
      return;
    }
    
    const checkInDate = new Date(checkInInput.value);
    const today = new Date();
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);
    
    const daysDifference = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
    
    // Show weather forecast only if check-in is within 7 days from today
    if (daysDifference >= 0 && daysDifference <= 7) {
      await loadWeatherForecast(checkInDate);
    } else {
      if (weatherContainer) {
        weatherContainer.style.display = 'none';
      }
      
      // Show a message about weather availability
      if (daysDifference > 7) {
        showWeatherUnavailableMessage(daysDifference);
      }
    }
  }

  function showWeatherUnavailableMessage(daysFromNow) {
    let weatherContainer = document.querySelector('.weather-forecast');
    if (!weatherContainer) {
      weatherContainer = document.createElement('div');
      weatherContainer.className = 'weather-forecast';
      
      const attractionsTransportSection = document.querySelector('.attractions-transport-section');
      attractionsTransportSection.parentNode.insertBefore(weatherContainer, attractionsTransportSection);
    }
    
    weatherContainer.style.display = 'block';
    weatherContainer.innerHTML = `
      <h3><i class="fas fa-cloud-sun"></i> Weather Forecast</h3>
      <div class="weather-info">
        <i class="fas fa-info-circle" style="color: #17a2b8; font-size: 2rem; margin-bottom: 1rem;"></i>
        <p style="color: #6c757d; text-align: center;">
          Weather forecast is available only for bookings within the next 7 days.<br>
          Your check-in is ${daysFromNow} days from now.
        </p>
        <p style="color: #6c757d; text-align: center; font-size: 0.9rem;">
          <strong>Tip:</strong> Check the weather closer to your travel date for the most accurate forecast.
        </p>
      </div>
    `;
  }

  async function loadWeatherForecast(checkInDate) {
    try {
      // Create weather container if it doesn't exist
      let weatherContainer = document.querySelector('.weather-forecast');
      if (!weatherContainer) {
        weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-forecast';
        
        // Insert before attractions and transportation section
        const attractionsTransportSection = document.querySelector('.attractions-transport-section');
        attractionsTransportSection.parentNode.insertBefore(weatherContainer, attractionsTransportSection);
      }
      
      // Show loading
      weatherContainer.style.display = 'block';
      weatherContainer.innerHTML = `
        <h3><i class="fas fa-cloud-sun"></i> Weather Forecast</h3>
        <div class="weather-loading">
          <div class="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      `;
      
      // Check if API key is set
      if (WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
        throw new Error('Weather API key not configured');
      }
      
      // Fetch current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${WEATHER_API_URL}/weather?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${WEATHER_API_KEY}&units=metric`),
        fetch(`${WEATHER_API_URL}/forecast?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${WEATHER_API_KEY}&units=metric`)
      ]);
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Weather API request failed');
      }
      
      const currentWeather = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      
      // Process forecast data starting from check-in date
      const dailyForecasts = processForecastData(forecastData, checkInDate);
      
      // Display weather information
      displayWeatherForecast(currentWeather, dailyForecasts, checkInDate);
      
    } catch (error) {
      console.error('Weather API error:', error);
      
      // Show error message
      const weatherContainer = document.querySelector('.weather-forecast');
      if (weatherContainer) {
        weatherContainer.innerHTML = `
          <h3><i class="fas fa-cloud-sun"></i> Weather Forecast</h3>
          <div class="weather-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Weather data unavailable. Please configure your OpenWeatherMap API key.</p>
            <small>Get your free API key at <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap</a></small>
          </div>
        `;
      }
    }
  }

  function processForecastData(forecastData, checkInDate) {
    const dailyData = {};
    
    // Group forecasts by date
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: date,
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].conditions.push({
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      });
      dailyData[dateKey].humidity.push(item.main.humidity);
      dailyData[dateKey].windSpeed.push(item.wind.speed);
    });
    
    // Get forecasts starting from check-in date for 3 days
    const dailyForecasts = [];
    const startDate = new Date(checkInDate);
    
    for (let i = 0; i < 3; i++) {
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + i);
      const dateKey = targetDate.toDateString();
      
      if (dailyData[dateKey]) {
        const dayData = dailyData[dateKey];
        
        // Calculate averages and get most common condition
        const avgTemp = Math.round(dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length);
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));
        const avgHumidity = Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length);
        const avgWindSpeed = Math.round(dayData.windSpeed.reduce((a, b) => a + b, 0) / dayData.windSpeed.length);
        
        // Get most frequent weather condition
        const conditionCounts = {};
        dayData.conditions.forEach(condition => {
          const key = condition.main;
          conditionCounts[key] = (conditionCounts[key] || 0) + 1;
        });
        
        const mostCommonCondition = Object.keys(conditionCounts).reduce((a, b) => 
          conditionCounts[a] > conditionCounts[b] ? a : b
        );
        
        const representativeCondition = dayData.conditions.find(c => c.main === mostCommonCondition);
        
        dailyForecasts.push({
          date: targetDate,
          avgTemp,
          maxTemp,
          minTemp,
          condition: representativeCondition,
          humidity: avgHumidity,
          windSpeed: avgWindSpeed
        });
      }
    }
    
    return dailyForecasts;
  }

  function displayWeatherForecast(currentWeather, dailyForecasts, checkInDate) {
    const weatherContainer = document.querySelector('.weather-forecast');
    
    const currentTemp = Math.round(currentWeather.main.temp);
    const currentCondition = currentWeather.weather[0];
    const today = new Date();
    const isCheckInToday = checkInDate.toDateString() === today.toDateString();
    
    weatherContainer.innerHTML = `
      <h3><i class="fas fa-cloud-sun"></i> Weather Forecast for ${LOCATION.name}</h3>
      
      ${isCheckInToday ? `
      <!-- Current Weather (only show if check-in is today) -->
      <div class="current-weather">
        <div class="current-weather-main">
          <img src="https://openweathermap.org/img/wn/${currentCondition.icon}@2x.png" 
               alt="${currentCondition.description}" class="weather-icon">
          <div class="current-temp">${currentTemp}°C</div>
          <div class="current-condition">${currentCondition.description}</div>
        </div>
        <div class="current-details">
          <div class="detail-item">
            <i class="fas fa-tint"></i>
            <span>Humidity: ${currentWeather.main.humidity}%</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-wind"></i>
            <span>Wind: ${Math.round(currentWeather.wind.speed)} m/s</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-thermometer-half"></i>
            <span>Feels like: ${Math.round(currentWeather.main.feels_like)}°C</span>
          </div>
        </div>
      </div>
      ` : ''}
      
      <!-- 3-Day Forecast starting from check-in date -->
      <div class="forecast-days">
        <h4>3-Day Forecast from Check-in Date</h4>
        <div class="forecast-grid">
          ${dailyForecasts.map((day, index) => {
            const dayLabel = getDayLabel(day.date, checkInDate, index);
            return `
            <div class="forecast-day">
              <div class="forecast-date">${dayLabel}</div>
              <img src="https://openweathermap.org/img/wn/${day.condition.icon}.png" 
                   alt="${day.condition.description}" class="forecast-icon">
              <div class="forecast-temps">
                <span class="max-temp">${day.maxTemp}°</span>
                <span class="min-temp">${day.minTemp}°</span>
              </div>
              <div class="forecast-condition">${day.condition.main}</div>
              <div class="forecast-details">
                <small><i class="fas fa-tint"></i> ${day.humidity}%</small>
                <small><i class="fas fa-wind"></i> ${day.windSpeed}m/s</small>
              </div>
            </div>
          `;}).join('')}
        </div>
      </div>
      
      <!-- Weather Tips -->
      <div class="weather-tips">
        <h4><i class="fas fa-lightbulb"></i> Travel Tips</h4>
        ${generateWeatherTips(currentWeather, dailyForecasts)}
      </div>
    `;
  }

  function getDayLabel(forecastDate, checkInDate, index) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    
    const forecast = new Date(forecastDate);
    forecast.setHours(0, 0, 0, 0);
    
    if (forecast.getTime() === today.getTime()) {
      return 'Today';
    } else if (forecast.getTime() === checkIn.getTime()) {
      return 'Check-in Day';
    } else if (index === 0) {
      return 'Check-in Day';
    } else if (index === 1) {
      return 'Day 2';
    } else if (index === 2) {
      return 'Day 3';
    } else {
      return forecast.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  }

  function generateWeatherTips(currentWeather, forecasts) {
    const tips = [];
    const avgTemp = forecasts.reduce((sum, day) => sum + day.avgTemp, 0) / forecasts.length;
    const hasRain = forecasts.some(day => day.condition.main.toLowerCase().includes('rain'));
    
    if (avgTemp < 15) {
      tips.push('<i class="fas fa-snowflake"></i> Pack warm clothes - temperatures will be cool');
    } else if (avgTemp > 30) {
      tips.push('<i class="fas fa-sun"></i> Stay hydrated and wear light, breathable clothing');
    } else {
      tips.push('<i class="fas fa-thermometer-half"></i> Pleasant weather expected - comfortable clothing recommended');
    }
    
    if (hasRain) {
      tips.push('<i class="fas fa-umbrella"></i> Carry an umbrella or raincoat - rain expected');
    }
    
    if (currentWeather.main.humidity > 80) {
      tips.push('<i class="fas fa-tint"></i> High humidity - expect muggy conditions');
    }
    
    if (currentWeather.wind.speed > 5) {
      tips.push('<i class="fas fa-wind"></i> Windy conditions - secure loose items');
    }
    
    return tips.length > 0 ? 
      `<ul class="tips-list">${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>` :
      '<p>No specific weather advisories for your travel dates.</p>';
  }

  // NEW: Setup email verification
  function setupEmailVerification() {
    const guestEmailInput = document.getElementById('guest-email');
    
    // Add email verification section after guest email field
    const emailGroup = guestEmailInput.closest('.form-group');
    const verificationSection = document.createElement('div');
    verificationSection.className = 'email-verification-section';
    verificationSection.style.display = 'none';
    verificationSection.innerHTML = `
      <div class="verification-status" id="verification-status">
        <div class="verification-pending">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Email verification required</span>
          <button type="button" class="send-otp-btn" id="send-otp-btn">Send OTP</button>
        </div>
      </div>
      <div class="otp-input-section" id="otp-input-section" style="display: none;">
        <div class="form-group">
          <label for="otp-input">Enter OTP sent to your email</label>
          <div class="otp-input-container">
            <input type="text" id="otp-input" name="otp" placeholder="Enter 6-digit OTP" maxlength="6">
            <button type="button" class="verify-otp-btn" id="verify-otp-btn">Verify</button>
          </div>
          <div class="otp-timer" id="otp-timer"></div>
          <button type="button" class="resend-otp-btn" id="resend-otp-btn" style="display: none;">Resend OTP</button>
        </div>
      </div>
    `;
    
    emailGroup.insertAdjacentElement('afterend', verificationSection);
    
    // Setup email verification handlers
    setupEmailVerificationHandlers();
  }

  // NEW: Setup email verification handlers
  function setupEmailVerificationHandlers() {
    const verificationSection = document.querySelector('.email-verification-section');
    const guestEmailInput = document.getElementById('guest-email');
    
    // Show verification section when email is entered
    guestEmailInput.addEventListener('input', function() {
      const email = this.value.trim();
      if (email && isValidEmail(email)) {
        verificationSection.style.display = 'block';
        isEmailVerified = false;
        updateVerificationStatus('pending');
      } else {
        verificationSection.style.display = 'none';
        isEmailVerified = false;
      }
    });
    
    // Setup event delegation for dynamically created buttons
    verificationSection.addEventListener('click', async function(e) {
      if (e.target.id === 'send-otp-btn' || e.target.classList.contains('send-otp-btn')) {
        const email = guestEmailInput.value.trim();
        if (!email || !isValidEmail(email)) {
          showNotification('error', 'Invalid Email', 'Please enter a valid email address');
          return;
        }
        await sendOTP(email);
      }
      
      if (e.target.id === 'verify-otp-btn' || e.target.classList.contains('verify-otp-btn')) {
        const email = guestEmailInput.value.trim();
        const otp = document.getElementById('otp-input').value.trim();
        
        if (!otp || otp.length !== 6) {
          showNotification('error', 'Invalid OTP', 'Please enter a 6-digit OTP');
          return;
        }
        
        await verifyOTP(email, otp);
      }
      
      if (e.target.id === 'resend-otp-btn' || e.target.classList.contains('resend-otp-btn')) {
        const email = guestEmailInput.value.trim();
        await sendOTP(email);
      }
    });
    
    // Auto-verify when 6 digits are entered
    document.addEventListener('input', function(e) {
      if (e.target.id === 'otp-input') {
        const otp = e.target.value.trim();
        if (otp.length === 6) {
          document.getElementById('verify-otp-btn').click();
        }
      }
    });
  }

  // NEW: Send OTP
  async function sendOTP(email) {
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const originalText = sendOtpBtn ? sendOtpBtn.textContent : 'Send OTP';
    
    try {
      if (sendOtpBtn) {
        sendOtpBtn.textContent = 'Sending...';
        sendOtpBtn.disabled = true;
      }
      
      const response = await fetch('http://localhost:3000/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, purpose: 'email_verification' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        otpSent = true;
        document.getElementById('otp-input-section').style.display = 'block';
        updateVerificationStatus('otp-sent');
        startOTPTimer();
        showNotification('success', 'OTP Sent', 'Please check your email for the verification code');
      } else {
        throw new Error(data.message);
      }
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      showNotification('error', 'Error', error.message || 'Failed to send OTP');
    } finally {
      if (sendOtpBtn) {
        sendOtpBtn.textContent = originalText;
        sendOtpBtn.disabled = false;
      }
    }
  }

  // NEW: Verify OTP
  async function verifyOTP(email, otp) {
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const originalText = verifyOtpBtn ? verifyOtpBtn.textContent : 'Verify';
    
    try {
      if (verifyOtpBtn) {
        verifyOtpBtn.textContent = 'Verifying...';
        verifyOtpBtn.disabled = true;
      }
      
      const response = await fetch('http://localhost:3000/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, purpose: 'email_verification' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        isEmailVerified = true;
        updateVerificationStatus('verified');
        showNotification('success', 'Email Verified', 'Your email has been successfully verified');
      } else {
        throw new Error(data.message);
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showNotification('error', 'Verification Failed', error.message || 'Failed to verify OTP');
    } finally {
      if (verifyOtpBtn) {
        verifyOtpBtn.textContent = originalText;
        verifyOtpBtn.disabled = false;
      }
    }
  }

  // NEW: Update verification status display
  function updateVerificationStatus(status) {
    const verificationStatus = document.getElementById('verification-status');
    
    switch (status) {
      case 'pending':
        verificationStatus.innerHTML = `
          <div class="verification-pending">
            <i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>
            <span>Email verification required</span>
            <button type="button" class="send-otp-btn" id="send-otp-btn">Send OTP</button>
          </div>
        `;
        break;
        
      case 'otp-sent':
        verificationStatus.innerHTML = `
          <div class="verification-sent">
            <i class="fas fa-paper-plane" style="color: var(--primary-color);"></i>
            <span>OTP sent to your email</span>
          </div>
        `;
        break;
        
      case 'verified':
        verificationStatus.innerHTML = `
          <div class="verification-success">
            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
            <span>Email verified successfully</span>
          </div>
        `;
        document.getElementById('otp-input-section').style.display = 'none';
        break;
    }
  }

  // NEW: Start OTP timer
  function startOTPTimer() {
    const timerElement = document.getElementById('otp-timer');
    const resendBtn = document.getElementById('resend-otp-btn');
    let timeLeft = 60; // 1 minute
    
    const timer = setInterval(() => {
      timerElement.textContent = `Resend OTP in ${timeLeft}s`;
      timeLeft--;
      
      if (timeLeft < 0) {
        clearInterval(timer);
        timerElement.textContent = '';
        if (resendBtn) {
          resendBtn.style.display = 'inline-block';
        }
      }
    }, 1000);
  }

  // NEW: Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function setupFormEventListeners() {
    const bookingForm = document.getElementById('booking-form');
    const categorySelect = document.getElementById('category');
    const numGuestsSelect = document.getElementById('num-guests');
    
    if (categorySelect) {
      categorySelect.addEventListener('change', updateRecommendingAuthorityInfo);
    }
    
    if (numGuestsSelect) {
      numGuestsSelect.addEventListener('change', updateBookingSummary);
    }
    
    if (bookingForm) {
      bookingForm.addEventListener('submit', handleBookingSubmission);
    }
  }

  async function updateBookingSummary() {
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const numGuestsSelect = document.getElementById('num-guests');
    
    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);
    const numGuests = parseInt(numGuestsSelect.value) || 0;
    
    // Update summary display
    if (checkInInput.value) {
      document.getElementById('summary-check-in').textContent = formatDisplayDate(checkIn);
    }
    
    if (checkOutInput.value) {
      document.getElementById('summary-check-out').textContent = formatDisplayDate(checkOut);
      
      if (checkInInput.value) {
        const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        document.getElementById('summary-nights').textContent = nights > 0 ? nights : '-';
      }
    }
    
    if (numGuests > 0) {
      document.getElementById('summary-guests').textContent = numGuests;
      
      // Calculate rooms required
      const roomsRequired = Math.ceil(numGuests / 2);
      document.getElementById('summary-rooms').textContent = roomsRequired;
      
      // Check availability if dates are selected
      if (checkInInput.value && checkOutInput.value && window.selectedRoom) {
        await checkRoomAvailability(window.selectedRoom.type, checkInInput.value, checkOutInput.value, roomsRequired);
      }
    }
  }

  async function checkRoomAvailability(roomType, checkIn, checkOut, roomsRequired) {
    try {
      const availableElement = document.getElementById('summary-available');
      availableElement.textContent = 'Checking...';
      availableElement.style.color = '#6c757d';
      
      const response = await fetch(`http://localhost:3000/api/bookings/availability?roomType=${roomType}&checkIn=${checkIn}&checkOut=${checkOut}`);
      const data = await response.json();
      
      if (response.ok) {
        const { totalRooms, bookedRooms, availableRooms } = data;
        
        if (availableRooms >= roomsRequired) {
          availableElement.textContent = `${availableRooms} of ${totalRooms} rooms available`;
          availableElement.style.color = 'var(--success-color)';
          
          // Show booking details if there are existing bookings
          if (bookedRooms > 0) {
            availableElement.innerHTML += `<br><small style="font-size: 0.8rem; opacity: 0.8;">(${bookedRooms} currently booked)</small>`;
          }
        } else {
          availableElement.textContent = `Only ${availableRooms} of ${totalRooms} rooms available (${roomsRequired} required)`;
          availableElement.style.color = 'var(--danger-color)';
          
          if (bookedRooms > 0) {
            availableElement.innerHTML += `<br><small style="font-size: 0.8rem; opacity: 0.8;">(${bookedRooms} currently booked)</small>`;
          }
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Availability check error:', error);
      document.getElementById('summary-available').textContent = 'Unable to check availability';
      document.getElementById('summary-available').style.color = 'var(--warning-color)';
    }
  }

  function updateRecommendingAuthorityInfo() {
    const categorySelect = document.getElementById('category');
    const authInfo = document.getElementById('recommending-authority-info');
    
    const authorities = {
      'faculty-iiest': {
        title: 'Faculty/Staff/Officers & Family (Current/Ex)',
        authority: 'Any permanent faculty/ Registrar/Deputy Registrar/ Assistant Registrar',
        description: 'For IIEST faculty/staff and their members, the recommending authority should be any permanent faculty/ Registrar/Deputy Registrar/ Assistant Registrar'
      },
      'official-guests': {
        title: 'Institute-Invited Guests',
        authority: 'Dean/ Registrar / Head of Department, Schools and Centers',
        description: 'For Institute-Invited Guests, the Dean Registrar or HoD should recommend.'
      },
      'project_event_visitors': {
        title: 'Project/Consultancy/Program Visitors',
        authority: 'Principal Investigators (in case of project or consultancy) Coordinator in case of Short-term courses, Seminars/Conference etc.',
        description: 'For Project/Consultancy/Program Visitors, the Principal Investigator should recommend.'
      },
      'student-iiest': {
        title: 'Student and their Parents (IIEST)',
        authority: 'Dean (Academic)/Dean (Student welfare) Registrar/Heads of the Departments/Warden of concerned Hostel',
        description: 'For IIEST students and their Parents, the Dean, Registrar, Head of Department, or Hostel Warden should recommend.'
      },
      'alumni': {
        title: 'Alumni & their family',
        authority: 'Dean (International Relations & Alumni Affairs)/Head of the Department of concerned Department/Registrar',
        description: 'For alumni & family, the Dean of International Relations & Alumni Affairs, Head of Department, or Registrar should recommend.'
      },
      'others': {
        title: 'Others',
        authority: 'Through Registrar/Deans',
        description: 'For other categories, the Registrar or appropriate Dean should recommend based on the purpose of visit.'
      }
    };
    
    const category = categorySelect.value;
    
    if (!category) {
      authInfo.innerHTML = '<p class="info-note">Please select a category to see the recommending authority details.</p>';
      return;
    }
    
    const info = authorities[category];
    authInfo.innerHTML = `
      <div class="authority-info">
        <h4>${info.title}</h4>
        <p><strong>Recommending Authority:</strong> ${info.authority}</p>
        <p class="description">${info.description}</p>
      </div>
    `;
  }

  // Payment Modal Setup
  function setupPaymentModal() {
    // Create payment modal HTML
    const paymentModalHTML = `
      <div id="payment-modal" class="payment-modal">
        <div class="payment-content">
          <div class="payment-header">
            <button class="payment-close">&times;</button>
            <h2>Caution Money Payment</h2>
            <div class="caution-amount">₹199</div>
          </div>
          <div class="payment-body">
            <div class="caution-info">
              <h3><i class="fas fa-info-circle"></i> About Caution Money</h3>
              <p>This is a refundable security deposit that will be adjusted against your final bill. It helps us confirm your booking and covers any incidental charges.</p>
            </div>
            
            <div class="payment-booking-summary">
              <h4>Booking Summary</h4>
              <div class="payment-summary-item">
                <span>Room Type:</span>
                <span id="payment-room-type">-</span>
              </div>
              <div class="payment-summary-item">
                <span>Check-in:</span>
                <span id="payment-check-in">-</span>
              </div>
              <div class="payment-summary-item">
                <span>Check-out:</span>
                <span id="payment-check-out">-</span>
              </div>
              <div class="payment-summary-item">
                <span>Guests:</span>
                <span id="payment-guests">-</span>
              </div>
              <div class="payment-summary-item">
                <span>Rooms Required:</span>
                <span id="payment-rooms">-</span>
              </div>
              <div class="payment-summary-item">
                <span>Caution Money:</span>
                <span>₹199</span>
              </div>
            </div>
            
            <div class="payment-actions">
              <button class="cancel-payment">Cancel</button>
              <button class="proceed-payment">
                <i class="fas fa-lock"></i>
                Pay ₹199 Securely
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add payment modal to body
    document.body.insertAdjacentHTML('beforeend', paymentModalHTML);
    
    // Setup payment modal event listeners
    const paymentModal = document.getElementById('payment-modal');
    const closeBtn = paymentModal.querySelector('.payment-close');
    const cancelBtn = paymentModal.querySelector('.cancel-payment');
    const proceedBtn = paymentModal.querySelector('.proceed-payment');
    
    closeBtn.addEventListener('click', closePaymentModal);
    cancelBtn.addEventListener('click', closePaymentModal);
    proceedBtn.addEventListener('click', initiateRazorpayPayment);
    
    // Close modal when clicking outside
    paymentModal.addEventListener('click', function(e) {
      if (e.target === paymentModal) {
        closePaymentModal();
      }
    });
  }

  function openPaymentModal(bookingData) {
    const paymentModal = document.getElementById('payment-modal');
    
    // Update payment summary
    document.getElementById('payment-room-type').textContent = window.selectedRoom.title;
    document.getElementById('payment-check-in').textContent = formatDisplayDate(new Date(bookingData.checkIn));
    document.getElementById('payment-check-out').textContent = formatDisplayDate(new Date(bookingData.checkOut));
    document.getElementById('payment-guests').textContent = bookingData.numGuests;
    document.getElementById('payment-rooms').textContent = Math.ceil(bookingData.numGuests / 2);
    
    // Store booking data for payment
    window.pendingBookingData = bookingData;
    
    // Show modal
    paymentModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset form button
    const submitBtn = document.querySelector('.confirm-btn');
    submitBtn.textContent = 'Proceed to Payment';
    submitBtn.disabled = false;
  }

  async function initiateRazorpayPayment() {
    try {
      const proceedBtn = document.querySelector('.proceed-payment');
      proceedBtn.innerHTML = '<div class="spinner"></div> Processing...';
      proceedBtn.disabled = true;
      
      // Create order on server
      const orderResponse = await fetch('http://localhost:3000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 199,
          currency: 'INR',
          receipt: `caution_${Date.now()}`
        })
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }
      
      const orderData = await orderResponse.json();
      
      // Initialize Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'IIEST Guest House',
        description: 'Caution Money - Refundable Security Deposit',
        order_id: orderData.id,
        handler: function(response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: document.getElementById('guest-name').value,
          email: document.getElementById('guest-email').value,
          contact: document.getElementById('guest-phone').value
        },
        theme: {
          color: '#1A3A5A'
        },
        modal: {
          ondismiss: function() {
            handlePaymentCancel();
          }
        }
      };
      
      const rzp = new Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      showNotification('error', 'Payment Error', 'Failed to initiate payment. Please try again.');
      
      // Reset button
      const proceedBtn = document.querySelector('.proceed-payment');
      proceedBtn.innerHTML = '<i class="fas fa-lock"></i> Pay ₹199 Securely';
      proceedBtn.disabled = false;
    }
  }

  async function handlePaymentSuccess(paymentResponse) {
    try {
      // Verify payment on server
      const verifyResponse = await fetch('http://localhost:3000/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed');
      }
      
      const verifyData = await verifyResponse.json();
      
      if (verifyData.success) {
        // Payment verified, now submit booking
        await submitBookingAfterPayment(paymentResponse);
      } else {
        throw new Error('Payment verification failed');
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      showNotification('error', 'Payment Verification Failed', 'Payment could not be verified. Please contact support.');
    }
  }

  function handlePaymentCancel() {
    // Reset payment button
    const proceedBtn = document.querySelector('.proceed-payment');
    proceedBtn.innerHTML = '<i class="fas fa-lock"></i> Pay ₹199 Securely';
    proceedBtn.disabled = false;
    
    showNotification('info', 'Payment Cancelled', 'Payment was cancelled. You can try again when ready.');
  }

  async function submitBookingAfterPayment(paymentResponse) {
    try {
      // Add payment details to booking data
      const bookingData = {
        ...window.pendingBookingData,
        paymentDetails: {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          amount: 199,
          currency: 'INR',
          status: 'completed'
        }
      };
      
      // Submit booking with payment details
      const response = await fetch('http://localhost:3000/api/bookings/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Close payment modal
        closePaymentModal();
        
        // Show success modal
        showSuccessModal(result.booking.bookingId, paymentResponse.razorpay_payment_id);
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('Booking submission error:', error);
      showNotification('error', 'Booking Failed', 'Payment successful but booking submission failed. Please contact support with your payment ID.');
    }
  }

  async function handleBookingSubmission(e) {
    e.preventDefault();
    
    // NEW: Check email verification first
    if (!isEmailVerified) {
      showNotification('error', 'Email Verification Required', 'Please verify your email address before proceeding with the booking.');
      return;
    }
    
    if (!window.selectedRoom) {
      showNotification('error', 'Error', 'Room data not loaded. Please refresh the page.');
      return;
    }
    
    // Validate required fields (updated to make some fields optional)
    const requiredFields = [
      'check-in', 'check-out', 'guest-name', 'guest-email', 'guest-phone',
      'guest-address', 'category', 'purpose-of-visit', 'num-guests', 'auth-name',
      'auth-designation', 'auth-department', 'auth-email', 'auth-phone'
    ];
    
    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        field.focus();
        showNotification('error', 'Missing Information', `Please fill in the ${field.labels[0].textContent} field.`);
        return;
      }
    }
    
    // Validate dates
    const checkIn = new Date(document.getElementById('check-in').value);
    const checkOut = new Date(document.getElementById('check-out').value);
    
    if (checkOut <= checkIn) {
      showNotification('error', 'Invalid Dates', 'Check-out date must be after check-in date.');
      return;
    }
    
    // Validate number of guests
    const numGuests = parseInt(document.getElementById('num-guests').value);
    if (numGuests < 1) {
      showNotification('error', 'Invalid Guests', 'Please select at least 1 guest.');
      return;
    }
    
    // Check room availability
    const roomsRequired = Math.ceil(numGuests / 2);
    const availabilityResponse = await fetch(`http://localhost:3000/api/bookings/availability?roomType=${window.selectedRoom.type}&checkIn=${document.getElementById('check-in').value}&checkOut=${document.getElementById('check-out').value}`);
    
    if (availabilityResponse.ok) {
      const availabilityData = await availabilityResponse.json();
      if (availabilityData.availableRooms < roomsRequired) {
        showNotification('error', 'Insufficient Rooms', `Only ${availabilityData.availableRooms} rooms available. You need ${roomsRequired} rooms for ${numGuests} guests.`);
        return;
      }
    }
    
    // Prepare booking data (designation, department, institute are now optional)
    const bookingData = {
      roomType: window.selectedRoom.type,
      checkIn: document.getElementById('check-in').value,
      checkOut: document.getElementById('check-out').value,
      numGuests: numGuests,
      guestDetails: {
        name: document.getElementById('guest-name').value,
        designation: document.getElementById('guest-designation').value || undefined,
        department: document.getElementById('guest-department').value || undefined,
        institute: document.getElementById('guest-institute').value || undefined,
        email: document.getElementById('guest-email').value,
        phone: document.getElementById('guest-phone').value,
        address: document.getElementById('guest-address').value
      },
      category: document.getElementById('category').value,
      purposeOfVisit: document.getElementById('purpose-of-visit').value,
      recommendingAuthority: {
        name: document.getElementById('auth-name').value,
        designation: document.getElementById('auth-designation').value,
        department: document.getElementById('auth-department').value,
        email: document.getElementById('auth-email').value,
        phone: document.getElementById('auth-phone').value
      },
      specialRequests: document.getElementById('special-requests').value,
      emergencyContact: {
        name: document.getElementById('emergency-name').value,
        phone: document.getElementById('emergency-phone').value,
        relation: document.getElementById('emergency-relation').value
      }
    };
    
    // Show loading state
    const submitBtn = document.querySelector('.confirm-btn');
    submitBtn.textContent = 'Proceeding to Payment...';
    submitBtn.disabled = true;
    
    // Open payment modal instead of direct submission
    openPaymentModal(bookingData);
  }

  function showSuccessModal(bookingId, paymentId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your booking request has been submitted successfully and payment has been received.</p>
        <p>Booking ID: <span style="font-weight: bold; color: var(--primary-color);">${bookingId}</span></p>
        <p>Payment ID: <span style="font-weight: bold; color: var(--success-color);">${paymentId}</span></p>
        <p>Caution money of ₹199 has been collected and will be adjusted in your final bill.</p>
        <p><strong>Next Steps:</strong></p>
        <ol style="text-align: left; margin: 1rem 0;">
          <li>Verification email sent to your recommending authority</li>
          <li>Once approved, guest house will confirm your booking</li>
          <li>You will receive email updates on your booking status</li>
        </ol>
        <div class="modal-actions">
          <button class="primary-btn" onclick="window.location.href='index.html'">Back to Home</button>
          <button class="secondary-btn" onclick="window.location.href='my-bookings.html'">Check Booking Status</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove modal after 20 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
        window.location.href = 'index.html';
      }
    }, 20000);
  }

  function showNotification(type, title, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : type === 'info' ? '#17a2b8' : '#dc3545'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i>
        <div>
          <h4 style="margin: 0; font-size: 1rem;">${title}</h4>
          <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // Utility functions
  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
});