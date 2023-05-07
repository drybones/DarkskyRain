using WeatherKitExample.Services;
using WeatherKitExample.Models;
using WeatherKitAPI.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.Configure<WeatherKitSettings>(builder.Configuration.GetSection("WeatherKitSettings"));
builder.Services.Configure<ForecastAppSettings>(builder.Configuration.GetSection("ForecastAppSettings"));
builder.Services.AddTransient<IWeatherKitService, WeatherKitService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

app.Run();
