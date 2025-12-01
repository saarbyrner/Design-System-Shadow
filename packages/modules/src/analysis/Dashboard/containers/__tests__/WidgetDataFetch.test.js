import { render, screen } from '@testing-library/react';
import WidgetDataFetch from '../WidgetDataFetch';
import { fetchWidgetContent } from '../../redux/actions/widgets';

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());
const mockDispatch = jest.fn();

jest.mock('../../redux/actions/widgets', () => {
  const originalModule = jest.requireActual('../../redux/actions/widgets');
  return {
    ...originalModule,
    fetchWidgetContent: jest.fn(),
  };
});

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

describe('Analysis|Containers|<WidgetDataFetch/>', () => {
  it('renders children', () => {
    render(
      <WidgetDataFetch widget={{ widget_render: {} }}>
        <div>child</div>
      </WidgetDataFetch>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('dispatches data fetch action on mount when __async__: true', () => {
    render(
      <WidgetDataFetch
        widget={{
          id: 123,
          widget_type: 'chart',
          widget_render: { __async__: true },
        }}
      >
        <div>child</div>
      </WidgetDataFetch>
    );

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(fetchWidgetContent).toHaveBeenCalledWith(123, 'chart');
  });

  it('doesnt dispatch data fetch action when __async__ is undefined', () => {
    render(
      <WidgetDataFetch
        widget={{
          id: 123,
          widget_type: 'chart',
          widget_render: {},
        }}
      >
        <div>child</div>
      </WidgetDataFetch>
    );

    expect(mockDispatch).not.toHaveBeenCalledTimes(1);
    expect(fetchWidgetContent).not.toHaveBeenCalled();
  });
});
