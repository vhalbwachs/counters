(function(window) {
    'use strict';
    var app = angular.module('counters', []);

    app.config(function ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
    });

    app.directive('decimalInput', function() {
        return {
            scope: {},
            controller: function($interval) {
                this.decimalNumber = 0;
                this.intervalPromise = null;
                this.isCounting = false;
                this.toggleCounting = function() {
                  if (this.isCounting) {
                    $interval.cancel(this.intervalPromise);
                    this.intervalPromise = null;
                  } else {
                    this.intervalPromise = $interval(angular.bind(this, function() {
                        this.decimalNumber++;
                    }), 1000);
                  }
                  this.isCounting = !this.isCounting;
                };
            },
            controllerAs:'ctrl',
            templateUrl: 'decimal-counters'
        };
    });

    app.directive('counter', function() {
        return {
            scope: {},
            bindToController: {
                radix: "@",
                decimalNumber: "="
            },
            controller: function($scope) {
                this.digits = [];

                this.setDigits = function(number) {
                    this.digits = this.makeBinaryBits(number);
                };

                this.makeBinaryBits = function(number) {
                    return number.toString(this.radix).split('');
                };

                this.powerOf = function(index) {
                    return window.Math.pow(this.radix, this.reverseIndex(index));
                };

                this.reverseIndex = function(index) {
                    return (this.digits.length - 1) - index;
                };
                this.parseNumber = function(number) {
                    return window.parseInt(number, this.radix);
                };
                this.digitTimesPower = function(digit, index) {
                    return this.parseNumber(digit) * this.powerOf(index)
                };
            },
            controllerAs: 'ctrl',
            link: function(scope, element, attributes) {
                scope.$watch(attributes.decimalNumber, function(num) {
                    scope.ctrl.setDigits(num);
                });
            },
            templateUrl: 'counter-template'
        };
    });
})(window);
