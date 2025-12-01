import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
// eslint-disable-next-line jest/no-mocks-import
import { MOCK_CHART_ELEMENTS } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';

import ChartFormattingPanel from '../index';

describe('ChartBuilder|FormattingPanel', () => {
  const props = {
    t: i18nextTranslateStub(),
    isOpen: true,
    canViewMetrics: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the FormattingPanel', () => {
    renderWithStore(
      <ChartFormattingPanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            widgetId: 1,
            dataSourceFormState: {
              ...MOCK_CHART_ELEMENTS[0],
            },
          },
          activeWidgets: {
            1: {
              id: 1,
              widget: {
                chart_type: 'xy',
              },
            },
          },
        },
      }
    );

    expect(screen.getByText('Formatting rules')).toBeInTheDocument();
  });
});
