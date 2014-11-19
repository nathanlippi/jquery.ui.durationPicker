(function($) {
  $.widget( "custom.durationPicker", {
    options: {
      seconds: 0
    },
    seconds: function(newSeconds) {
      if(arguments.length) {
        this._setSeconds(newSeconds);
        this._refresh();
      }

      return this.options.seconds;
    },
    setUnitQty: function(unit, quantity) {
      var index = this._subUnitsIndexByUnit[unit];
      var qtyInNextBiggestUnit = this._subUnits[index].qtyInNextBiggestUnit;
      if(quantity < 0 || quantity >= qtyInNextBiggestUnit) {
        throw new Error("Attempting to set out-of-range value.");
      }
      this._subUnits[index].quantity = quantity;
      this._reCalculateSeconds();

      $("."+unit, this.element).val(quantity);
    },
    getUnitQty: function(unit) {
      var index = this._subUnitsIndexByUnit[unit];
      var qty = this._subUnits[index].quantity;
      return qty;
    },
    _create: function() {
      this.element.addClass("durationPicker");
      this._initSubUnits();
      this._initUI();
      this._setSeconds(this.options.seconds);
    },
    _initSubUnits: function() {
      var self = this;

      this._subUnits = [
          {unit: "seconds", qtyInNextBiggestUnit: 60},
          {unit: "minutes", qtyInNextBiggestUnit: 60},
          {unit: "hours", qtyInNextBiggestUnit: 24},
          {unit: "days", qtyInNextBiggestUnit: 30},
          {unit: "months", qtyInNextBiggestUnit: 12},
          {unit: "years"}
        ];

      // Set number of seconds that correspond with each unit.
      //
      // This could have been hardcoded into this._subUnits, but I wanted to
      // avoid duplication.
      //
      var secondsPerUnit = 1;
      $.each(this._subUnits, function(ii, subUnit) {
        self._subUnitsIndexByUnit[subUnit.unit] = ii;
        self._subUnits[ii].secondsPerUnit = secondsPerUnit;
        self._subUnits[ii].quantity = 0;
        if(subUnit.qtyInNextBiggestUnit) {
          secondsPerUnit *= subUnit.qtyInNextBiggestUnit;
        }
      });
    },
    _initUI: function() {
      var self = this;
      var cssTableClass = "durationPickerTable";

      $("<table class='" + cssTableClass + "'></table>")
        .appendTo(self.element);

      $.each(this._getSubUnits().reverse(),
        function(ii, subUnit) {
          var tableRow = "<tr><td>" +
            "<input class='" + subUnit.unit + " spinner' value=0 size=3 />" +
            "</td><td>&nbsp;"+subUnit.unit+"</td></tr>";

          var sel = "table."+cssTableClass;
          $(tableRow).appendTo($(sel, self.element));

          $(sel+" tr>td>input:last", self.element)
            .spinner({min: 0, max: subUnit.qtyInNextBiggestUnit-1})
            .on("spin", function(event, ui) {
              self.setUnitQty(subUnit.unit, ui.value);
              self.element.change();
            });
        });
    },
    _reCalculateSeconds: function() {
      var seconds = 0;
      $.each(this._getSubUnits(), function(ii, subUnit) {
        seconds += subUnit.quantity * subUnit.secondsPerUnit;
      });
      this.options.seconds = seconds;
    },
    _setSeconds: function(value) {
      this.options.seconds = this._constrain(value);
      this._refresh();
    },
    _refresh: function() {
      var self = this;
      var secondsInNextBiggestUnit = 1;
      var totalSeconds = this.options.seconds;

      $.each(this._getSubUnits(), function(ii, subUnit) {
        var isBiggerUnit = typeof subUnit.qtyInNextBiggestUnit === "number";
        var qtyInNextBiggestUnit = isBiggerUnit ?
          subUnit.qtyInNextBiggestUnit : 1;

        secondsPerUnit = self._getSecondsPerUnit(subUnit.unit);
        secondsInNextBiggestUnit =
          secondsPerUnit * subUnit.qtyInNextBiggestUnit;

        var valueInSeconds = totalSeconds;
        if(isBiggerUnit) { valueInSeconds %= secondsInNextBiggestUnit; }
        var valueInCurrentUnit = valueInSeconds / secondsPerUnit;
        totalSeconds -= valueInSeconds;

        self.setUnitQty(subUnit.unit, valueInCurrentUnit);
      });

      this.element.change();
    },
    _getSubUnits: function() {
      return this._subUnits.slice(0);
    },
    _getSecondsPerUnit: function(unit) {
      if(typeof this._subUnitsIndexByUnit[unit] === "undefined") {
        throw new Error("Unit does not exist!");
      }
      var index = this._subUnitsIndexByUnit[unit];
      return this._subUnits[index].secondsPerUnit;
    },
    _constrain: function( value ) {
      if (value < 0) { value = 0; }
      return parseInt(value, 10);
    },
    _destroy: function() {
      this.element
        .removeClass("durationPicker")
        .html("");
    },
    _subUnitsIndexByUnit: {}
  });
})(jQuery);
