import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import WeatherCard from "@/components/molecules/WeatherCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { weatherService } from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError("");
      const [current, forecast] = await Promise.all([
        weatherService.getCurrent(),
        weatherService.getForecast(4)
      ]);
      setCurrentWeather(current);
      setWeather(forecast);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getFarmingTip = (condition, temp) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes("rain")) {
      return {
        icon: "Droplets",
        text: "Great day for natural irrigation! Consider postponing manual watering tasks and focus on indoor activities.",
        color: "text-blue-600"
      };
    }
    
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
      if (temp > 80) {
        return {
          icon: "Thermometer",
          text: "Hot and sunny weather - perfect for harvesting but ensure adequate irrigation for sensitive crops.",
          color: "text-orange-600"
        };
      }
      return {
        icon: "Sun",
        text: "Excellent weather for field work! Ideal conditions for planting, weeding, and equipment maintenance.",
        color: "text-yellow-600"
      };
    }
    
    if (conditionLower.includes("cloud")) {
      return {
        icon: "Cloud",
        text: "Overcast conditions provide good working weather without heat stress. Great for transplanting.",
        color: "text-gray-600"
      };
    }
    
    return {
      icon: "Lightbulb",
      text: "Check your specific crops' weather requirements and adjust your daily tasks accordingly.",
      color: "text-primary-600"
    };
  };

  if (loading) return <Loading rows={2} />;
  if (error) return <Error message={error} onRetry={loadWeatherData} />;

  const tip = currentWeather ? getFarmingTip(currentWeather.condition, currentWeather.temperature) : null;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-gray-600">Plan your farming activities based on weather conditions</p>
        </div>
        <div className="hidden sm:block">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
            <ApperIcon name="Cloud" size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Current Weather Highlight */}
      {currentWeather && (
        <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                  <ApperIcon 
                    name={currentWeather.condition.toLowerCase().includes("sun") ? "Sun" : 
                          currentWeather.condition.toLowerCase().includes("rain") ? "CloudRain" : "Cloud"} 
                    size={48} 
                    className="text-primary-600" 
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {currentWeather.temperature}°F
                  </h2>
                  <p className="text-xl text-gray-700 mb-2">{currentWeather.condition}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Droplets" size={14} />
                      <span>{currentWeather.humidity}% humidity</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Wind" size={14} />
                      <span>{currentWeather.windSpeed} mph wind</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Today</div>
                <div className="text-lg font-semibold text-gray-900">Current Conditions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Farming Tip */}
      {tip && (
        <Card className="border-l-4 border-l-primary-500">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-lg bg-primary-100">
                  <ApperIcon name={tip.icon} size={20} className={tip.color} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Farming Tip</h3>
                <p className="text-gray-700">{tip.text}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4-Day Forecast */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">4-Day Forecast</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {weather.map((day, index) => (
            <WeatherCard
              key={day.Id}
              weather={day}
              isToday={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Weather Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="BarChart3" size={20} className="text-primary-600" />
            <span>Weekly Weather Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Temperature Trend</h4>
              <div className="space-y-2">
                {weather.map((day, index) => (
                  <div key={day.Id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.date}</span>
                    <span className="font-medium">{day.temperature}°F</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Precipitation Forecast</h4>
              <div className="space-y-2">
                {weather.map((day) => (
                  <div key={day.Id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.date}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        day.precipitation > 50 ? "bg-blue-500" :
                        day.precipitation > 20 ? "bg-blue-300" : "bg-gray-300"
                      }`}></div>
                      <span className="text-sm font-medium">
                        {day.precipitation || 0}% chance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Info" size={16} className="text-blue-600" />
              <span className="font-medium text-gray-900">This Week's Summary</span>
            </div>
            <p className="text-sm text-gray-700">
              {weather.filter(day => day.condition.toLowerCase().includes("rain")).length > 0
                ? "Rain expected this week - plan indoor activities and check drainage systems."
                : "Mostly dry conditions expected - maintain regular irrigation schedule."
              } Average temperature: {Math.round(weather.reduce((sum, day) => sum + day.temperature, 0) / weather.length)}°F.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;