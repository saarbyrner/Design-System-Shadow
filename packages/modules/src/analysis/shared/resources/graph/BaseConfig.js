// @flow
import { colors } from '@kitman/common/src/variables';
import _isEmpty from 'lodash/isEmpty';

const getGraphColourPalette = () => {
  const analyticalDashboard = document.getElementById('analyticalDashboard');
  if (window.graphColours && !_isEmpty(window.graphColours)) {
    return window.graphColours;
  }

  // TODO remove this when fully migrated
  if (
    analyticalDashboard &&
    JSON.parse(analyticalDashboard.dataset.graphColours)
  ) {
    return JSON.parse(analyticalDashboard.dataset.graphColours);
  }

  return {
    default_colours: [
      '#3A8DEE',
      '#F39C11',
      '#1BBC9C',
      '#F1C410',
      '#E74D3D',
      '#2ECC70',
      '#0E478A',
      '#8F44AD',
      '#082E5A',
      '#C0392B',
    ],
  };
};

export const graphSeriesColors = () => {
  return (
    getGraphColourPalette().colours || getGraphColourPalette().default_colours
  );
};

const BaseConfig = () => ({
  colors: graphSeriesColors(),
  title: {
    text: null,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    useHTML: true,
    backgroundColor: colors.p06,
    shadow: false,
    borderRadius: 8,
    padding: 10,
    style: {
      pointerEvents: 'auto',
    },
  },
  rangeSelector: {
    enabled: false,
  },
  navigator: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  scrollbar: {
    enabled: false,
  },
});

export default BaseConfig;
