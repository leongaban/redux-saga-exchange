import React from 'react';
import * as R from 'ramda';
import block from 'bem-cn';
import { bind } from 'decko';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

import './PieChart.scss';

am4core.options.commercialLicense = true;

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

const dataFieldKeys: Record<keyof ICellData, keyof ICellData> = {
  name: 'name',
  value: 'value',
};

interface ICellData {
  name: string;
  value: number;
}

interface IProps {
  piechartID: string;
  legendID?: string;
  data: ICellData[];
  legendHeader?: JSX.Element;
  decimals?: number;
}

const b = block('piechart');

class PieChart extends React.PureComponent<IProps> {
  private chart: am4charts.PieChart3D;

  public componentDidMount() {
    this.chart = this.createChart();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { data, decimals } = this.props;
    if (!R.equals(prevProps.data, data)) {
      this.chart.data = data;
    }
    if (decimals !== prevProps.decimals) {
      this.setLegendNumbersFormatting(this.chart);
    }
  }

  public render() {
    const { legendID } = this.props;
    return (
      <div className={b()}>
        {
          legendID
            ? this.renderChartWithLegend(legendID)
            : this.renderChart()
        }
      </div>
    );
  }

  @bind
  private renderChartWithLegend(legendID: string) {
    const { legendHeader } = this.props;
    return (
      <>
        <div className={b('legend')()}>
          <div className={b('legend-header')()}>
            {legendHeader}
          </div>
          <div id={legendID} style={{ width: '100%', }} />
        </div>
        <div className={b('chart')()}>
          {this.renderChart()}
        </div>
      </>
    );
  }

  @bind
  private renderChart() {
    const { piechartID } = this.props;
    return <div id={piechartID} style={{ width: '100%', height: '100%', }} />;
  }

  @bind
  private createChart() {
    const { data, legendID, piechartID } = this.props;
    const chart = am4core.create(piechartID, am4charts.PieChart3D);

    if (legendID) {
      this.createLegend(chart, legendID);
    }

    chart.data = data;
    chart.innerRadius = am4core.percent(50);
    chart.depth = 12;

    const series = chart.series.push(new am4charts.PieSeries3D());
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;

    // This creates initial animation
    series.hiddenState.properties.opacity = 1;
    series.hiddenState.properties.endAngle = -90;
    series.hiddenState.properties.startAngle = -90;

    // tslint:disable-next-line:max-line-length
    series.slices.template.tooltipText = '{name} {value.percent.formatNumber("#.##")}%';

    series.legendSettings.labelText = '[#9996aa]{name}[/] ';
    // tslint:disable-next-line:max-line-length
    series.legendSettings.valueText = '[#9996aa]{value.value}[/]';

    series.dataFields.value = dataFieldKeys.value;
    series.dataFields.category = dataFieldKeys.name;

    series.slices.template.stroke = am4core.color('#fff');
    series.slices.template.strokeWidth = 0.5;
    series.slices.template.strokeOpacity = 0.2;
    return chart;
  }

  @bind
  private createLegend(chart: am4charts.PieChart3D, legendID: string) {
    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.paddingTop = 2;
    chart.legend.itemContainers.template.paddingBottom = 2;
    chart.legend.itemContainers.template.width = am4core.percent(100);
    chart.legend.position = 'left';
    chart.legend.relativeWidth = 100;
    chart.legend.width = am4core.percent(100);
    chart.legend.maxY = 0;
    chart.legend.maxX = 0;
    chart.legend.marginTop = 0;
    chart.legend.paddingTop = 0;
    chart.legend.marginLeft = 0;
    chart.legend.paddingLeft = 0;
    chart.legend.fontFamily = 'Arial';

    const legendContainer = am4core.create(legendID, am4core.Container);
    legendContainer.width = am4core.percent(100);
    legendContainer.height = am4core.percent(100);
    chart.legend.parent = legendContainer;

    this.setLegendNumbersFormatting(chart);
  }

  @bind
  private setLegendNumbersFormatting(chart: am4charts.PieChart3D) {
    const { decimals = 2 } = this.props;
    chart.legend.numberFormatter.numberFormat = `#,###.${'0'.repeat(decimals)}`;
  }
}

export default PieChart;
