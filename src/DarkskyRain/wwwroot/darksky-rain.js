function ForecastSummaryModel() {
    var self = this;
    self.currently = ko.observable("[no forecast]"),
    self.minutely = ko.observable("[no forecast]"),
    self.hourly = ko.observable("[no forecast]")

    $.getJSON("/api/forecast/", function (forecastData) {
        self.currently(forecastData.currently.summary);
        self.minutely(forecastData.minutely.summary);
        self.hourly(forecastData.hourly.summary);
    });
}

ko.applyBindings(new ForecastSummaryModel());

