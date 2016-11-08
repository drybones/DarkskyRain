using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.OptionsModel;

using DarkskyRain.Models;


// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DarkskyRain.Controllers
{
    [Route("api/[controller]")]
    public class ForecastController : Controller
    {
        const string forecastUrl = @"https://api.darksky.net/forecast/{0}/{1},{2}?exclude=flags,alerts,daily&units=uk2";
        private static string secretKey { get; set; }
        private static System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
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
        // GET: api/values
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
