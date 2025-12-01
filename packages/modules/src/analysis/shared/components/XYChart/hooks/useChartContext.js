// @flow
import { useContext } from 'react';
import ChartContext, { type ChartContextType } from '../components/Context';

const useChartContext = (): ChartContextType => useContext(ChartContext);

export default useChartContext;
