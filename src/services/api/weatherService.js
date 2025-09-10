import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weather = [...weatherData];
  }

  async getCurrent() {
    await this.delay(200);
    return { ...this.weather[0] };
  }

  async getForecast(days = 4) {
    await this.delay(300);
    return this.weather.slice(0, days).map(w => ({ ...w }));
  }

  async getToday() {
    await this.delay(150);
    return { ...this.weather[0] };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const weatherService = new WeatherService();