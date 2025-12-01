import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { Provider } from 'react-redux';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import React from 'react';

import { saveNote } from '@kitman/services';
import useTUEForm from '@kitman/modules/src/Medical/shared/components/AddTUESidePanel/hooks/useTUEForm';
import MedicationTUE from '../index';

jest.mock('@kitman/services', () => ({
  saveNote: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/Medical/shared/components/AddTUESidePanel/hooks/useTUEForm'
);

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

const store = storeFake({
  medicalApi: {},
  medicalSharedApi: {
    useGetAthleteDataQuery: jest.fn(),
  },
});

const renderComponent = (props) => {
  const ref = React.createRef();
  render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <MedicationTUE {...props} ref={ref} t={i18nextTranslateStub()} />
      </LocalizationProvider>
    </Provider>
  );
  return ref.current;
};

describe('<MedicationTUE />', () => {
  const defaultProps = {
    isOpen: false,
    athleteId: 123,
    isDisabled: false,
    toggleOpen: jest.fn(),
  };

  const mockDispatch = jest.fn();
  const mockFormState = {
    tue_date: null,
    tue_name: null,
    tue_expiration_date: null,
    injury_occurrence_ids: [],
    illness_occurrence_ids: [],
    chronic_issue_ids: [],
    restricted_to_doc: false,
    restricted_to_psych: false,
  };

  beforeEach(() => {
    useGetAthleteDataQuery.mockReturnValue({
      data: null,
      error: false,
      isLoading: false,
    });
    moment.tz.setDefault('UTC');
    useTUEForm.mockReturnValue({
      formState: mockFormState,
      dispatch: mockDispatch,
    });
    saveNote.mockResolvedValue({});
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.clearAllMocks();
  });

  it('renders the "Add TUE" button when closed', () => {
    renderComponent(defaultProps);

    expect(screen.getByRole('button', { name: 'Add TUE' })).toBeInTheDocument();
    const collapseBody = screen.getByTestId('collapse-body');
    expect(collapseBody).toHaveClass('MuiCollapse-hidden');
  });

  it('renders the TUE form when open', () => {
    renderComponent({ ...defaultProps, isOpen: true });

    const collapseHeader = screen.getByTestId('collapse-header');
    expect(collapseHeader).toHaveClass('MuiCollapse-hidden');

    const collapseBody = screen.getByTestId('collapse-body');
    expect(collapseBody).not.toHaveClass('MuiCollapse-hidden');

    expect(
      screen.getByRole('button', { name: 'Add New TUE' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Use Existing TUE' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('TUE name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of TUE')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiration date')).toBeInTheDocument();
    expect(screen.getByLabelText('Visibility')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls toggleOpen when "Add TUE" button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);
    await user.click(screen.getByRole('button', { name: 'Add TUE' }));
    expect(defaultProps.toggleOpen).toHaveBeenCalledTimes(1);
  });

  it('calls toggleOpen when "Cancel" button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({ ...defaultProps, isOpen: true });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(defaultProps.toggleOpen).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isDisabled is true', () => {
    renderComponent({ ...defaultProps, isDisabled: true });
    expect(screen.getByRole('button', { name: 'Add TUE' })).toBeDisabled();

    renderComponent({ ...defaultProps, isOpen: true, isDisabled: true });
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('dispatches SET_TUE_NAME on TUE name input change', async () => {
    const user = userEvent.setup();
    renderComponent({ ...defaultProps, isOpen: true });
    const tueNameInput = screen.getByLabelText('TUE name');
    await user.type(tueNameInput, 'Test TUE');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TUE_NAME',
      tue_name: 'T', // Just check First character gets sent as not updating state
    });
  });

  it('dispatches SET_VISIBILITY on Visibility select change', async () => {
    const user = userEvent.setup();
    renderComponent({ ...defaultProps, isOpen: true });

    const visibilitySelect = screen.getByLabelText('Visibility');

    user.click(visibilitySelect);

    // Locate the corresponding popup (`listbox`) of options.
    const optionsPopupEl = await screen.findByRole('listbox', {
      name: 'Visibility',
    });
    // Click an option in the popup.
    await userEvent.click(within(optionsPopupEl).getByText(/Doctors/i));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_VISIBILITY',
      visibilityId: 'DOCTORS',
    });
  });

  describe('checkTUEValidation', () => {
    it('returns true and allows validation check when all required fields are present', () => {
      useTUEForm.mockReturnValue({
        formState: {
          ...mockFormState,
          tue_date: '2023-10-26',
          tue_name: 'Valid TUE',
          tue_expiration_date: '2024-10-26',
        },
        dispatch: mockDispatch,
      });
      const ref = renderComponent({ ...defaultProps, isOpen: true });
      const isValid = ref.checkTUEValidation();
      expect(isValid).toBe(true);
    });

    it('returns false and shows validation errors when required fields are missing', async () => {
      const ref = renderComponent({ ...defaultProps, isOpen: true });
      const isValid = ref.checkTUEValidation();
      expect(isValid).toBe(false);

      await waitFor(() => {
        expect(screen.getByLabelText('TUE name')).toHaveAttribute(
          'aria-invalid',
          'true'
        );
        expect(screen.getByLabelText('Date of TUE')).toHaveAttribute(
          'aria-invalid',
          'true'
        );
        expect(screen.getByLabelText('Expiration date')).toHaveAttribute(
          'aria-invalid',
          'true'
        );
      });
    });
  });

  describe('saveTUE', () => {
    it('calls saveNote with correct data when in "new" mode', async () => {
      useTUEForm.mockReturnValue({
        formState: {
          ...mockFormState,
          tue_date: '2023-10-26',
          tue_name: 'New TUE',
          tue_expiration_date: '2024-10-26',
          injury_occurrence_ids: [1, 2],
          illness_occurrence_ids: [3],
          chronic_issue_ids: [4, 5],
          restricted_to_doc: true,
          restricted_to_psych: false,
        },
        dispatch: mockDispatch,
      });
      const ref = renderComponent({ ...defaultProps, isOpen: true });
      await ref.saveTUE();
      expect(saveNote).toHaveBeenCalledTimes(1);
      expect(saveNote).toHaveBeenCalledWith(defaultProps.athleteId, {
        attachment_ids: [],
        expiration_date: '2024-10-26',
        injury_ids: [1, 2],
        illness_ids: [3],
        chronic_issue_ids: [4, 5],
        medical_type: 'TUE',
        note_date: '2023-10-26',
        medical_name: 'New TUE',
        note: 'TUE',
        note_type: 3,
        restricted: true,
        psych_only: false,
      });
    });
  });
});
