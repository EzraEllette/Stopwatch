class StopWatch {
  constructor() {
    this.init();
  }

  registerTemplates() {
    this.templates ||= {};
    this.templates['time'] = Handlebars.compile($('#time').html());
  }

  init() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.centiseconds = 0;

    this.registerTemplates();
    this.refreshStopWatch();
    this.bindEventHandlers();
  }

  refreshStopWatch() {
    $('#stopwatch').html(this.templates.time(this.timeToObject()));
  }

  bindEventHandlers() {
    let $stopwatchControl = $('#stopwatch-control');
    let $reset = $('#reset');

    $stopwatchControl.click(this.StopWatchHandler.bind(this));
    $reset.click(this.resetStopWatch.bind(this));
  }

  StopWatchHandler(event) {
    let $button = $(event.target);

    if ($button.hasClass('started')) {
      this.stopStopWatch($button);
    } else {
      this.startStopWatch($button);
    }
  }

  resetStopWatch() {
    this.stopStopWatch($('#stopwatch-control'));

    this.centiseconds = 0;
    this.startTime = null;

    this.setTime();
    this.refreshStopWatch();
  }

  stopStopWatch($button) {
    clearInterval(this.stopWatchIncrementer);
    $button.removeClass('started');
    $button.text('Start');
  }

  startStopWatch($button) {
    this.startTime = Date.now();
    $button.addClass('started');
    $button.text('Stop');

    this.stopWatchIncrementer = setInterval(
      (function() {
        this.centiseconds = Math.floor((Date.now() - this.startTime) / 10);

        this.setTime();
        this.refreshStopWatch();

      }).bind(this), 5);
  }

  setTime() {
    this.seconds = Math.floor(this.centiseconds / 100);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);
  }

  timeToObject() {
    return {
      hours: this.hoursToString(),
      minutes: this.minutesToString(),
      seconds: this.secondsToString(),
      centiseconds: this.centisecondsToString(),
    }
  }

  prefixNumber(number, length = 2, prefix = '0') {
    return prefix.repeat(length - String(number).length) + number;
  }

  modulateNumber(number, maxValue) {
    return String(number % maxValue);
  }

  hoursToString() {
    let number = this.modulateNumber(this.hours, 100);
    return this.prefixNumber(number);
  }

  centisecondsToString() {
    let number = this.modulateNumber(this.centiseconds, 100);
    return this.prefixNumber(number);
  }

  minutesToString() {
    let number = this.modulateNumber(this.minutes, 60);
    return this.prefixNumber(number);
  }

  secondsToString() {
    let number = this.modulateNumber(this.seconds, 60);
    return this.prefixNumber(number);
  }
}

$(() => new StopWatch());