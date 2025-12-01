import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { organisationAssociations } from '@kitman/common/src/variables';
import { saveProcedure } from '@kitman/services';
import * as useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import AddProcedureSidePanel from '..';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  saveProcedure: jest.fn(),
}));

const mockUseEnrichedAthletesIssues = {
  ...jest.requireActual('../../../hooks/useEnrichedAthletesIssues'),
  enrichedAthleteIssues: [],
  fetchAthleteIssues: jest.fn().mockResolvedValue(),
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {
    useGetAthleteDataQuery: jest.fn(),
  },
  medicalSharedApi: {},
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
  },
});

// Tests to be extended on as Procedure Side Panel elements are added
describe('<AddProcedureSidePanel />', () => {
  const props = {
    isOpen: true,
    onClose: jest.fn(),
    squadAthletes: [
      {
        label: 'Newcastle United',
        options: [
          {
            value: 4,
            label: 'Sven Botman',
          },
          {
            value: 1,
            label: 'John Doe',
          },
        ],
      },
      {
        label: 'Squad B Name',
        options: [
          {
            value: 3,
            label: 'Athlete 1 Name',
          },
          {
            value: 4,
            label: 'Athlete 3 Name',
          },
        ],
      },
    ],
    proceduresFormData: {
      procedure_reasons: [
        {
          id: 3,
          name: 'Dehydration',
          issue_required: false,
          intravenous: true,
        },
        {
          id: 2,
          name: 'Dental work',
          issue_required: true,
          intravenous: false,
        },
        {
          id: 1,
          name: 'Injury/Illness',
          issue_required: true,
          intravenous: false,
        },
        {
          id: 4,
          name: 'Muscle cramping',
          issue_required: true,
          intravenous: true,
        },
        {
          id: 5,
          name: 'Reason without issue needed',
          issue_required: false,
          intravenous: false,
        },
        {
          id: 6,
          name: 'Intravenous without issue needed',
          issue_required: false,
          intravenous: true,
        },
      ],
      locations: [
        {
          id: 26,
          name: 'Metlife Stadium',
          type_of: {
            value: 3,
            name: 'procedure',
          },
          organisation_id: 6,
        },
        {
          id: 27,
          name: 'Mount Sinai',
          type_of: {
            value: 3,
            name: 'procedure',
          },
          organisation_id: 6,
        },
      ],
      procedure_complications: [
        {
          id: 3,
          name: 'Infection',
          intravenous: false,
        },
        {
          id: 2,
          name: 'Insufficient IV Stuff',
          intravenous: true,
        },
        {
          id: 1,
          name: 'IV Related Complication',
          intravenous: true,
        },
        {
          id: 4,
          name: 'Reaction to Anaesthesia',
          intravenous: false,
        },
      ],
      procedure_timings: [
        {
          key: 'pre_game',
          name: 'Pre-game',
        },
        {
          key: 'during_game',
          name: 'During game',
        },
        {
          key: 'post_game',
          name: 'Post-game',
        },
        {
          key: 'pre_practice',
          name: 'Pre-practice',
        },
        {
          key: 'during_practice',
          name: 'During practice',
        },
        {
          key: 'post_practice',
          name: 'Post-practice',
        },
        {
          key: 'other',
          name: 'Other',
        },
      ],
    },
    bodyAreas: [
      { id: 231, name: 'knee thing' },
      { id: 5436, name: 'part of body' },
    ],
    orderProviders: {
      staff_providers: [{ sgid: 1, fullname: 'Some staff provider' }],
      location_providers: [],
    },
    locationId: 26,
    t: i18nextTranslateStub(),
  };

  describe('[feature-flag] medical-procedure flag is on', () => {
    beforeEach(() => {
      jest.spyOn(useEnrichedAthletesIssues, 'default').mockReturnValue({
        ...mockUseEnrichedAthletesIssues,
        enrichedAthleteIssues: [
          {
            label: 'Open injury/ illness',
            options: [
              {
                value: 'Injury_1',
                label: '30 Oct 2023 - test',
              },
            ],
          },
        ],
      });
      window.getFlag('medical-procedure', true);
      useGetOrganisationQuery.mockReturnValue({
        data: {
          association_name: organisationAssociations.nfl,
        },
      });
    });

    afterEach(() => {
      window.getFlag('medical-procedure', false);
    });

    it('renders the default form', async () => {
      render(
        <Provider store={store}>
          <AddProcedureSidePanel {...props} />
        </Provider>
      );
      expect(await screen.findByText('Add procedure')).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|Parent')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|Athlete')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|ProcedureOrderDate')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|Provider')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|Procedure')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|ProcedureDescription')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|ProcedureReason')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|Complications')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|BodyArea')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|AssociatedIssues')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|NoteInput')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|Attachments')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddProcedureSidePanel|ProcedureDate')
      ).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');

      const closeIcon = buttons[0];
      expect(closeIcon).toBeInTheDocument();
    });

    it('displays the copyright text when organisation is NFL', async () => {
      render(
        <Provider store={store}>
          <AddProcedureSidePanel {...props} />
        </Provider>
      );
      expect(await screen.findByText('Add procedure')).toBeInTheDocument();
      expect(
        screen.getByText(/American Medical Association/)
      ).toBeInTheDocument();
    });

    it('does not display the copyright text when organisation is not NFL', async () => {
      useGetOrganisationQuery.mockReturnValue({
        data: {
          association_name: 'Some Other League',
        },
      });

      render(
        <Provider store={store}>
          <AddProcedureSidePanel {...props} />
        </Provider>
      );
      expect(await screen.findByText('Add procedure')).toBeInTheDocument();
      expect(
        screen.queryByText(/American Medical Association/)
      ).not.toBeInTheDocument();
    });

    describe('button interactions', () => {
      it('calls onClose when userEvent clicks the close icon', async () => {
        render(
          <Provider store={store}>
            <AddProcedureSidePanel {...props} />
          </Provider>
        );
        expect(await screen.findByText('Add procedure')).toBeInTheDocument();
        const buttons = screen.getAllByRole('button');

        await userEvent.click(buttons[0]);
        expect(props.onClose).toHaveBeenCalled();
      });
    });

    describe('save procedure validation', () => {
      beforeEach(() => {
        saveProcedure.mockResolvedValue([{}]); // Mock successful save
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('calls saveProcedure when all required fields are present', async () => {
        const user = userEvent.setup();
        render(
          <Provider store={store}>
            <AddProcedureSidePanel {...props} />
          </Provider>
        );

        expect(await screen.findByText('Add procedure')).toBeInTheDocument();

        const playerMenu = screen.getByLabelText('Player');
        selectEvent.openMenu(playerMenu);

        // This await user.click does not result in effects needing act wrapping
        // But using await selectEvent.select will
        await user.click(screen.getByText('Sven Botman'));

        const procedureOrderDatePicker = screen.getByLabelText(
          'Procedure order date'
        );

        fireEvent.change(procedureOrderDatePicker, {
          target: { value: '28 Oct, 2020' }, // Just some value to satisfy on null validation
        });

        const procedureAppointmentDatePicker =
          screen.getByLabelText(/Procedure appt. date/);
        fireEvent.change(procedureAppointmentDatePicker, {
          target: { value: '29 Oct, 2020' }, // Just some value to satisfy on null validation
        });

        const providerMenu = screen.getByLabelText('Provider');
        selectEvent.openMenu(providerMenu);
        await selectEvent.select(providerMenu, 'Some staff provider');

        const procedureMenu = screen.getByLabelText('Procedure type');
        selectEvent.openMenu(procedureMenu);
        await user.click(screen.getByText('Non Intravenous procedure'));

        const reasonMenu = screen.getByLabelText('Reason');
        selectEvent.openMenu(reasonMenu);
        await selectEvent.select(reasonMenu, 'Reason without issue needed'); // No issue required

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(saveProcedure).toHaveBeenCalledTimes(1);
        });
      });

      it('does call saveProcedure for intravenous type if timing value present', async () => {
        const user = userEvent.setup();
        render(
          <Provider store={store}>
            <AddProcedureSidePanel {...props} />
          </Provider>
        );

        expect(await screen.findByText('Add procedure')).toBeInTheDocument();

        const playerMenu = screen.getByLabelText('Player');
        selectEvent.openMenu(playerMenu);

        // This await user.click does not result in effects needing act wrapping
        // But using await selectEvent.select will
        await user.click(screen.getByText('Sven Botman'));

        const procedureOrderDatePicker = screen.getByLabelText(
          'Procedure order date'
        );
        fireEvent.change(procedureOrderDatePicker, {
          target: { value: '28 Oct, 2020' }, // Just some value to satisfy on null validation
        });

        const procedureAppointmentDatePicker =
          screen.getByLabelText(/Procedure appt. date/);
        fireEvent.change(procedureAppointmentDatePicker, {
          target: { value: '29 Oct, 2020' }, // Just some value to satisfy on null validation
        });

        const providerMenu = screen.getByLabelText('Provider');
        selectEvent.openMenu(providerMenu);
        await selectEvent.select(providerMenu, 'Some staff provider');

        const procedureMenu = screen.getByLabelText('Procedure type');
        selectEvent.openMenu(procedureMenu);
        await user.click(screen.getByText('Intravenous procedure'));

        const reasonMenu = screen.getByLabelText('Reason');
        selectEvent.openMenu(reasonMenu);
        await selectEvent.select(
          reasonMenu,
          'Intravenous without issue needed'
        ); // No issue required

        const timingMenu = screen.getByLabelText('Timing');
        selectEvent.openMenu(timingMenu);
        await selectEvent.select(timingMenu, 'Pre-game');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(saveProcedure).toHaveBeenCalledTimes(1);
        });
      });

      it('does not call saveProcedure for intravenous type if timing value not present', async () => {
        const user = userEvent.setup();
        render(
          <Provider store={store}>
            <AddProcedureSidePanel {...props} />
          </Provider>
        );

        expect(await screen.findByText('Add procedure')).toBeInTheDocument();

        const playerMenu = screen.getByLabelText('Player');
        selectEvent.openMenu(playerMenu);

        // This await user.click does not result in effects needing act wrapping
        // But using await selectEvent.select will
        await user.click(screen.getByText('Sven Botman'));

        const procedureOrderDatePicker = screen.getByLabelText(
          'Procedure order date'
        );
        fireEvent.change(procedureOrderDatePicker, {
          target: { value: '28 Oct, 2020' }, // Just some value to satisfy on null validation
        });

        const procedureAppointmentDatePicker =
          screen.getByLabelText(/Procedure appt. date/);
        fireEvent.change(procedureAppointmentDatePicker, {
          target: { value: '29 Oct, 2020' }, // Just some value to satisfy on null validation
        });

        const providerMenu = screen.getByLabelText('Provider');
        selectEvent.openMenu(providerMenu);
        await selectEvent.select(providerMenu, 'Some staff provider');

        const procedureMenu = screen.getByLabelText('Procedure type');
        selectEvent.openMenu(procedureMenu);
        await user.click(screen.getByText('Intravenous procedure'));

        const reasonMenu = screen.getByLabelText('Reason');
        selectEvent.openMenu(reasonMenu);
        await selectEvent.select(
          reasonMenu,
          'Intravenous without issue needed'
        ); // No issue required

        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
          expect(saveProcedure).not.toHaveBeenCalled();
        });
      });
    });

    describe('non-IV flow', () => {
      it('finds athlete', async () => {
        render(
          <Provider store={store}>
            <AddProcedureSidePanel {...props} />
          </Provider>
        );
        expect(await screen.findByText('Add procedure')).toBeInTheDocument();
        const athleteSelect = screen.getByTestId(
          'AddProcedureSidePanel|Athlete'
        );

        selectEvent.openMenu(
          athleteSelect.querySelector('.kitmanReactSelect input')
        );

        expect(screen.getByText('Newcastle United')).toBeInTheDocument();
        expect(screen.getByText('Sven Botman')).toBeInTheDocument();
      });
    });

    describe('when viewing a past athlete', () => {
      it('has the correct athlete preloaded in the select component', async () => {
        render(
          <Provider store={store}>
            <AddProcedureSidePanel {...props} athleteId={1} />
          </Provider>
        );
        expect(await screen.findByText('Add procedure')).toBeInTheDocument();
        expect(await screen.findByText('John Doe')).toBeInTheDocument();
      });
    });

    it('calls fetchAthleteIssues with the correct parameters when the athlete is changed', async () => {
      const user = userEvent.setup();
      render(
        <Provider store={store}>
          <AddProcedureSidePanel {...props} />
        </Provider>
      );

      expect(await screen.findByText('Add procedure')).toBeInTheDocument();

      const playerMenu = screen.getByLabelText('Player');
      selectEvent.openMenu(playerMenu);

      await user.click(screen.getByText('Sven Botman'));

      expect(
        mockUseEnrichedAthletesIssues.fetchAthleteIssues
      ).toHaveBeenCalledWith({
        selectedAthleteId: 4,
        useOccurrenceIdValue: true,
        includeDetailedIssue: false,
        issueFilter: null,
        includeIssue: true,
        includeGrouped: true,
      });
    });
  });
});
