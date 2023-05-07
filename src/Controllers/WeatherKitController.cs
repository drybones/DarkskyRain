using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WeatherKitExample.Services;
using WeatherKitExample.Models;
using WeatherKitAPI.Models;

namespace WeatherKitAPI.Controllers;

[ApiController]
[Route("api/forecast")]
public class WeatherKitController : ControllerBase
{
    private readonly IWeatherKitService _weatherKitService;
    private readonly ILogger<WeatherKitController> _logger;
    private readonly ForecastAppSettings _forecastAppSettings;

    public WeatherKitController(IWeatherKitService weatherKitService, ILogger<WeatherKitController> logger, IOptions<ForecastAppSettings> forecastAppSettings)
    {
        _weatherKitService = weatherKitService;
        _logger = logger;
        if (forecastAppSettings == null)
            throw new ArgumentNullException(nameof(forecastAppSettings));

        _forecastAppSettings = forecastAppSettings.Value;
    }

    [HttpGet(Name = "forecast")]
    public async Task<Weather> GetWeatherForecast(double? latitude, double? longitude)
    {
        var weather = await _weatherKitService.GetWeather(
            latitude ?? _forecastAppSettings.DefaultLatitude ?? 51.5, 
            longitude ?? _forecastAppSettings.DefaultLongitude ?? -0.3,
            new List<WeatherKitDataSetType>() { 
                WeatherKitDataSetType.ForecastHourly, 
                WeatherKitDataSetType.ForecastNextHour, 
                WeatherKitDataSetType.CurrentWeather
                },
            TimeZoneInfo.Local.Id);
        return weather;
    }
}