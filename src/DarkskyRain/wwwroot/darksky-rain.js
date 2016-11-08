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
        })
        self.minutelyData(mappedMinutelyData);

        var mappedHourlyData = $.map(forecastData.hourly.data, function (item) {
            return new RainDataPoint(item);
        })
        self.hourlyData(mappedHourlyData);
    });
}

ko.applyBindings(new ForecastSummaryModel());

