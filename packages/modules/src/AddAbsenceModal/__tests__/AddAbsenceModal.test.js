import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';

import AddAbsenceModal from '..';

jest.mock('@kitman/components', () => ({
  __esModule: true,
  AppStatus: ({ status, message }) =>
    status ? (
      <div>
        {status}: {message}
      </div>
    ) : null,
  DatePicker: (props) => (
    <div>
      <label>{props.label}</label>
      <input
        type="date"
        data-testid={props.name}
        onChange={(e) => props.onDateChange(new Date(e.target.value))}
      />
    </div>
  ),
  Dialogue: ({ message, confirmAction, visible }) =>
    visible ? (
      <div>
        <p>{message}</p>
        <button type="button" onClick={confirmAction}>
          Exit
        </button>
      </div>
    ) : null,
  Dropdown: (props) => (
    <div>
      <label>{props.label}</label>
      <select
        data-testid="absence-reason-dropdown"
        value={props.value || ''}
        onChange={(e) => props.onChange(parseInt(e.target.value, 10))}
      >
        {props.items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
  ),
  FormValidator: ({ children, successAction }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        successAction();
      }}
    >
      {children}
    </form>
  ),
  LegacyModal: ({ children, close, isOpen }) =>
    isOpen ? (
      <div>
        {children}
        <button type="button" aria-label="Close" onClick={close} />
      </div>
    ) : null,
  TextButton: ({ onClick, text }) => (
    <button type="submit" onClick={onClick}>
      {text}
    </button>
  ),
}));

const athleteData = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  squads: [],
  profile_picture_url: '',
  recent_load: [],
  recent_readiness: [],
  recent_events: [],
};

const defaultProps = {
  absenceData: {
    reason_id: null,
    from: '',
    to: '',
    athlete_id: null,
  },
  absenceReasons: [
    {
      id: 1,
      reason: 'Suspension (ban)',
      order: 1,
    },
    {
      id: 2,
      reason: 'Personal Reason',
      order: 2,
    },
  ],
  athlete: athleteData,
  closeModal: jest.fn(),
  isOpen: true,
  updateAbsenceReasonType: jest.fn(),
  updateAbsenceFromDate: jest.fn(),
  updateAbsenceToDate: jest.fn(),
  saveAbsence: jest.fn(),
  t: i18nextTranslateStub(),
};

global.$ = () => ({
  find: () => ({
    val: () => '2023-01-01',
  }),
  hide: jest.fn(),
  show: jest.fn(),
});

describe('<AddAbsenceModal />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with the correct title', () => {
    renderWithUserEventSetup(<AddAbsenceModal {...defaultProps} />);
    expect(
      screen.getByText(
        `${defaultProps.athlete.firstname} ${defaultProps.athlete.lastname}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Add Absence')).toBeInTheDocument();
  });

  it('renders a dropdown, two datepickers, and a save button', () => {
    renderWithUserEventSetup(<AddAbsenceModal {...defaultProps} />);
    expect(screen.getByText('Absence Reason')).toBeInTheDocument();
    expect(screen.getByText('Absent From')).toBeInTheDocument();
    expect(screen.getByText('Absent To')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  describe('Absence Reason dropdown', () => {
    it('calls updateAbsenceReasonType when an item is selected', async () => {
      const { user } = renderWithUserEventSetup(
        <AddAbsenceModal {...defaultProps} />
      );
      const dropdown = screen.getByTestId('absence-reason-dropdown');
      await user.selectOptions(dropdown, '1');
      expect(defaultProps.updateAbsenceReasonType).toHaveBeenCalledWith(1);
    });
  });

  describe('DatePickers', () => {
    it('calls updateAbsenceFromDate when "Absent From" date is selected', async () => {
      const { user } = renderWithUserEventSetup(
        <AddAbsenceModal {...defaultProps} />
      );
      const datepickerInput = screen.getByTestId(
        'availabilitylist_add_absence_from_date'
      );
      await user.type(datepickerInput, '2023-01-15');
      expect(defaultProps.updateAbsenceFromDate).toHaveBeenCalledWith(
        new Date('2023-01-15T00:00:00.000Z')
      );
    });

    it('calls updateAbsenceToDate when "Absent To" date is selected', async () => {
      const { user } = renderWithUserEventSetup(
        <AddAbsenceModal {...defaultProps} />
      );
      const datepickerInput = screen.getByTestId(
        'availabilitylist_add_absence_to_date'
      );
      await user.type(datepickerInput, '2023-01-20');
      expect(defaultProps.updateAbsenceToDate).toHaveBeenCalledWith(
        new Date('2023-01-20T00:00:00.000Z')
      );
    });

    it('shows an optional label for "Absent To" datepicker', () => {
      renderWithUserEventSetup(<AddAbsenceModal {...defaultProps} />);
      expect(screen.getByText('Optional')).toBeInTheDocument();
    });
  });

  describe('Save functionality', () => {
    it('calls saveAbsence when save button is clicked with valid data', async () => {
      const { user } = renderWithUserEventSetup(
        <AddAbsenceModal {...defaultProps} />
      );

      const dropdown = screen.getByTestId('absence-reason-dropdown');
      await user.selectOptions(dropdown, '1');

      const fromDateInput = screen.getByTestId(
        'availabilitylist_add_absence_from_date'
      );
      await user.type(fromDateInput, '2023-01-15');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(defaultProps.saveAbsence).toHaveBeenCalledWith(
        defaultProps.athlete.id,
        expect.any(Object)
      );
    });
  });

  describe('Modal close behavior', () => {
    it('calls closeModal when close button is clicked and there are no changes', async () => {
      const { user } = renderWithUserEventSetup(
        <AddAbsenceModal {...defaultProps} />
      );
      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);
      expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
    });

    it('shows a confirmation dialog on close if there are changes', async () => {
      const { user } = renderWithUserEventSetup(
        <AddAbsenceModal {...defaultProps} />
      );

      const dropdown = screen.getByTestId('absence-reason-dropdown');
      await user.selectOptions(dropdown, '1');

      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);

      expect(screen.getByText('Exit without saving?')).toBeInTheDocument();
      expect(defaultProps.closeModal).not.toHaveBeenCalled();

      const exitButton = screen.getByRole('button', { name: 'Exit' });
      await user.click(exitButton);
      expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
    });
  });
});
