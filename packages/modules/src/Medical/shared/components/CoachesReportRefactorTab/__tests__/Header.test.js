import { render, screen } from '@testing-library/react';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import { Provider } from 'react-redux';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import Header from '../components/Header';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<Header />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    filters: {
      squads: [1],
    },
    dataGridCurrentDate: '2024-11-27T18:59:10Z',
    rowSelectionModel: [],
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders action buttons as expected with nessesary prop/permission present', () => {
    render(
      <Provider store={storeFake({})}>
        <Header {...props} />
      </Provider>
    );

    const expectedHeader = `Daily Status Report - ${formatStandard({
      date: moment(props.dataGridCurrentDate),
    })}`;

    expect(screen.getByText(expectedHeader)).toBeInTheDocument();
  });
});
