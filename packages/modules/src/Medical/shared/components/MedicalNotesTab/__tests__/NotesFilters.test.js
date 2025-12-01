import { screen, render, fireEvent } from '@testing-library/react';
import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import userEvent from '@testing-library/user-event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';
import { getDefaultNotesFilters } from '../../../utils';

import NotesFilters from '../NotesFilters';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  __esModule: true,
  default: () => ({
    data: { locale: 'en-US' },
  }),
  useGetOrganisationQuery: () => ({
    data: { locale: 'en-US' },
  }),
}));

const defaultFilters = getDefaultNotesFilters({
  athleteId: null,
});

const defaultOrganisationAnnotationTypes = [
  'OrganisationAnnotationTypes::Medical',
  'OrganisationAnnotationTypes::Nutrition',
  'OrganisationAnnotationTypes::Diagnostic',
  'OrganisationAnnotationTypes::Document',
  'OrganisationAnnotationTypes::Procedure',
  'OrganisationAnnotationTypes::LegacyPresagiaConcussion',
];

const props = {
  squads: [
    { value: 1, label: 'Squad 1' },
    { value: 2, label: 'Squad 2' },
  ],
  authors: [
    { value: 1, label: 'Author 1' },
    { value: 2, label: 'Author 2' },
  ],
  annotationTypes: [
    { value: 1, label: 'Medical' },
    { value: 2, label: 'Nutrition' },
  ],
  notesFilters: getDefaultNotesFilters({
    athleteId: null,
  }),
  hiddenFilters: [],
  onNotesFiltersChange: jest.fn(),
  onClickAddMedicalNote: jest.fn(),
  t: i18nextTranslateStub(),
};

const wrapRenderWithPermissions = (passedPermissions = {}, children) => {
  return (
    <PermissionsContext.Provider
      value={{
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          ...passedPermissions,
        },
        permissionsRequestStatus: 'SUCCESS',
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

const trackEventMock = jest.fn();

beforeEach(() => {
  setI18n(i18n);
  useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
});

describe('NotesFilters', () => {
  describe('[permissions] permissions.medical.notes.canCreate', () => {
    it('renders the add medical note button', () => {
      renderWithUserEventSetup(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              notes: {
                canCreate: true,
                canArchive: true,
              },
            },
          },
          <NotesFilters {...props} />
        )
      );
      expect(
        screen.getByRole('button', { name: 'Add note' })
      ).toBeInTheDocument();
    });
  });

  describe('with permissions.medical.notes.canCreate && permissions.medical.notes.canArchive', () => {
    it('renders the correct buttons', () => {
      renderWithUserEventSetup(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              notes: {
                canCreate: true,
                canArchive: true,
              },
            },
          },
          <NotesFilters {...props} />
        )
      );

      expect(
        screen.getByRole('button', { name: 'Add note' })
      ).toBeInTheDocument();
      expect(screen.getByText('View archive')).toBeInTheDocument();
    });
  });

  it('hides the squads filter when its added to hiddenFilters prop', () => {
    renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} hiddenFilters={['squads']} />
      </LocalizationProvider>
    );

    expect(screen.getByTestId('NotesFilters|Title')).toBeInTheDocument();
    expect(screen.getByTestId('NotesFilters|Title')).toHaveTextContent('Notes');

    const desktopMenu = screen.getByTestId('NotesFilters|DesktopFilters');
    expect(desktopMenu).toBeInTheDocument();

    expect(screen.getAllByPlaceholderText('Search')).toHaveLength(2);

    // Should only have Author and Note type selects now
    expect(screen.queryByText('Roster')).not.toBeInTheDocument();
    expect(screen.getAllByText('Author')).toHaveLength(2);
    expect(screen.getAllByText('Note type')).toHaveLength(2);

    expect(screen.getAllByRole('textbox')).toHaveLength(7);
  });

  it('renders the filters in a side panel when on mobile', async () => {
    // Mock window.matchMedia for mobile view
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 768px)', // Simulate mobile
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { user } = renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const mobileMenu = screen.getByTestId('NotesFilters|MobileFilters');
    expect(mobileMenu).toBeInTheDocument();

    expect(screen.getAllByText('Filters')).toHaveLength(2);

    const filterButton = screen.getByRole('button', { name: 'Filters' });
    await user.click(filterButton);

    expect(screen.getAllByPlaceholderText('Search')).toHaveLength(2);
  });

  it('calls onNotesFiltersChange when the user changes the search text', async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const searchFields = screen.getAllByPlaceholderText('Search');
    fireEvent.change(searchFields[0], { target: { value: 'search text' } });

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      content: 'search text',
    });
  });

  it('calls onNotesFiltersChange when the user changes the authors dropdown', async () => {
    const { user } = renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[2]); // Open the Author select menu

    await user.click(screen.getByText('Author 1')); // Select an option

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      author: [1],
    });
  });

  it('calls onNotesFiltersChange when the user changes the note type dropdown', async () => {
    const { user } = renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[3]); // Open the Note type select menu
    await user.click(screen.getByText('Medical')); // Select an option

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      organisation_annotation_type: [...defaultOrganisationAnnotationTypes],
      organisation_annotation_type_ids: [1],
    });
  });

  it('calls the correct function when selecting a squad', async () => {
    const { user } = renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[1]); // Open the select menu
    await user.click(screen.getByText('Squad 1')); // Select an option

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      squads: [1],
    });
  });

  describe('DateRange picker', () => {
    beforeEach(() => {
      const fakeDate = new Date('2025-06-10T18:00:00Z'); // UTC FORMAT
      jest.useFakeTimers();
      jest.setSystemTime(fakeDate);
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('calls onNotesFiltersChange when the user changes the date range', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <NotesFilters {...props} />
        </LocalizationProvider>
      );

      const dateInputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
      expect(dateInputs).toHaveLength(4);
      const startDateInput = dateInputs[0];
      await user.click(startDateInput);
      const startDayInput = screen.getByRole('gridcell', { name: '10' });
      await user.click(startDayInput);

      const endDateInput = dateInputs[1];
      await user.click(endDateInput);
      const endDayInput = screen.getByRole('gridcell', { name: '12' });
      await user.click(endDayInput);

      await user.click(screen.getByRole('button', { name: 'OK' }));

      expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        date_range: { start_date: '2025-06-10', end_date: '2025-06-12' },
      });
    });
  });
});

