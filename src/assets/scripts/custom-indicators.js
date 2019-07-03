var CustomMACD = null;

(function() {
    "use strict";

    CustomMACD = function(config) {
        config = config || {
            indicatorName: 'MACD',
            [StockChartX.IndicatorParam.SIGNAL_PERIODS]: 9,
            [StockChartX.IndicatorParam.LONG_CYCLE]: 26,
            [StockChartX.IndicatorParam.SHORT_CYCLE]: 12,
            [StockChartX.IndicatorParam.MA_TYPE]: TASdk.Const.simpleMovingAverage,
            barDirectionFn: function (i, dataSeries) {
                dataSeries = dataSeries[0].values;
                let prev;
                if (i === 0) {
                    prev = 0;
                } else {
                    prev = dataSeries[i - 1];
                }
                return dataSeries[i] >= prev ? StockChartX.BarDirection.Up : StockChartX.BarDirection.Down;
            },
        };

        this.config = config;
        StockChartX.Indicator.call(this, config);
        Object.keys(config).map((name) => this.setParameterValue(name, config[name]));
    };

    CustomMACD.prototype = {

        getName: function() {
            return this.config.indicatorName || "MACD";
        },

        getShortName: function() {
            return "MACD";
        },

        getParametersString: function() {
            let periods = this.getParameterValue(StockChartX.IndicatorParam.SIGNAL_PERIODS);
            let short = this.getParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE);
            let long = this.getParameterValue(StockChartX.IndicatorParam.LONG_CYCLE);

            return '(' + [periods, short, long].join(', ') + ')';
        },

        getInfoAbout: function() {
            return '<div class="scxIndicatorHelp">Overview</div>' +
                '<p>' +
                'The MACD is a moving average oscillator that shows potential overbought/oversold phases ' +
                'of market fluctuation. ' +
                'The calculation is based on two different moving averages of the price data.' +
                '</p>';
        },

        serialize: function() {
            let state = StockChartX.Indicator.prototype.serialize.call(this);

            state.isCustomMACD = true;

            return state;
        },

        calculate: function () {
            let sourceSuffix = this.getParameterValue(StockChartX.IndicatorParam.SOURCE),
                sourceField = this._createField(sourceSuffix),
                indicatorName = StockChartX.IndicatorField.INDICATOR,
                maType = this.getParameterValue(StockChartX.IndicatorParam.MA_TYPE),
                oscillator = TASdk.Oscillator.prototype,
                startIndex,
                title,
                recordSet;

            let signalPeriods = this.getParameterValue(StockChartX.IndicatorParam.SIGNAL_PERIODS);
            let longCycle = this.getParameterValue(StockChartX.IndicatorParam.LONG_CYCLE);
            let shortCycle = this.getParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE);

            startIndex = Math.trunc(Math.max(longCycle, shortCycle))
            title = [sourceField.name, signalPeriods, shortCycle, longCycle, this._getMaTypeString(maType)];
            recordSet = oscillator.MACD(sourceField, signalPeriods, longCycle, shortCycle, maType, indicatorName);

            let recordSet2 = oscillator.macdHistogram(
                sourceField, signalPeriods, longCycle, shortCycle, maType, indicatorName + " Histogram");

            let field = recordSet2.getField(indicatorName + " Histogram");
            recordSet.addField(field);

            this._calculateResult = {
                parameters: title ? title.join(", ") : '',
                recordSet: recordSet,
                startIndex: startIndex
            };
            return this._calculateResult;
        },

        _createField: function (nameSuffix, fieldName) {
            if (!nameSuffix)
                return null;

            if (fieldName === undefined) {
                switch (nameSuffix) {
                    case StockChartX.DataSeriesSuffix.OPEN:
                        fieldName = StockChartX.IndicatorField.OPEN;
                        break;
                    case StockChartX.DataSeriesSuffix.HIGH:
                        fieldName = StockChartX.IndicatorField.HIGH;
                        break;
                    case StockChartX.DataSeriesSuffix.LOW:
                        fieldName = StockChartX.IndicatorField.LOW;
                        break;
                    case StockChartX.DataSeriesSuffix.CLOSE:
                        fieldName = StockChartX.IndicatorField.CLOSE;
                        break;
                    case StockChartX.DataSeriesSuffix.VOLUME:
                        fieldName = StockChartX.IndicatorField.VOLUME;
                        break;
                    default:
                        break;
                }
            }
            let dataSeries = this._usePrimaryDataSeries ? this._chart.primaryDataSeries(nameSuffix) : this._chart.getDataSeries(nameSuffix);

            return dataSeries ? dataSeries.toField(fieldName) : null;
        },


        _initIndicator: function (config) {
            StockChartX.Indicator.prototype._initIndicator.call(this, config);
            try {
                let params = this._options.parameters,
                    dsSuffix = StockChartX.DataSeriesSuffix,
                    paramName = StockChartX.IndicatorParam,
                    fieldName = StockChartX.IndicatorField;

                this._options.taIndicator = this.getParameterValue('indicatorName') || "My MACD";

                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.INDICATORSIGNAL,
                    fieldName.INDICATOR_HISTOGRAM
                ];

                params[paramName.SOURCE] = dsSuffix.CLOSE;
                params[paramName.SIGNAL_PERIODS] = this.getParameterValue(StockChartX.IndicatorParam.SIGNAL_PERIODS) || 9;
                params[paramName.LONG_CYCLE] = this.getParameterValue(StockChartX.IndicatorParam.LONG_CYCLE) || 26;
                params[paramName.SHORT_CYCLE] = this.getParameterValue(StockChartX.IndicatorParam.SHORT_CYCLE) || 12;
                params[paramName.MA_TYPE] =
                  this.getParameterValue(StockChartX.IndicatorParam.MA_TYPE) || TASdk.Const.simpleMovingAverage;
            }
            catch (e) {
                console.error(e);
            }
        },

        _updatePlotItem: function (index) {
            let fieldName = this._fieldNames[index];
            try {
                switch(fieldName) {
                    case StockChartX.IndicatorField.INDICATOR + " Histogram":
                        return this._updateMacdHistogram(index);
                    default:
                        return this._updateLine(index);
                }
            } catch(e) {
                console.error(e);
            }
            return false;
        },

        _updateLine: function(i) {
            let result = this._calculateResult;
            let plotItem = this._plotItems[i];
            let fieldName = this._fieldNames[i];
            let field = result.recordSet && result.recordSet.getField(fieldName);
            let dataSeries = field ? StockChartX.DataSeries.fromField(field, result.startIndex)
                : new StockChartX.DataSeries(fieldName);
            let theme = this._chart.theme.plot.customMACD.indicator['line'+(i+1)];
            plotItem.plot = new StockChartX.LinePlot({
                dataSeries: dataSeries,
                theme: theme
            });
            return true;
        },

        _updateMacdHistogram: function(i) {

            let result = this._calculateResult;
            let indicatorName = this.getShortName(),
                parameters = result.parameters ? '(' + result.parameters + ')' : '',
                indicatorTitle = indicatorName + parameters;

            let plotItem = this._plotItems[i];

            let fieldName = this._fieldNames[i];
            let fieldTitle = this.getPlotName(fieldName);
            let field = result.recordSet && result.recordSet.getField(fieldName);
            let dataSeries = field ? StockChartX.DataSeries.fromField(field, result.startIndex)
                : new StockChartX.DataSeries(fieldName);

            plotItem.dataSeries = dataSeries;

            if (this._fieldNames.length === 1 || !fieldTitle)
                dataSeries.name = indicatorTitle;
            else
                dataSeries.name = indicatorTitle + "." + fieldTitle;

            this._chart.dataManager.addDataSeries(dataSeries, true);

            let theme = {
                fill: this._chart.theme.plot.customMACD.rightPanel.fill,
                line: this._chart.theme.plot.customMACD.rightPanel.line,
                upCandle: this._chart.theme.plot.bar.candle.upCandle,
                downCandle: this._chart.theme.plot.bar.candle.downCandle,
            };

            plotItem.plot = new StockChartX.HistogramPlot({
                plotStyle: StockChartX.HistogramPlot.Style.COLORED_COLUMN,
                dataSeries: dataSeries,
                barDirectionFn: this.config.barDirectionFn,
                theme: theme
            });
            return true;
        },

        destroy: function() {
            StockChartX.Indicator.prototype.destroy.call(this);
        },


        showPropertiesDialog: function() {
            StockChartX.Indicator.prototype.showPropertiesDialog.call(this);
        }
    };

    StockChartX.JsUtil.extend(CustomMACD, StockChartX.Indicator);

    let origIndicatorDeserialize2 = StockChartX.Indicator.deserialize;
    StockChartX.Indicator.deserialize = function(state) {
        if (state.isCustomMACD)
            return new CustomMACD(state);

        return origIndicatorDeserialize2(state);
    };

})();
