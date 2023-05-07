function ForecastSummaryModel(coords) {
    var self = this;
    self.minutelySummary = ko.observable("[getting forecast]");
    self.hourlySummary = ko.observable("[getting forecast]");
    self.geoLocationError = ko.observable("");

    var params = {};
    if(coords) {
        params = {latitude: coords.latitude, longitude: coords.longitude};
    } else {
        self.geoLocationError("No location available, using default location.")
    } 

    $.getJSON("/api/forecast", params, function (forecastData) {

        if(forecastData.forecastNextHour) {
            self.minutelySummary("");    

            var minutelyChartData = $.map(forecastData.forecastNextHour.minutes, function (item) {
                return { x: Date.parse(item.startTime), y: item.precipitationChance * 100, z: item.precipitationIntensity };
            });
            var minuelyChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'minutelyChart'
                },
                series: [{
                    data: minutelyChartData
                }]
            });
        } else {
            self.minutelySummary("No data available.");
        }

        if(forecastData.forecastHourly) {
            self.hourlySummary("");
    
            var hourlyChartData = $.map(forecastData.forecastHourly.hours, function (item) {
                return { x: Date.parse(item.forecastStart), y: item.precipitationChance * 100, z: item.precipitationIntensity };
            });
            var hourlyChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'hourlyChart'
                },
                series: [{
                    data: hourlyChartData
                }]
            });    
        } else {
            self.hourlySummary("No data available.");
        }
    });
}

function geoSuccess(pos)
{
    ApplyBindings(pos.coords);
}
function geoError(error)
{
    console.log('GeoLocation error code: '+ error.code);
    ApplyBindings();
}
function ApplyBindings(coords)
{
    ko.applyBindings(new ForecastSummaryModel(coords));
}

$(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        },

        chart: {
            type: 'bubble'
        },

        legend: {
            enabled: false
        },

        title: {
            text: ''
        },

        xAxis: {
            gridLineWidth: 1,
            type: 'datetime',
            labels: {
                format: '{value:%H:%M}'
            }
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            min: 0,
            max: 100,
            title: {
                text: ''
            },
            labels: {
                format: '{value}%'
            }
        },

        navigation: {
            buttonOptions: {
                enabled: false
            }
        },

        tooltip: {
            enabled: false
        },

        plotOptions: {
            bubble: {
                allowPointSelect: false,
                enableMouseTracking: false,
                maxSize: "40%",
                minSize: 0,
                zMin: 0,
                zMax: 5,
                marker: {
                    lineWidth: 0
                }
            }
        }
    });

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {timeout: 5 * 1000});
});