describe('TRIAL ATHLETE - Add note button', () => {
  const renderWithHiddenFilters = (hiddenFilters = [], additionalProps) =>
    renderWithUserEventSetup(
      wrapRenderWithPermissions(
        {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            notes: {
              canEdit: true,
              canCreate: true,
              canArchive: true,
            },
            issues: {
              canEdit: true,
            },
          },
        },
        <NotesFilters
          {...props}
          hiddenFilters={hiddenFilters || ['add_medical_file_button']}
          {...additionalProps}
        />
      )
    );

  it('does render the with the correct permissions', () => {
    renderWithHiddenFilters([]);
    expect(
      screen.getByRole('button', { name: 'Add note' })
    ).toBeInTheDocument();
  });

  it('does render the with the correct permissions (feature flag OFF fallback)', () => {
    window.featureFlags['pm-date-range-picker-custom'] = false;
    renderWithHiddenFilters([]);
    expect(
      screen.getByRole('button', { name: 'Add note' })
    ).toBeInTheDocument();
  });

  it('[TRACK-EVENT] - clickAddMedicalNote', async () => {
    const { user } = renderWithHiddenFilters([]);

    const addNoteButton = screen.getByRole('button', { name: 'Add note' });
    await user.click(addNoteButton);
    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.clickAddMedicalNote,
      {
        level: 'team',
        tab: tabHashes.OVERVIEW,
        actionElement: 'Add note button',
      }
    );
    expect(props.onClickAddMedicalNote).toHaveBeenCalledTimes(1);
  });

  it('does not render when hidden', () => {
    renderWithHiddenFilters(['add_medical_note_button']);

    expect(() => screen.getByRole('button', { name: 'Add note' })).toThrow();
  });

  it('does not render the archive button', () => {
    renderWithHiddenFilters([], {
      isAthleteOnTrial: true,
    });

    expect(screen.queryByText('View archive')).not.toBeInTheDocument();
  });

  it('renders the archive button the athlete not on trial', () => {
    renderWithHiddenFilters([], {
      isAthleteOnTrial: false,
    });

    expect(screen.getByText('View archive')).toBeInTheDocument();
  });
});

describe('[feature-flag] pm-date-range-picker-custom', () => {
  beforeEach(() => {
    if (!window.featureFlags) window.featureFlags = {};
    window.featureFlags['pm-date-range-picker-custom'] = true;
    const fakeDate = new Date('2025-06-10T18:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
  });

  afterEach(() => {
    window.featureFlags['pm-date-range-picker-custom'] = false;
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('calls onNotesFiltersChange when the user changes the date range', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const dateInputs = screen.getAllByPlaceholderText(
      'MM/DD/YYYY — MM/DD/YYYY'
    );
    expect(dateInputs).toHaveLength(2);
    await user.click(dateInputs[0]);

    const startDayInput = screen.getAllByRole('gridcell', { name: '10' })[0];
    await user.click(startDayInput);
    const endDayInput = screen.getAllByRole('gridcell', { name: '13' })[1];
    await user.click(endDayInput);

    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      date_range: { start_date: '2025-06-10', end_date: '2025-06-13' },
    });
  });
});

describe('When rehabNote Feature flag is on', () => {
  beforeEach(() => {
    window.featureFlags = window.featureFlags || {};
    window.featureFlags['rehab-note'] = true;
  });

  afterEach(() => {
    window.featureFlags['rehab-note'] = false;
  });

  it('calls onNotesFiltersChange with RehabSession note type when the user changes the note type dropdown', async () => {
    const { user } = renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[3]); // Open the select menu
    await user.click(screen.getByText('Medical')); // Select an option

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      organisation_annotation_type: [
        ...defaultOrganisationAnnotationTypes,
        'OrganisationAnnotationTypes::RehabSession',
      ],
      organisation_annotation_type_ids: [1],
    });
  });
});

describe('When display-telephone-note Feature flag is on', () => {
  beforeEach(() => {
    window.featureFlags = window.featureFlags || {};
    window.featureFlags['display-telephone-note'] = true;
  });

  afterEach(() => {
    window.featureFlags['display-telephone-note'] = false;
  });

  it('calls onNotesFiltersChange with Telephone note type when the user changes the note type dropdown', async () => {
    const { user } = renderWithUserEventSetup(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <NotesFilters {...props} />
      </LocalizationProvider>
    );

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[3]); // Open the select menu
    await user.click(screen.getByText('Medical')); // Select an option

    expect(props.onNotesFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      organisation_annotation_type: [
        ...defaultOrganisationAnnotationTypes,
        'OrganisationAnnotationTypes::Telephone',
      ],
      organisation_annotation_type_ids: [1],
    });
  });
});
