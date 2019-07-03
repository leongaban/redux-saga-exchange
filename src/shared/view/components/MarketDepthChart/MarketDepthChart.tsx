import * as React from 'react';
import Chart from 'chart.js';
import { bind } from 'decko';

import { DayTheme, NightTheme } from '../StockChart/Themes';
import { ITradeOrders, ITradeOrder } from '../../../types/models';

interface IChartItem {
  x: number;
  y: number;
}

interface IProps {
  tradeOrders: ITradeOrders;
  text?: string;
  theme?: 'day' | 'night';
}

type Props = IProps;

class MarketDepthChart extends React.PureComponent<Props> {
  private canvasRef: HTMLCanvasElement;
  private chart: Chart;

  public componentDidMount() {
    this.createChart();
  }

  public componentDidUpdate() {
    if (this.chart.data.datasets) {
      const bids = this.makeChartDataFromOrders(this.props.tradeOrders.bid);
      const asks = this.makeChartDataFromOrders(this.props.tradeOrders.ask);
      this.chart.data.datasets[0].data = bids;
      this.chart.data.datasets[1].data = asks;

      this.chart.update();
    }
  }

  public render() {
    return (
      <canvas ref={this.setCanvasRef} />
    );
  }

  @bind
  private setCanvasRef(ref: HTMLCanvasElement) {
    this.canvasRef = ref;
  }

  private getTheme() {
    switch (this.props.theme) {
      case 'night': return NightTheme;
      default: return DayTheme;
    }
  }

  @bind
  private makeChartDataFromOrders(tradeOrders: ITradeOrder[]): IChartItem[] {
    return (function loop(orders: ITradeOrder[], acc: IChartItem[], totalAcc: number): IChartItem[] {
      if (orders.length === 0) {
        return acc;
      }

      const [x, ...xs] = orders;

      const totalSum = totalAcc + x.total;

      return loop(xs, [...acc, { x: x.price, y: totalSum }], totalSum);
    })(tradeOrders, [], 0);
  }

  private createChart() {
    const { text, tradeOrders } = this.props;
    const ChartColors = this.getTheme().marketDepth;

    const bids = this.makeChartDataFromOrders(tradeOrders.bid);
    const asks = this.makeChartDataFromOrders(tradeOrders.ask);

    this.chart = new Chart(this.canvasRef, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Bids',
            data: bids,
            backgroundColor: ChartColors.bids.background,
            borderColor: ChartColors.bids.color,
            borderWidth: 0.5,
            pointRadius: 0.5,
            pointHoverRadius: 3,
            steppedLine: 'after',
            fill: 'start',
          },
          {
            label: 'Asks',
            data: asks,
            backgroundColor: ChartColors.asks.background,
            borderColor: ChartColors.asks.color,
            borderWidth: 0.5,
            pointRadius: 0.5,
            pointHoverRadius: 3,
            steppedLine: 'after',
            fill: 'start',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        spanGaps: false,
        // showTooltips: true,
        elements: {
          line: {
            tension: 0.000001,
          },
        },
        animation: {
          duration: 0,
          easing: 'easeInBack',
        },
        hover: {
          intersect: false,
          mode: 'x',
          animationDuration: 0,
        },
        /*tooltips: {
          enabled: false,
          intersect: false,
          position: 'nearest',
          custom: this.renderTooltip,
        },*/
        scales: {
          xAxes: [{
            type: 'linear',
            ticks: {
              fontColor: ChartColors.label,
              beginAtZero: false,
              autoSkip: false,
              maxTicksLimit: 10,
              maxRotation: 0,
            },
            gridLines: {
              display: false,
              color: ChartColors.label,
            },
          }],
          yAxes: [{
            gridLines: {
              color: ChartColors.grid,
            },
            ticks: {
              fontColor: ChartColors.label,
            },
          }],
        },
        title: {
          display: false,
          fontColor: ChartColors.label,
          fontSize: 25,
          text,
        },
        legend: {
          labels: {
            fontColor: ChartColors.label,
            fontSize: 18,
          },
        },
        plugins: {
          filler: {
            propagate: false,
          },
        },
      },
    });
  }
}

export { IProps };
export default MarketDepthChart;
