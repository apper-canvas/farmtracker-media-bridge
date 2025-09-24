import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather, isToday = false }) => {
const getWeatherIcon = (condition) => {
    const conditionLower = (condition ?? 'clear').toLowerCase();
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) return "Sun";
    if (conditionLower.includes("cloud")) return "Cloud";
    if (conditionLower.includes("rain")) return "CloudRain";
    if (conditionLower.includes("storm")) return "CloudLightning";
    if (conditionLower.includes("snow")) return "CloudSnow";
    if (conditionLower.includes("fog") || conditionLower.includes("mist")) return "CloudFog";
    return "Sun";
  };

const getWeatherGradient = (condition) => {
    const conditionLower = (condition ?? 'clear').toLowerCase();
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) return "from-yellow-400 to-orange-500";
    if (conditionLower.includes("cloud")) return "from-gray-400 to-gray-600";
    if (conditionLower.includes("rain")) return "from-blue-400 to-blue-600";
    if (conditionLower.includes("storm")) return "from-purple-500 to-indigo-600";
    if (conditionLower.includes("snow")) return "from-blue-200 to-blue-400";
    return "from-yellow-400 to-orange-500";
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-105 ${isToday ? "ring-2 ring-primary-500 ring-opacity-50" : ""}`}>
      <CardContent className="p-4 text-center">
        <div className="space-y-3">
          <div className="flex flex-col items-center space-y-2">
<div className={`p-3 rounded-full bg-gradient-to-br ${getWeatherGradient(weather.Condition_c)} shadow-lg`}>
              <ApperIcon name={getWeatherIcon(weather.Condition_c)} size={24} className="text-white" />
            </div>
            {isToday ? (
              <h3 className="font-bold text-lg text-gray-900">Today</h3>
            ) : (
<h3 className="font-semibold text-gray-800">{weather.Date_c}</h3>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
{weather.Temperature_c}°
              </span>
            </div>
<p className="text-sm text-gray-600 font-medium">{weather.Condition_c}</p>
            
{weather.Humidity_c && (
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="Droplets" size={12} />
                <span>{weather.Humidity_c}%</span>
              </div>
            )}
            
{weather.WindSpeed_c && (
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="Wind" size={12} />
                <span>{weather.WindSpeed_c} mph</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;