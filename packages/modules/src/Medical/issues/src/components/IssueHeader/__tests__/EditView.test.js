import { screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import EditView from '../EditView';

const defaultProps = {
  athleteId: 123,
  athleteData: {},
  details: {
    squadId: 1,
  },
  onSelectDetail: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  renderWithRedux(<EditView {...props} />, {
    preloadedState: {
      medicalApi: { useGetPermittedSquadsQuery: jest.fn() },
      medicalSharedApi: {
        useLazyGetAthleteDataQuery: jest.fn(),
      },
    },
    useGlobalStore: false,
  });

describe('<EditView />', () => {
  describe('[feature-flag] editable-injury-type', () => {
    beforeEach(() => {
      window.featureFlags['editable-injury-type'] = true;
    });
    afterEach(() => {
      window.featureFlags['editable-injury-type'] = false;
    });

    it('displays the type dropdown when occurrenceType = new', async () => {
      renderComponent({ ...defaultProps, occurrenceType: 'new' });

      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('New Injury/illness')).toBeInTheDocument();

      const typeDropdown = screen
        .getByTestId('InjuryOccurrenceTypeUpdate|Input')
        .querySelector('.kitmanReactSelect input');

      selectEvent.openMenu(typeDropdown);

      expect(screen.getByText('Recurrent Injury/illness')).toBeInTheDocument();

      await selectEvent.select(typeDropdown, 'Recurrent Injury/illness');

      expect(screen.getByText('Previous injury/ illness')).toBeInTheDocument();

      const previousInjuryDropdown = screen
        .getByTestId('LinkInjuryOccurrenceType|Input')
        .querySelector('.kitmanReactSelect input');

      selectEvent.openMenu(previousInjuryDropdown);

      expect(screen.getByText('Prior injury/illness')).toBeInTheDocument();
      expect(
        screen.getByText('No prior injury record in EMR')
      ).toBeInTheDocument();

      await selectEvent.select(
        previousInjuryDropdown,
        'No prior injury record in EMR'
      );
    });

    it('hides the type dropdown when occurrenceType = continuation', async () => {
      renderComponent({ ...defaultProps, occurrenceType: 'continuation' });

      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('New Injury/illness')).not.toBeInTheDocument();
    });

    it('hides the type dropdown when occurrenceType = recurrence', async () => {
      renderComponent({ ...defaultProps, occurrenceType: 'recurrence' });

      expect(screen.queryByText('Type')).not.toBeInTheDocument();
      expect(screen.queryByText('New Injury/illness')).not.toBeInTheDocument();
    });

    it('renders squad selector', async () => {
      renderComponent();

      expect(screen.getByLabelText('Squad')).toBeInTheDocument();
    });
  });
});
