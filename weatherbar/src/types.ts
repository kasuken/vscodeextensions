enum WeatherType {
    "Temperature",
  }
  
  interface WeatherInfo {
    weather: [
      {
        description: string;
        icon: number;
      }
    ];
    main: {
      temp: number;
      humidity: number;
    };
    name: string;
    sys: {
      country: string;
    };
  }