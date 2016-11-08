using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DarkskyRain.Models
{
    public class DarkSkyOptions
    {
        public string SecretKey { get; set; }
        public double DefaultLatitude { get; set; }
        public double DefaultLongitude { get; set; }
    }
}
