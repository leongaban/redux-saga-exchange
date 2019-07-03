var CustomSMA = null;

(function() {
    "use strict";

    CustomSMA = function(config) {
        config = config || {
            indicatorName: 'SMA',
            [StockChartX.IndicatorParam.PERIODS]: [7, 25, 40], // default values
            [StockChartX.IndicatorParam.SOURCE]: StockChartX.DataSeriesSuffix.CLOSE,
        };

        this.config = config;
        StockChartX.Indicator.call(this, config);
        Object.keys(config).map((name) => this.setParameterValue(name, config[name]));
    };

    CustomSMA.prototype = {

        getName: function() {
            return this.config.indicatorName || "SMA";
        },

        getShortName: function() {
            return "SMA";
        },

        serialize: function() {
            let state = StockChartX.Indicator.prototype.serialize.call(this);

            state.isCustomSMA = true;

            return state;
        },

        calculate: function () {
            let sourceSuffix = this.getParameterValue(StockChartX.IndicatorParam.SOURCE),
                periods = this.getParameterValue(StockChartX.IndicatorParam.PERIODS),
                sourceField = this._createField(sourceSuffix),
                indicatorName = StockChartX.IndicatorField.INDICATOR,
                title,
                recordSet;

            title = [sourceField.name, ...periods];
            recordSet = TASdk.MovingAverage.prototype.simpleMovingAverage(sourceField, periods[0], indicatorName);

            const recordSet2 = TASdk.MovingAverage.prototype.simpleMovingAverage(sourceField, periods[1], indicatorName);
            const field2 = recordSet2.getField(indicatorName);
            recordSet.addField(field2);

            const recordSet3 = TASdk.MovingAverage.prototype.simpleMovingAverage(sourceField, periods[2], indicatorName);
            const field3 = recordSet3.getField(indicatorName);
            recordSet.addField(field3);

            this._calculateResult = {
                parameters: title ? title.join(", ") : '',
                recordSet: recordSet,
                startIndex: periods.map(x => x + 1)
            };
            return this._calculateResult;
        },

        _initIndicator: function (config) {
            StockChartX.Indicator.prototype._initIndicator.call(this, config);
            try {
                let params = this._options.parameters,
                    paramName = StockChartX.IndicatorParam,
                    fieldName = StockChartX.IndicatorField;

                this._fieldNames = [
                    fieldName.INDICATOR,
                    fieldName.INDICATOR,
                    fieldName.INDICATOR
                ];

                this._isOverlay = true;

                params[paramName.LINE_WIDTH] = 1;
                params[paramName.LINE_STYLE] = StockChartX.LineStyle.SOLID;
                params[paramName.LINE2_WIDTH] = 1;
                params[paramName.LINE2_STYLE] = StockChartX.LineStyle.SOLID;
                params[paramName.LINE3_WIDTH] = 1;
                params[paramName.LINE3_STYLE] = StockChartX.LineStyle.SOLID;
            }
            catch (e) {
                console.error(e);
            }
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

        _updatePlotItem: function (index) {
            return this._updateLine(index);
        },

        _updateLine: function(i) {
            let result = this._calculateResult;
            let plotItem = this._plotItems[i];
            let fieldName = this._fieldNames[i];
            let field = result.recordSet && result.recordSet.getFieldByIndex(i);
            let dataSeries = field ? StockChartX.DataSeries.fromField(field, result.startIndex[i])
                : new StockChartX.DataSeries(fieldName);
            let theme = this._getLineTheme(i);;
            plotItem.plot = new StockChartX.LinePlot({
                dataSeries: dataSeries,
                theme: theme
            });
            return true;
        },

        updateHoverRecord: function (record) {
            StockChartX.Indicator.prototype.updateHoverRecord.call(this, record);

            if (!this.showValuesInTitle)
                return;
            if (!this.showNameInTitle)
                return;

            if (record == null)
                record = this._chart.hoveredRecord;

            for (let item of this._plotItems) {
                let recordCount = item.plot.dataSeries[0] ? item.plot.dataSeries[0].length : 0;

                if (recordCount <= 0)
                    continue;
                if (record == null || record < 0 || record >= recordCount)
                    record = recordCount - 1;

                let value = item.plot.dataSeries[0].valueAtIndex(record),
                    text = this._panel.formatValue(value);

                item.titleValueSpan.text(text);
            }
        },

        destroy: function() {
            StockChartX.Indicator.prototype.destroy.call(this);
        },


        showPropertiesDialog: function() {
            StockChartX.Indicator.prototype.showPropertiesDialog.call(this);
        }
    };

    StockChartX.JsUtil.extend(CustomSMA, StockChartX.Indicator);

    let origIndicatorDeserialize2 = StockChartX.Indicator.deserialize;
    StockChartX.Indicator.deserialize = function(state) {
        if (state.isCustomSMA)
            return new CustomSMA(state);

        return origIndicatorDeserialize2(state);
    };

})();
