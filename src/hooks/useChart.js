import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const useChart = (containerRef, options = {}) => {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const defaultOptions = {
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
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      ...options,
    };

    const chart = createChart(containerRef.current, defaultOptions);
    chartRef.current = chart;

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [containerRef, options]);

  const createLineSeries = (seriesOptions = {}) => {
    if (!chartRef.current) return null;
    
    const series = chartRef.current.addLineSeries({
      color: '#ff444f',
      lineWidth: 2,
      ...seriesOptions,
    });
    
    seriesRef.current = series;
    return series;
  };

  const createCandlestickSeries = (seriesOptions = {}) => {
    if (!chartRef.current) return null;
    
    const series = chartRef.current.addCandlestickSeries({
      upColor: '#4ade80',
      downColor: '#ff444f',
      borderUpColor: '#4ade80',
      borderDownColor: '#ff444f',
      wickUpColor: '#4ade80',
      wickDownColor: '#ff444f',
      ...seriesOptions,
    });
    
    seriesRef.current = series;
    return series;
  };

  const createBarSeries = (seriesOptions = {}) => {
    if (!chartRef.current) return null;
    
    const series = chartRef.current.addBarSeries({
      upColor: '#4ade80',
      downColor: '#ff444f',
      ...seriesOptions,
    });
    
    seriesRef.current = series;
    return series;
  };

  const removeSeries = () => {
    if (chartRef.current && seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }
  };

  return {
    chart: chartRef.current,
    series: seriesRef.current,
    createLineSeries,
    createCandlestickSeries,
    createBarSeries,
    removeSeries,
  };
};

export default useChart;