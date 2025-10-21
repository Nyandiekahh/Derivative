import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createChart } from 'lightweight-charts';
import { BarChart2, TrendingUp, Minus } from 'lucide-react';
import { setChartType, addTickData, addCandleData } from '../../redux/slices/tradeSlice';
import derivAPI from '../../services/derivAPI';
import './Chart.css';

const Chart = () => {
  const dispatch = useDispatch();
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const { selectedSymbol, chartType } = useSelector((state) => state.trade);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#999',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#2a2a2a',
      },
      timeScale: {
        borderColor: '#2a2a2a',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // Handle chart type and symbol changes
  useEffect(() => {
    if (!chartRef.current || !selectedSymbol) return;

    // Remove old series
    if (seriesRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (error) {
        console.error('Error removing series:', error);
      }
      seriesRef.current = null;
    }

    // Create new series based on chart type
    let series;
    try {
      if (chartType === 'line') {
        series = chartRef.current.addLineSeries({
          color: '#ff444f',
          lineWidth: 2,
        });
      } else if (chartType === 'candlestick') {
        series = chartRef.current.addCandlestickSeries({
          upColor: '#4ade80',
          downColor: '#ff444f',
          borderUpColor: '#4ade80',
          borderDownColor: '#ff444f',
          wickUpColor: '#4ade80',
          wickDownColor: '#ff444f',
        });
      } else if (chartType === 'bar') {
        series = chartRef.current.addBarSeries({
          upColor: '#4ade80',
          downColor: '#ff444f',
        });
      }

      seriesRef.current = series;
    } catch (error) {
      console.error('Error creating series:', error);
      return;
    }

    // Subscribe to data
    let unsubscribe;
    try {
      if (chartType === 'line') {
        unsubscribe = derivAPI.subscribeTicks(selectedSymbol, (data) => {
          if (data.tick && seriesRef.current) {
            const tickData = {
              time: data.tick.epoch,
              value: parseFloat(data.tick.quote),
            };
            dispatch(addTickData(tickData));
            try {
              seriesRef.current.update(tickData);
            } catch (error) {
              console.error('Error updating tick data:', error);
            }
          }
        });
      } else {
        unsubscribe = derivAPI.subscribeCandles(selectedSymbol, 60, (data) => {
          if (data.ohlc && seriesRef.current) {
            const candleData = {
              time: data.ohlc.open_time,
              open: parseFloat(data.ohlc.open),
              high: parseFloat(data.ohlc.high),
              low: parseFloat(data.ohlc.low),
              close: parseFloat(data.ohlc.close),
            };
            dispatch(addCandleData(candleData));
            try {
              seriesRef.current.update(candleData);
            } catch (error) {
              console.error('Error updating candle data:', error);
            }
          } else if (data.candles && data.candles.length > 0 && seriesRef.current) {
            const candles = data.candles.map((candle) => ({
              time: candle.epoch,
              open: parseFloat(candle.open),
              high: parseFloat(candle.high),
              low: parseFloat(candle.low),
              close: parseFloat(candle.close),
            }));
            try {
              seriesRef.current.setData(candles);
            } catch (error) {
              console.error('Error setting candle data:', error);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error subscribing to data:', error);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      }
    };
  }, [selectedSymbol, chartType, dispatch]);

  return (
    <div className="chart-container">
      <div className="chart-controls">
        <h3>Chart - {selectedSymbol}</h3>
        <div className="chart-type-buttons">
          <button
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => dispatch(setChartType('line'))}
            title="Line Chart"
          >
            <Minus size={16} />
          </button>
          <button
            className={`chart-type-btn ${chartType === 'candlestick' ? 'active' : ''}`}
            onClick={() => dispatch(setChartType('candlestick'))}
            title="Candlestick Chart"
          >
            <BarChart2 size={16} />
          </button>
          <button
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => dispatch(setChartType('bar'))}
            title="Bar Chart"
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-canvas" />
    </div>
  );
};

export default Chart;