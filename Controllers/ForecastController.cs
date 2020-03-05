using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using DarkskyRain.Models;

namespace DarkskyRain.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForecastController : ControllerBase
    {
        const string forecastUrl = @"https://api.darksky.net/forecast/{0}/{1},{2}?exclude=flags,alerts,daily&units=uk2";
        private static System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
        private static string secretKey;
        private static double defaultLatitude;
        private static double defaultLongitude;

        public ForecastController(IOptions<DarkSkyOptions> optionsAccessor)
        {
            // Pull from an environment variable "DarkSkyOptions:SecretKey" or from a settings file, eg
            // "DarkSkyOptions": {
            //    "SecretKey": "YOUR_SECRET_KEY"
            // }
            secretKey = optionsAccessor.Value.SecretKey;
            defaultLatitude = optionsAccessor.Value.DefaultLatitude;
            defaultLongitude = optionsAccessor.Value.DefaultLongitude;
        }

        [HttpGet]
        public async Task<string> Get(double? latitude, double? longitude)
        {
            return await GetForecastResponse(latitude.HasValue ? latitude.Value : defaultLatitude, longitude.HasValue ? longitude.Value : defaultLongitude);
        }

        private static async Task<string> GetForecastResponse(double latitude, double longitude)
        {
            string content = null;
            var resp = await client.GetAsync(string.Format(forecastUrl, secretKey, latitude, longitude));
            if (resp.IsSuccessStatusCode)
            {
                content = await resp.Content.ReadAsStringAsync().ConfigureAwait(false);
            }
            return content;
        }

    }
}
