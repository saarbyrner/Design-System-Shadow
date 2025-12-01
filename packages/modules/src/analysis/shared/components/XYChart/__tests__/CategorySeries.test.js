import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import CategorySeries from '../components/CategorySeries';
import { ChartContextProvider } from '../components/Context';
import useChartContext from '../hooks/useChartContext';

describe('analysis shared|CategorySeries', () => {
  const setupTest = () => {
    const valueAccessor = jest.fn();
    const categoryAccessor = jest.fn();

    const series = {
      id: 123,
      data: [],
      type: 'bar',
      valueAccessor,
      categoryAccessor,
    };

    // sets up a wrapper where the useChartContext hook is rendered in the children
    // this way we can use the result to test if the category series modifies the context
    // correctly
    const Wrapper = (props) => (
      <ChartContextProvider>
        <CategorySeries {...props.series} />
        {props.children}
      </ChartContextProvider>
    );

    const { result, rerender } = renderHook(() => useChartContext(), {
      initialProps: {
        series,
      },
      wrapper: Wrapper,
    });
    return { result, rerender, series };
  };

  it('registers a series based on the id with dataType category', async () => {
    const { result, series } = setupTest();

    await waitFor(() => {
      expect(result.current.series).toEqual(
        expect.objectContaining({ 123: { ...series, dataType: 'category' } })
      );
    });
  });
});
