function RainDataPoint(item) {
    var self = this;
    self.timestamp = ko.observable(item.time);
    self.probability = ko.observable(item.precipProbability);
    self.intensity = ko.observable(item.precipIntensity);
    self.error = ko.observable(item.precipIntensityError);

    self.datetime = ko.computed(function () {
        return new Date(self.timestamp() * 1000);
    }, self);

    self.time = ko.computed(function () {
        var hours = "0" + self.datetime().getHours();
        var minutes = "0" + self.datetime().getMinutes();
        return hours.substr(-2) + ':' + minutes.substr(-2);
    }, this);
}

function ForecastSummaryModel(coords) {
    var self = this;
    self.minutelySummary = ko.observable("[getting forecast]");
    self.hourlySummary = ko.observable("[getting forecast]");
    self.geoLocationError = ko.observable("");

    self.minutelyData = ko.observableArray();
    self.hourlyData = ko.observableArray();

    var params = {};
    if(coords) {
        params = {latitude: coords.latitude, longitude: coords.longitude};
    } else {
        self.geoLocationError("No location available, using default location.")
    } 

    $.getJSON("/api/forecast", params, function (forecastData) {

        if(forecastData.minutely) {
            self.minutelySummary(forecastData.minutely.summary);
            var mappedMinutelyData = $.map(forecastData.minutely.data, function (item) {
                return new RainDataPoint(item);
            });
            self.minutelyData(mappedMinutelyData);
    
            var minutelyChartData = $.map(forecastData.minutely.data, function (item) {
                return { x: item.time * 1000, y: item.precipProbability * 100, z: item.precipIntensity };
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

        if(forecastData.hourly) {
            self.hourlySummary(forecastData.hourly.summary);

            var mappedHourlyData = $.map(forecastData.hourly.data, function (item) {
                return new RainDataPoint(item);
            });
            self.hourlyData(mappedHourlyData);
    
            var hourlyChartData = $.map(forecastData.hourly.data, function (item) {
                return { x: item.time * 1000, y: item.precipProbability * 100, z: item.precipIntensity };
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