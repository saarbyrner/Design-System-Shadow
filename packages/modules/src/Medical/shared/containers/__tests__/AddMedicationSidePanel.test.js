import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetSquadAthletesQuery,
  useGetStockMedicationsQuery,
  useGetOrderProvidersQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import {
  useGetAthleteDataQuery,
  useGetMedicationListSourcesQuery,
  useGetDocumentNoteCategoriesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { Provider } from 'react-redux';
import AddMedicationSidePanelContainer from '../AddMedicationSidePanel';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {
    useGetSquadAthletesQuery: jest.fn(),
    useGetStockMedicationsQuery: jest.fn(),
    useGetOrderProvidersQuery: jest.fn(),
  },
  medicalSharedApi: {
    useGetAthleteDataQuery: jest.fn(),
    useGetMedicationListSourcesQuery: jest.fn(),
    useGetDocumentNoteCategoriesQuery: jest.fn(),
  },
  addMedicationSidePanel: {
    isOpen: true, // Service Queries won't be skipped if open
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
});

const props = {
  isEditing: false,
  actionType: 'Log',
  setActionType: jest.fn(),
  resetDrFirstMedications: jest.fn(),
  selectedMedication: null,
  clearSelectedMedication: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('<AddMedicationSidePanelContainer/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('Loading state', () => {
    beforeEach(() => {
      useGetSquadAthletesQuery.mockReturnValue({
        data: { squads: [] },
        error: false,
        isLoading: true,
      });
      useGetAthleteDataQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: true,
      });
      useGetStockMedicationsQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: true,
      });
      useGetOrderProvidersQuery.mockReturnValue({
        data: [],
        error: false,
        isLoading: true,
      });
      useGetMedicationListSourcesQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: true,
      });
      useGetDocumentNoteCategoriesQuery.mockReturnValue({
        data: [],
        error: false,
        isLoading: true,
      });
    });

    it('disables the dispenser select when InitialDataRequest is loading', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanelContainer {...props} />
        </Provider>
      );

      await screen.findByText('Add medication');
      const dispenserSelect = screen.getByLabelText('Dispenser');
      expect(dispenserSelect).toBeDisabled();

      // NO app status error expected
      expect(
        screen.queryByText(/Something went wrong!/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    beforeEach(() => {
      useGetSquadAthletesQuery.mockReturnValue({
        data: { squads: [] },
        error: false,
        isLoading: true,
      });
      useGetAthleteDataQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: true,
      });
      useGetStockMedicationsQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: true,
      });
      useGetOrderProvidersQuery.mockReturnValue({
        data: [],
        error: true, // ERROR here
        isLoading: true,
      });
      useGetMedicationListSourcesQuery.mockReturnValue({
        data: null,
        error: true, // ERROR here
        isLoading: false,
      });
      useGetDocumentNoteCategoriesQuery.mockReturnValue({
        data: [],
        error: false,
        isLoading: true,
      });
    });

    it('renders the error state', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanelContainer {...props} />
        </Provider>
      );

      await screen.findByText('Add medication');

      // App Status message
      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
    });
  });

  describe('Success state', () => {
    beforeEach(() => {
      useGetSquadAthletesQuery.mockReturnValue({
        data: { squads: [] },
        error: false,
        isLoading: false,
      });
      useGetAthleteDataQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: false,
      });
      useGetStockMedicationsQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: false,
      });
      useGetOrderProvidersQuery.mockReturnValue({
        data: [],
        error: false,
        isLoading: false,
      });
      useGetMedicationListSourcesQuery.mockReturnValue({
        data: null,
        error: false,
        isLoading: false,
      });
      useGetDocumentNoteCategoriesQuery.mockReturnValue({
        data: [],
        error: false,
        isLoading: false,
      });
    });

    it('enables the dispenser select when InitialDataRequest is success', async () => {
      render(
        <Provider store={store}>
          <AddMedicationSidePanelContainer {...props} />
        </Provider>
      );

      await screen.findByText('Add medication');
      const dispenserSelect = screen.getByLabelText('Dispenser');
      expect(dispenserSelect).toBeEnabled();

      // NO app status error expected
      expect(
        screen.queryByText(/Something went wrong!/i)
      ).not.toBeInTheDocument();
    });
  });
});
