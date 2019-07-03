import { colors } from 'shared/view/styles/themes/night/variables';

const xAxisColor = '#8E8E8E';
const line1Color = '#FF8900'; // orange
const line2Color = '#007CD8'; // blue
const line3Color = '#26809C'; // light blue
const line4Color = '#E27601'; // light orange

const NightTheme: any = {
  name: 'Night',
  chart: {
    background: [colors.chartBackgroundColor, colors.chartBackgroundColor],
    border: {
      width: 0,
      strokeColor: 'grey',
      lineStyle: 'solid',
    },
    instrumentWatermark: {
      symbol: {
        fontFamily: 'Work Sans', // Arial
        fontSize: 70,
        fontStyle: 'normal',
        fillColor: '#0d0d0d',
      },
      details: {
        fontFamily: 'Work Sans', // Arial
        fontSize: 40,
        fontStyle: 'normal',
        fillColor: '#1b1b1b',
      },
    },
  },
  splitter: {
    fillColor: 'rgb(43, 44, 52)',
    hoverFillColor: '#DDD',
  },
  // Chart background grid
  chartPanel: {
    grid: {
      width: 1,
      strokeColor: colors.chartGridColor,
    },
    /* Each indicator title text */
    title: {
      fontFamily: 'Work Sans',
      fontSize: 11,
      fontStyle: 'normal',
      fillColor: colors.yAxisTextColor,
    },
    watermark: {
      text: {
        fontFamily: 'Work Sans',
        fontSize: 40,
        fontStyle: 'normal',
        fillColor: '#666',
      },
    },
  },
  // Right values panel
  valueScale: {
    fill: {
      fillColor: 'transparent',
    },
    text: {
      fontFamily: 'Work Sans',
      fontSize: 11,
      fontStyle: 'normal',
      fillColor: colors.yAxisTextColor,
    },
    line: {
      width: 1,
      strokeColor: 'rgb(42, 43, 51)',
    },
    border: {
      width: 1,
      strokeColor: 'rgb(43, 44, 52)',
      lineStyle: 'solid',
    },
    valueMarker: {
      text: {
        fontFamily: 'Work Sans',
        fontSize: 11,
        fillColor: colors.yAxisTextColor,
      },
      fill: {
        fillColor: 'green',
      },
    },
  },
  dateScale: {
    fill: {
      fillColor: 'transparent',
    },
    text: {
      fontFamily: 'Work Sans', // Calibri
      fontSize: 11,
      fillColor: xAxisColor,
    },
    line: {
      width: 1,
      strokeColor: xAxisColor,
    },
    border: {
      width: 1,
      strokeColor: 'rgba(207,204,223,0.11)',
      lineStyle: 'solid',
    },
    dateMarker: {
      text: {
        fontFamily: 'Work Sans', // Calibri
        fontSize: 11,
        fillColor: xAxisColor,
      },
      fill: {
        fillColor: 'green',
      },
      stroke: {
        strokePriority: 'color',
        strokeColor: xAxisColor,
        width: 1,
        lineStyle: 'solid',
        lineJoin: 'miter',
        lineCap: 'butt',
      },
    },
    breakLine: {
      stroke: {
        strokeColor: '#545454',
        width: 1,
        lineStyle: 'dash',
      },
    },
  },
  crossHair: {
    text: {
      fontFamily: 'Work Sans', // Calibri
      fontSize: 11,
      fillColor: 'black',
    },
    line: {
      width: 1,
      strokeColor: '#333',
      lineStyle: 'dashed',
    },
    fill: {
      fillColor: '#DDD',
    },
  },
  zoomIn: {
    border: {
      width: 1,
      strokeColor: 'darkgray',
      lineStyle: 'solid',
    },
    fill: {
      fillColor: 'rgba(0, 0, 255, 0.5)',
    },
  },
  plot: {
    point: {
      dot: {
        fill: {
          fillColor: '#555', // #555
        },
      },
    },
    line: {
      simple: {
        width: 1,
        strokeColor: '#555',
      },
      mountain: {
        line: {
          width: 1,
          strokeColor: '#555',
        },
        fill: {
          fillColor: 'rgba(0, 0, 255, 0.5)',
        },
      },
      step: {
        width: 1,
        strokeColor: '#555',
      },
    },
    histogram: {
      line: {
        width: 1,
        strokeColor: '#555',
      },
      coloredLine: {
        upBar: {
          width: 1,
          strokeColor: colors.upCandleColor,
        },
        downBar: {
          width: 1,
          strokeColor: colors.downCandleColor,
        },
      },
      column: {
        line: {
          strokeEnabled: true,
          width: 1,
          strokeColor: '#1B1C25',
        },
        fill: {
          fillColor: 'blue',
        },
      },
      coloredColumn: {
        upBar: {
          line: {
            strokeEnabled: true,
            width: 1,
            strokeColor: '#1B1C25',
          },
          fill: {
            fillColor: colors.upCandleColor,
          },
        },
        downBar: {
          line: {
            strokeEnabled: true,
            width: 1,
            strokeColor: '#1B1C25',
          },
          fill: {
            fillColor: colors.downCandleColor,
          },
        },
      },
    },
    bar: {
      OHLC: {
        width: 1,
        strokeColor: '#555',
      },
      HLC: {
        width: 1,
        strokeColor: '#555',
      },
      HL: {
        width: 1,
        strokeColor: '#555',
      },
      coloredOHLC: {
        upBar: {
          width: 1,
          strokeColor: colors.upCandleColor,
        },
        downBar: {
          width: 1,
          strokeColor: colors.downCandleColor,
        },
      },
      coloredHLC: {
        upBar: {
          width: 1,
          strokeColor: colors.upCandleColor,
        },
        downBar: {
          width: 1,
          strokeColor: colors.downCandleColor,
        },
      },
      coloredHL: {
        upBar: {
          width: 1,
          strokeColor: colors.upCandleColor,
        },
        downBar: {
          width: 1,
          strokeColor: colors.downCandleColor,
        },
      },
      candle: {
        upCandle: {
          border: {
            strokeEnabled: true,
            width: 1,
            strokeColor: colors.upCandleColor,
          },
          fill: {
            fillColor: colors.upCandleColor,
          },
          wick: {
            width: 1,
            strokeColor: colors.upCandleColor,
          },
        },
        downCandle: {
          border: {
            strokeEnabled: true,
            width: 1,
            strokeColor: colors.downCandleColor,
          },
          fill: {
            fillColor: colors.downCandleColor,
          },
          wick: {
            width: 1,
            strokeColor: colors.downCandleColor,
          },
        },
      },
      heikinAshi: {
        upCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: '#CCC',
          },
          fill: {
            fillColor: 'green',
          },
          wick: {
            width: 1,
            strokeColor: '#555',
          },
        },
        downCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: '#CCC',
          },
          fill: {
            fillColor: 'red',
          },
          wick: {
            width: 1,
            strokeColor: '#555',
          },
        },
      },
      renko: {
        upCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: '#CCC',
          },
          fill: {
            fillColor: 'green',
          },
        },
        downCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: '#CCC',
          },
          fill: {
            fillColor: 'red',
          },
        },
      },
      lineBreak: {
        upCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: 'green',
          },
          fill: {
            fillColor: 'green',
          },
        },
        downCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: 'red',
          },
          fill: {
            fillColor: 'red',
          },
        },
      },
      hollowCandle: {
        upCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: '#CCC',
          },
          fill: {
            fillColor: 'green',
          },
          wick: {
            width: 1,
            strokeColor: '#555',
          },
        },
        downCandle: {
          border: {
            strokeEnabled: false,
            width: 1,
            strokeColor: '#CCC',
          },
          fill: {
            fillColor: 'red',
          },
          wick: {
            width: 1,
            strokeColor: '#555',
          },
        },
        upHollowCandle: {
          border: {
            width: 1,
            strokeColor: 'green',
          },
          wick: {
            width: 1,
            strokeColor: 'green',
          },
        },
        downHollowCandle: {
          border: {
            width: 1,
            strokeColor: 'red',
          },
          wick: {
            width: 1,
            strokeColor: 'red',
          },
        },
      },
      pointAndFigure: {
        upCandle: {
          border: {
            strokeEnabled: !0,
            width: 1,
            strokeColor: 'green',
          },
        },
        downCandle: {
          border: {
            strokeEnabled: !0,
            width: 1,
            strokeColor: 'red',
          },
        },
      },
      kagi: {
        upCandle: {
          border: {
            strokeEnabled: !0,
            width: 1,
            strokeColor: 'green',
          },
        },
        downCandle: {
          border: {
            strokeEnabled: !0,
            width: 1,
            strokeColor: 'red',
          },
        },
      },
    },
    indicator: {
      line1: {
        width: 1,
        lineStyle: 'solid',
        strokeColor: line1Color,
      },
      line2: {
        width: 1,
        lineStyle: 'solid',
        strokeColor: line2Color,
      },
      line3: {
        width: 1,
        lineStyle: 'solid',
        strokeColor: line3Color,
      },
      line4: {
        width: 1,
        lineStyle: 'solid',
        strokeColor: line4Color,
      },
    },
    customMACD: {
      rightPanel: {
        fill: {
          fillEnabled: true,
          fillColor: colors.upCandleColor,
        },
        line: {
          strokeEnabled: false,
        },
      },
      indicator: {
        line1: {
          width: 1,
          lineStyle: 'solid',
          strokeColor: '#0098D8',
        },
        line2: {
          width: 1,
          lineStyle: 'solid',
          strokeColor: '#F9671E',
        },
      },
    },
  },
  selectionMarker: {
    line: {
      strokeColor: '#777',
      width: 1,
    },
    fill: {
      fillColor: 'black',
    },
  },
  drawing: {
    note: {
      text: {
        fontFamily: 'Work Sans', // Calibri
        fontSize: 11,
        fillColor: 'black',
      },
      fill: {
        fillColor: '#15C',
      },
      centerPointFill: {
        fillColor: 'white',
      },
    },
    measure: {
      line: {
        width: 1,
        strokeColor: 'white',
        strokeEnabled: !0,
        lineStyle: 'dash',
      },
      border: {
        width: 1,
        strokeColor: 'white',
        strokeEnabled: !0,
        lineStyle: 'dash',
      },
      fill: {
        fillEnabled: !0,
        fillColor: 'rgba(0, 0, 255, 0.5)',
      },
      balloon: {
        text: {
          fontFamily: 'Work Sans', // Calibri
          fontSize: 11,
          fillColor: 'black',
        },
        border: {
          width: 1,
          strokeColor: 'darkgray',
          strokeEnabled: !0,
          lineStyle: 'solid',
        },
        fill: {
          fillEnabled: !0,
          fillColor: 'rgba(0, 0, 255, 0.5)',
        },
      },
    },
    measureTool: {
      line: {
        width: 1,
        strokeColor: 'black',
      },
      text: {
        fontFamily: 'Calibri',
        fontSize: 11,
        fillColor: 'black',
      },
      fill: {
        fillColor: xAxisColor,
      },
    },
    abstract: {
      line: {
        strokeColor: '#555',
        width: 1,
      },
      fill: {
        fillColor: xAxisColor,
      },
      text: {
        fontFamily: 'Work Sans', // Calibri
        fontSize: 12,
        fillColor: '#555',
        decoration: '',
      },
    },
    trendAngle: {
      line: {
        strokeColor: '#555',
        width: 1,
      },
      text: {
        fontFamily: 'Work Sans', // Calibri
        fontSize: 12,
        fillColor: '#555',
        decoration: '',
      },
      arc: {
        strokeColor: '#555',
        width: 1,
        lineStyle: 'dot',
      },
      horizontalLine: {
        strokeColor: '#555',
        width: 1,
        lineStyle: 'dot',
      },
    },
    abstractMarker: {
      fill: {
        fillColor: '#555',
      },
    },
    fibonacci: {
      trendLine: {
        strokeColor: 'black',
        width: 1,
        lineStyle: 'dash',
      },
      line: {
        strokeColor: 'black',
        width: 1,
      },
      fill: {
        fillColor: 'rgba(0, 0, 0, 0.3)',
      },
      text: {
        fontFamily: 'Work Sans', // Calibri
        fontSize: 12,
        fillColor: 'black',
      },
    },
    arrowUp: {
      fill: {
        fillColor: 'limegreen',
      },
    },
    arrowDown: {
      fill: {
        fillColor: 'red',
      },
    },
    text: {
      text: {
        fontFamily: 'Work Sans', // Calibri
        fontSize: 12,
        fillColor: '#555',
        decoration: '',
      },
    },
    image: {
      noImage: {
        line: {
          strokeColor: 'red',
          width: 1,
        },
      },
    },
  },
  tooltip: {
    text: {
      fontFamily: 'Work Sans', // Calibri
      fontSize: 12,
      fillColor: 'black',
      fontWeight: 'normal',
      fontStyle: 'normal',
      decoration: '',
    },
    border: {
      enabled: !0,
      width: 1,
      color: '#15C',
      lineStyle: 'solid',
    },
    fill: {
      enabled: !0,
      color: 'white',
    },
  },
  spread: {
    ask: {
      line: {
        width: 1,
        strokeColor: '#00D533',
      },
      valueMarker: {
        fill: {
          fillColor: '#00D533',
        },
        text: {
          fontFamily: 'Work Sans', // Calibri
          fontSize: 11,
          fontStyle: 'normal',
          fillColor: 'white',
        },
      },
    },
    bid: {
      line: {
        width: 1,
        strokeColor: '#F20500',
      },
      valueMarker: {
        fill: {
          fillColor: '#F20500',
        },
        text: {
          fontFamily: 'Work Sans', // Calibri
          fontSize: 11,
          fontStyle: 'normal',
          fillColor: 'white',
        },
      },
    },
  },
  marketDepth: {
    label: '#cdcdcd',
    grid: 'rgba(221,221,221,0.1)',
    bids: {
      background: 'rgba(77, 165, 60, 0.3)',
      color: 'rgb(77, 165, 60)',
    },
    asks: {
      background: 'rgba(255, 105, 57, 0.3)',
      color: 'rgb(255, 105, 57)',
    },
  },
};

export { NightTheme };
