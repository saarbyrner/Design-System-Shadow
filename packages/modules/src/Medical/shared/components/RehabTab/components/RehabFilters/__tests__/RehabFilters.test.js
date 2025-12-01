import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';
import moment from 'moment-timezone';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { defaultRehabPermissions } from '@kitman/common/src/contexts/PermissionsContext/rehab';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import RehabFilters from '../index';
import TransferRecordContext from '../../../../../contexts/TransferRecordContext';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

// Uses the mocked version of component (in __mocks__ dir at component level)
jest.mock('@kitman/components/src/DatePicker');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalHistory: {},
  medicalApi: {
    useGetAthleteDataQuery: jest.fn(),
  },
});

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    useGetAthleteDataQuery: jest.fn(),
  })
);

describe('<RehabFilters />', () => {
  let renderTestComponent;
  beforeEach(() => {
    i18nextTranslateStub();
    moment.tz.setDefault('UTC');

    renderTestComponent = (props, additionalProps = {}) => {
      render(
        <TransferRecordContext.Provider
          value={{
            data_sharing_consent: true,
            joined_at: '2022-10-19T21:15:49.821Z',
            left_at: '2022-10-29T21:15:49.821Z',
            transfer_type: 'Trade',
          }}
        >
          <TestProviders store={store}>
            <PermissionsContext.Provider
              value={{
                permissions: {
                  ...DEFAULT_CONTEXT_VALUE.permissions,
                  rehab: {
                    ...defaultRehabPermissions,
                    canView: true,
                    canManage: true,
                  },
                },
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <RehabFilters
                {...props}
                {...additionalProps}
                dayMode="3_DAY"
                rehabDate={moment('2022-10-26T13:00:00Z')}
              />
            </PermissionsContext.Provider>
          </TestProviders>
        </TransferRecordContext.Provider>
      );
    };
  });
  afterEach(() => {
    moment.tz.setDefault();
  });

  const onClickAddButtonSpy = jest.fn();
  const onClickChangeDateRightSpy = jest.fn();
  const onClickChangeDateLeftSpy = jest.fn();
  const onSelectRehabDateSpy = jest.fn();
  const onSelectModeSpy = jest.fn();

  const props = {
    rehabMode: 'DEFAULT',
    onClickAddRehab: onClickAddButtonSpy,
    onSelectMode: onSelectModeSpy,
    onSelectRehabDate: onSelectRehabDateSpy,
    onChangeDateRight: onClickChangeDateRightSpy,
    onChangeDateLeft: onClickChangeDateLeftSpy,
    t: i18nextTranslateStub(),
  };

  it('displays the add button if have manage permission content', async () => {
    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            rehab: {
              ...defaultRehabPermissions,
              canView: true,
              canManage: true,
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <RehabFilters
          {...props}
          dayMode="3_DAY"
          rehabDate={moment('2022-10-27T13:00:00Z')}
        />
      </PermissionsContext.Provider>
    );

    let addButton;
    await waitFor(() => {
      addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent('Add');
    });

    await userEvent.click(addButton);
    expect(props.onClickAddRehab).toHaveBeenCalled();
  });

  it('displays the arrow buttons and shows correct date selected and mode', async () => {
    renderTestComponent(props, { athleteId: 1 });

    let addButton;
    let changeDateButtons;
    let leftButton;
    let rightButton;
    await waitFor(() => {
      addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeInTheDocument();

      changeDateButtons = within(
        screen.getByTestId('RehabFilters|ChangeDate')
      ).getAllByRole('button');

      leftButton = changeDateButtons[0];
      rightButton = changeDateButtons[1];
      expect(leftButton).toBeInTheDocument();
      expect(rightButton).toBeInTheDocument();

      // Shows correct date
      expect(
        screen.getByDisplayValue('Wed Oct 26 2022 13:00:00 GMT+0000')
      ).toBeInTheDocument();
      expect(screen.getByText('3 day')).toBeInTheDocument();
      expect(screen.queryByText('5 day')).not.toBeInTheDocument();
      expect(screen.queryByText('7 day')).not.toBeInTheDocument();
    });

    const selectModeContainer = screen.getByTestId(
      'RehabFilters|DayModeSelect'
    );
    selectEvent.openMenu(
      selectModeContainer.querySelector('.kitmanReactSelect input')
    );

    expect(screen.getByText('5 day')).toBeInTheDocument();
    expect(screen.getByText('7 day')).toBeInTheDocument();

    // ADD BUTTON
    await userEvent.click(addButton);
    expect(props.onClickAddRehab).toHaveBeenCalled();

    // LEFT BUTTON
    await userEvent.click(leftButton);
    expect(props.onChangeDateLeft).toHaveBeenCalled();

    // RIGHT BUTTON
    await userEvent.click(rightButton);
    expect(props.onChangeDateRight).toHaveBeenCalled();
  });

  it('disables next day arrow button based on transfer record', async () => {
    render(
      <TransferRecordContext.Provider
        value={{
          data_sharing_consent: true,
          joined_at: '2022-10-19T21:15:49.821Z',
          left_at: '2022-10-25T21:15:49.821Z',
          transfer_type: 'Trade',
        }}
      >
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters
            {...props}
            dayMode="3_DAY"
            rehabDate={moment('2022-10-26T13:00:00Z')}
          />
        </PermissionsContext.Provider>
      </TransferRecordContext.Provider>
    );

    let changeDateButtons;
    let leftButton;
    let rightButton;

    await waitFor(() => {
      changeDateButtons = within(
        screen.getByTestId('RehabFilters|ChangeDate')
      ).getAllByRole('button');

      leftButton = changeDateButtons[0];
      rightButton = changeDateButtons[1];
      expect(leftButton).toBeInTheDocument();
      expect(rightButton).toBeInTheDocument();

      expect(leftButton).toBeEnabled();
      expect(rightButton).toBeDisabled();

      // Shows correct date
      expect(
        screen.getByDisplayValue('Wed Oct 26 2022 13:00:00 GMT+0000')
      ).toBeInTheDocument();
    });
  });

  it('does not display the add button if do not have manage permission', async () => {
    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            rehab: {
              ...defaultRehabPermissions,
              canView: true,
              canManage: false,
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <RehabFilters
          {...props}
          dayMode="3_DAY"
          rehabDate={moment('2022-10-26T13:00:00Z')}
        />
      </PermissionsContext.Provider>
    );
    // check that button is not present
    expect(
      screen.queryByTestId('RehabFilters|RehabOptions')
    ).not.toBeInTheDocument();
  });

  it('responds to changing mode', async () => {
    render(
      <PermissionsContext.Provider
        value={{
          permissions: {
            ...DEFAULT_CONTEXT_VALUE.permissions,
            rehab: {
              ...defaultRehabPermissions,
              canView: true,
              canManage: true,
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <RehabFilters
          {...props}
          dayMode="5_DAY"
          rehabDate={moment('2022-10-26T13:00:00Z')}
        />
      </PermissionsContext.Provider>
    );

    const selectModeContainer = await screen.findByTestId(
      'RehabFilters|DayModeSelect'
    );
    expect(selectModeContainer).toBeInTheDocument();

    selectEvent.openMenu(
      selectModeContainer.querySelector('.kitmanReactSelect input')
    );
    expect(screen.getByText('7 day')).toBeInTheDocument();
    fireEvent.click(screen.getByText('7 day'));

    expect(props.onSelectMode).toHaveBeenCalledWith('7_DAY');
  });

  describe('testing rehab-link-to-injury permission', () => {
    beforeEach(() => {
      window.featureFlags['rehab-link-to-injury'] = true;
    });
    afterEach(() => {
      window.featureFlags['rehab-link-to-injury'] = false;
    });
    it('only displays link to button rehab-link-to-injury permission is true', async () => {
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters
            {...props}
            inMaintenance
            dayMode="5_DAY"
            rehabDate={moment('2022-10-26T13:00:00Z')}
          />
        </PermissionsContext.Provider>
      );

      const copyToButton = screen.getByRole('button', { name: 'Link to' });
      expect(copyToButton).toBeInTheDocument();
    });

    it('does not display link to button when rehab-link-to-injury permission is false', async () => {
      window.featureFlags['rehab-link-to-injury'] = false;
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters
            {...props}
            dayMode="5_DAY"
            rehabDate={moment('2022-10-26T13:00:00Z')}
          />
        </PermissionsContext.Provider>
      );

      expect(() => screen.getByRole('button', { name: 'Link to' })).toThrow();
    });

    it('does not display link to button when rehab-link-to-injury permission is true and not in Maintenance', async () => {
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters
            {...props}
            isMaintenance={false}
            dayMode="5_DAY"
            rehabDate={moment('2022-10-26T13:00:00Z')}
          />
        </PermissionsContext.Provider>
      );

      expect(() => screen.getByRole('button', { name: 'Link to' })).toThrow();
    });

    it('Displays the close button when the user is in the link to mode', async () => {
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters
            {...props}
            isMaintenance
            dayMode="5_DAY"
            rehabMode="LINK_TO_MODE"
            rehabDate={moment('2022-10-26T13:00:00Z')}
          />
        </PermissionsContext.Provider>
      );

      const doneButton = screen.getByRole('button', { name: 'Done' });
      expect(doneButton).toBeInTheDocument();
    });

    it('Displays the print button when FF on and dayMode selected', async () => {
      window.featureFlags = {
        'rehab-print-single': true,
      };

      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters {...props} dayMode="5_DAY" />
        </PermissionsContext.Provider>
      );

      userEvent.click(screen.getByTestId('RehabFilters|BurgerMenu'));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Print' })
        ).toBeInTheDocument();
      });

      window.featureFlags = {};
    });

    it('Displays the show notes button when FF on and canViewNotes set to true', async () => {
      window.featureFlags = {
        'rehab-note': true,
      };
      const onToggleViewNotesSpy = jest.fn();
      const notesProps = {
        ...props,
        canViewNotes: true,
        viewNotesToggledOn: true,
        onToggleViewNotes: onToggleViewNotesSpy,
      };
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters {...notesProps} />
        </PermissionsContext.Provider>
      );
      const burgerMenu = screen.getByTestId('RehabFilters|BurgerMenu');
      userEvent.click(burgerMenu);
      let notesButton;

      await waitFor(() => {
        notesButton = screen.getByRole('button', { name: 'Hide Notes' });
      });
      expect(notesButton).toBeInTheDocument();
      await userEvent.click(notesButton);
      expect(notesProps.onToggleViewNotes).toHaveBeenCalled();
      window.featureFlags = {};
    });

    it('Displays hides the close button when the user is in the link to mode and an item is clicked', async () => {
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters
            {...props}
            isMaintenance
            dayMode="5_DAY"
            rehabMode="LINK_TO_MODE"
            sidePanelIsOpen
            rehabDate={moment('2022-10-26T13:00:00Z')}
          />
        </PermissionsContext.Provider>
      );

      expect(() => screen.getByRole('button', { name: 'Close' })).toThrow();
    });
  });

  describe('TRIAL ATHLETE - Add Rehab and Copy button', () => {
    const renderWithHiddenFilters = (hiddenFilters = []) => {
      render(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              rehab: {
                ...defaultRehabPermissions,
                canView: true,
                canManage: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <RehabFilters {...props} hiddenFilters={hiddenFilters} />
        </PermissionsContext.Provider>
      );
    };

    it('does render by default', async () => {
      renderWithHiddenFilters([]);
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    });
    it('does not render when hidden', async () => {
      renderWithHiddenFilters(['add_rehab_button']);

      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Copy' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Feature flag: player-movement-entity-rehab-and-maintenance ON', () => {
    beforeEach(() => {
      i18nextTranslateStub();
      moment.tz.setDefault('UTC');
      useGetAthleteDataQuery.mockReturnValue({ data: mockedPastAthlete });

      window.featureFlags[
        'player-movement-entity-rehab-and-maintenance'
      ] = true;
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags[
        'player-movement-entity-rehab-and-maintenance'
      ] = false;
    });

    it('restricts the min date range on the DatePicker to align with athletes duration in the club', async () => {
      renderTestComponent(props, { athleteId: 1 });

      expect(screen.getByTestId('minimum-date')).toHaveTextContent(
        'Wed Oct 19 2022 21:15:49 GMT+0000'
      );
    });

    // Persist existing behaviour
    it('restricts the max date range on the DatePicker to align with athletes duration in the club', async () => {
      renderTestComponent(props, { athleteId: 1 });

      expect(screen.getByTestId('maximum-date')).toHaveTextContent(
        'Sat Oct 29 2022 21:15:49 GMT+0000'
      );
    });
  });

  describe('Feature flag: player-movement-entity-rehab-and-maintenance OFF', () => {
    beforeEach(() => {
      i18nextTranslateStub();
      moment.tz.setDefault('UTC');
      useGetAthleteDataQuery.mockReturnValue({ data: mockedPastAthlete });

      window.featureFlags[
        'player-movement-entity-rehab-and-maintenance'
      ] = false;
    });

    afterEach(() => {
      moment.tz.setDefault();
    });

    it('does NOT restrict the min date range on the DatePicker to align with athletes duration in the club', async () => {
      renderTestComponent(props, { athleteId: 1 });

      expect(screen.queryByTestId('minimum-date')).not.toBeInTheDocument(); // DatePicker mock does not render this element when no value present
    });

    // Persist existing behaviour
    it('restricts the max date range on the DatePicker to align with athletes duration in the club', async () => {
      renderTestComponent(props, { athleteId: 1 });

      expect(screen.getByTestId('maximum-date')).toHaveTextContent(
        'Sat Oct 29 2022 21:15:49 GMT+0000'
      );
    });
  });
});
