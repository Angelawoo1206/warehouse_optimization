/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */


sap.ui.define(['sap/ui/core/format/NumberFormat',
    'sap/ui/core/format/DateFormat',
    'sap/ui/core/format/FileSizeFormat'],
    function(NumberFormat, DateFormat, FileSizeFormat) {
    "use strict";

    var semicolon = ":";
    /**
     * @class Provides methods set chart formatter for VizFrame. 
     *
     * @public
     * @static
     * @alias sap.viz.ui5.format.ChartFormatter
     */
    var ChartFormatter = function () {
        if (this.caller != this.getInstance) {
            throw new Error("This object cannot be instantiated");
        }
        this.formatFunctions = [];
        this._updatePatternTable();
        this._locale = sap.ui.getCore().getConfiguration().getLanguage();

        // The following function is for CVOM info time Axis label level format
        // for internal use. These does not expose to end user.
        // So function name is hard code.
        this.formatFunctions["hh:00"] = this._getCVOMHourZeroFormatter.bind(this);
        this.formatFunctions["ss''"] = this._getCVOMSecondFormatter.bind(this);
        this.formatFunctions["MMM"] = this._getCVOMMonthFormatter.bind(this);
        this.formatFunctions["d"] = this._getCVOMDayFormater.bind(this);
    };

    // Default formatting functions
    /**
     * List (Enum) type sap.viz.ui5.format.ChartFormatter.DefaultPattern
     * 
     * @enum {string}
     * @public
     * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
     */
    ChartFormatter.DefaultPattern = {
        /**
         * Short integer e.g. 234M
         * @public
         */
        SHORTINTEGER: "ShortInteger", 
        /**
         * Standard integer e.g. 234,234,234
         * @public
         */
        STANDARDINTEGER: "StandardInteger",
        /**
         * Standard float e.g. 234,234.234
         * @public
         */
        STANDARDFLOAT: "StandardFloat",
        /**
         * Long float e.g. 2.34234234 million
         * @public
         */
        LONGFLOAT: "LongFloat", 
        /**
         * Percentage e.g. 0.0234 is formatted as 2.34%
         * @public
         */
        PERCENT: "Percent", 
        /**
         * Currency e.g. 234234.234 is formatted as 234,234.23
         * @public
         */
        CURRENCY: "Currency",
        // In first version only support below date format
        /**
         * Medium year e.g. 2015
         * @public
         */
        MEDIUMYEAR: "MediumYear", 
        /**
         * Quarter e.g. Q3
         * @public
         */
        QUARTER: "Quarter", 
        /**
         * Medium month e.g. Aug
         * @public
         */
        MEDIUMMONTH: "MediumMonth", 
        /**
         * Week e.g. CW35
         * @public
         */
        WEEK: "Week",
        /**
         * Medium day e.g. 01
         * @public
         */
        MEDIUMDAY: "MediumDay",
        /**
         * Medium hour e.g. 18
         * @public
         */
        MEDIUMHOUR: "MediumHour", 
        /**
         * Medium minute e.g. 18
         * @public
         */
        MEDIUMMINUTE: "MediumMinute", 
        /**
         * Medium second e.g. 59
         * @public
         */
        MEDIUMSECOND: "MediumSecond", 
        /**
         * Format pattern for combination of year, month, and day e.g. Aug 28, 2015
         * @public
         */
        YEARMONTHDAY: "YearMonthDay", 
        /**
         * Binary file size. 1 Kibibyte = 1024 Byte
         * @public
         */
        BINARYFILESIZE: "BinaryFileSize",
        /**
         * Decimal file size. e.g. 1 Kilobyte = 1000 Byte
         * @public
         */
        DECIMALFILESIZE: "DecimalFileSize", 
    };

    ChartFormatter.prototype._updatePatternTable = function () {
        this.formatFunctions["ShortInteger"] = this._getShortIntegerFormatter();
        this.formatFunctions["StandardInteger"] = this._getStandardIntegerFormatter();
        this.formatFunctions["StandardFloat"] = this._getStandardFloatFormatter();
        this.formatFunctions["LongFloat"] = this._getLongFloatFormatter();
        this.formatFunctions["Percent"] = this._getPercentFormatter();
        this.formatFunctions["Currency"] = this._getCurrencyFormatter();
        this.formatFunctions["MediumYear"] = this._getMediumYearFormatter();
        this.formatFunctions["MediumMonth"] = this._getMediumMonthFormatter();
        this.formatFunctions["MediumDay"] = this._getMediumDayFormatter();
        this.formatFunctions["MediumHour"] = this._getMediumHourFormatter();
        this.formatFunctions["MediumMinute"] = this._getMediumMinuteFormatter();
        this.formatFunctions["MediumSecond"] = this._getMediumSecondFormatter();
        this.formatFunctions["YearMonthDay"] = this._getYearMonthDayFormatter();
        this.formatFunctions["BinaryFileSize"] = this._getBinaryFileSizeFormatter();
        this.formatFunctions["DecimalFileSize"] = this._getDecimalFileSizeFormatter();
        this.formatFunctions["Quarter"] = this._getQuarterFormatter();
        this.formatFunctions["Week"] = this._getWeekFormatter();
        this.formatFunctions["hh:mm"] = this._getHourMinuteFormatter();
        this.formatFunctions["hh:mm:ss"] = this._getHourMinuteSecondFormatter();
        this.formatFunctions["MMM d"] = this._getMonthDayFormatter();
        this.formatFunctions["YearQuarter"] = this._getYearQuarterFormatter();
        this.formatFunctions["YearMonth"] = this._getYearMonthFormatter();
    };

    /**
     * Get an instance of ChartFormatter
     * @public
     */
    ChartFormatter.getInstance = function () {
        if (!this.instance) {
            this.instance = new ChartFormatter();
        }
        return this.instance;
    };

    /**
     * Format the value according to the custom format function
     * @public
     */
    ChartFormatter.prototype.format = function (value, pattern) {
        if (pattern) {
            var currentLocale = sap.ui.getCore().getConfiguration().getLanguage();
            if (this._locale !== currentLocale) {
                this._locale = currentLocale;
                this._updatePatternTable();
            }
            if (!jQuery.isArray(value) && isNaN(value)) {
                return value;
            }
            
            if (this.formatFunctions[pattern]) {
                return this.formatFunctions[pattern](value);
            }else {
                return "use_default_formatter";
            }
        }
        return value;
    };

    // ----
    ChartFormatter.prototype._getShortIntegerFormatter = function () {
        var numberFormatter = NumberFormat.getIntegerInstance({style: 'short'});
        return numberFormatter.format.bind(numberFormatter);
    };

    ChartFormatter.prototype._getStandardIntegerFormatter = function () {
        var numberFormatter = NumberFormat.getIntegerInstance({style: 'Standard'});
        return numberFormatter.format.bind(numberFormatter);
    };

    ChartFormatter.prototype._getStandardFloatFormatter = function () {
        var numberFormatter = NumberFormat.getFloatInstance({style: 'Standard'});
        return numberFormatter.format.bind(numberFormatter);
    };

    ChartFormatter.prototype._getLongFloatFormatter = function () {
        var numberFormatter = NumberFormat.getFloatInstance({style: 'long'});
        return numberFormatter.format.bind(numberFormatter);
    };

    ChartFormatter.prototype._getPercentFormatter = function () {
        var numberFormatter = NumberFormat.getPercentInstance({style: 'precent'});
        return numberFormatter.format.bind(numberFormatter);
    };

    ChartFormatter.prototype._getCurrencyFormatter = function () {
        var numberFormatter = NumberFormat.getCurrencyInstance({style: 'currency'});
        return numberFormatter.format.bind(numberFormatter);
    };

    ChartFormatter.prototype._getMediumYearFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({pattern: 'yyyy'});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getMediumMonthFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({pattern: 'MMM'});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getMediumDayFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({pattern: 'dd'});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getMediumHourFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({pattern: 'HH'});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getMediumMinuteFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({pattern: 'mm'});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getQuarterFormatter = function () {
        var dateFormatter = DateFormat.getDateInstance({pattern: "qqq"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getWeekFormatter = function () {
        var dateFormatter = DateFormat.getDateInstance({pattern: "www"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getHourMinuteFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({format: "HHmm"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getCVOMHourZeroFormatter = function (value) {
        return this.formatFunctions["MediumHour"](value) + semicolon + "00";
    };

    ChartFormatter.prototype._getHourMinuteSecondFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({format: "HHmmss"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getYearQuarterFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({format: "yQ"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getYearMonthFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({format: "yMMM"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getCVOMSecondFormatter = function (value) {
        return this.formatFunctions["MediumSecond"](value) + "''";
    };

    ChartFormatter.prototype._getCVOMMonthFormatter = function (value) {
        return this.formatFunctions["MediumMonth"](value);
    };

    ChartFormatter.prototype._getCVOMDayFormater = function (value) {
        return this.formatFunctions["MediumDay"](value);
    };

    ChartFormatter.prototype._getMonthDayFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({format: "MMMdd"});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getMediumSecondFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({pattern: 'ss'});
        return dateFormatter.format.bind(dateFormatter);
    };

    ChartFormatter.prototype._getYearMonthDayFormatter = function () {
        var dateFormatter = DateFormat.getDateTimeInstance({format: "yMMMdd"});
        return dateFormatter.format.bind(dateFormatter);
    }; 

    ChartFormatter.prototype._getBinaryFileSizeFormatter = function () {
        var fileSizeFormatter = FileSizeFormat.getInstance({binaryFilesize: true});
        return fileSizeFormatter.format.bind(fileSizeFormatter);
    };

    ChartFormatter.prototype._getDecimalFileSizeFormatter = function () {
        var fileSizeFormatter = FileSizeFormat.getInstance({binaryFilesize: false});
        return fileSizeFormatter.format.bind(fileSizeFormatter);
    };

    ChartFormatter.prototype.registerCustomFormatter = function (pattern, formatter) {
        this.formatFunctions[pattern] = formatter;
    };

    return ChartFormatter;
}, true);

