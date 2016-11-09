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
        var hours = self.datetime().getHours();
        var minutes = "0" + self.datetime().getMinutes();
        return hours + ':' + minutes.substr(-2);
    }, this);
}

function ForecastSummaryModel() {
    var self = this;
    self.currentlySummary = ko.observable("[getting forecast]");
    self.minutelySummary = ko.observable("[getting forecast]");
    self.hourlySummary = ko.observable("[getting forecast]");

    self.currentlyData = ko.observable();
    self.minutelyData = ko.observableArray();
    self.hourlyData = ko.observableArray();

    $.getJSON("/api/forecast/", function (forecastData) {
        self.currentlySummary(forecastData.currently.summary);
        self.minutelySummary(forecastData.minutely.summary);
        self.hourlySummary(forecastData.hourly.summary);

        var currentlyDataItem = {
            time: forecastData.currently.time,
            precipProbability: forecastData.currently.precipProbability,
            precipIntensity: forecastData.currently.precipIntensity,
            precipIntensityError: forecastData.currently.precipIntensityError
        };
        self.currentlyData(new RainDataPoint(currentlyDataItem));

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
    });
}

$(function () {
    Highcharts.setOptions({
        chart: {
            type: 'bubble',
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
            },
            maxPadding: 0.2
        },

        navigation: {
            buttonOptions: {
                enabled: false
            },
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

    ko.applyBindings(new ForecastSummaryModel());
});