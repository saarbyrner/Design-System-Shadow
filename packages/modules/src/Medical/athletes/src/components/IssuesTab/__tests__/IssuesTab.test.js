import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { data as mockAthleteIssues } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { data as mockedAthleteIssueStatuses } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssueStatuses';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import {
  useGetAthleteDataQuery,
  useLazyGetAthleteDataQuery,
  useGetDocumentNoteCategoriesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';

import IssuesTab from '..';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');

const {
  openIssues: mockedOpenIssues,
  closedIssues: mockedClosedIssues,
  chronicIssues: mockedChronicIssues,
  groupedChronicIssues: mockedGroupedChronicIssues,
} = mockAthleteIssues;

const store = storeFake({
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addIssuePanel: getDefaultAddIssuePanelStore(),
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addTreatmentsSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addVaccinationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addAllergySidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicalAlertSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
      isAthleteSelectable: true,
    },
  },
  addConcussionTestResultsSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
      isAthleteSelectable: true,
    },
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  toasts: [],
  medicalApi: {},
  medicalSharedApi: {
    useGetAthleteDataQuery: jest.fn(),
    useLazyGetAthleteDataQuery: jest.fn(),
  },
  medicalHistory: {},
  globalApi: {},
});

describe('<IssuesTab />', () => {
  const props = {
    athleteId: mockAthleteData.id,
    permissions: DEFAULT_CONTEXT_VALUE.permissions,
    hiddenFilters: [],
  };

  beforeEach(() => {
    useGetAthleteDataQuery.mockReturnValue({
      data: mockAthleteData,
      error: false,
      isLoading: false,
    });
    useLazyGetAthleteDataQuery.mockReturnValue([
      jest.fn(),
      {
        data: {},
        isFetching: false,
      },
    ]);
    useGetDocumentNoteCategoriesQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
  });

  describe('when the initial request is pending', () => {
    it('initially renders a loader initially when getAthleteIssues is pending', async () => {
      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      // This would fail if not initially present
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      expect(
        screen.queryByTestId('DelayedLoadingFeedback')
      ).not.toBeInTheDocument();
    });
  });

  describe('when the initial request is successful', () => {
    it('renders the correct content', async () => {
      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      // This would fail if not initially present
      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const issuesHeader = screen.getByRole('heading', {
        level: 3,
        name: 'Injury/ Illness',
      });
      expect(issuesHeader).toBeVisible();

      const openIssuesHeader = screen.getByRole('heading', {
        level: 3,
        name: 'Open injury/ illness',
      });
      expect(openIssuesHeader).toBeVisible();

      const priorIssuesHeader = screen.getByRole('heading', {
        level: 3,
        name: 'Prior injury/illness',
      });
      expect(priorIssuesHeader).toBeVisible();
    });

    it('renders the AddConcussionTestResultsSidePanel container', async () => {
      window.setFlag('pm-show-tue', true);
      render(
        <Provider store={store}>
          <IssuesTab
            {...props}
            permissions={{
              medical: {
                notes: {
                  canCreate: false,
                },
                documents: {
                  canCreate: false,
                },
              },
              general: {
                ancillaryRange: { canManage: false },
              },
              concussion: {
                canManageConcussionAssessments: true,
                canManageNpcAssessments: true,
              },
            }}
          />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const expectedTitles = [
        'Filters',
        'Add diagnostic',
        'Add injury/ illness',
        'Add medical note',
        'Add modification',
        'Add allergy',
        'Add medical alert',
        'Add procedure',
        'Add vaccination',
        'Add near point of convergence (NPC) results',
        'Add treatment',
        'Add TUE',
      ];
      const sidePanelsTitles = screen.getAllByTestId('sliding-panel|title');

      expect(sidePanelsTitles).toHaveLength(expectedTitles.length);

      expectedTitles.forEach((title, index) => {
        expect(sidePanelsTitles[index]).toHaveTextContent(title);
      });
    });

    describe('[feature-flag] pm-show-tue', () => {
      it('does not render the Add TUE side panel when the flag is off', async () => {
        window.setFlag('pm-show-tue', false);
        render(
          <Provider store={store}>
            <IssuesTab
              {...props}
              permissions={{
                medical: {
                  notes: {
                    canCreate: false,
                  },
                  documents: {
                    canCreate: false,
                  },
                  tue: {
                    canCreate: true,
                  },
                },
                general: {
                  ancillaryRange: { canManage: false },
                },
                concussion: {
                  canManageConcussionAssessments: false,
                  canManageNpcAssessments: false,
                },
              }}
            />
          </Provider>
        );

        await waitForElementToBeRemoved(
          screen.queryByTestId('DelayedLoadingFeedback')
        );

        expect(screen.queryByText('Add TUE')).not.toBeInTheDocument();
      });

      it('renders the Add TUE side panel when the flag is on', async () => {
        window.setFlag('pm-show-tue', true);
        render(
          <Provider store={store}>
            <IssuesTab
              {...props}
              permissions={{
                medical: {
                  notes: {
                    canCreate: false,
                  },
                  documents: {
                    canCreate: false,
                  },
                  tue: {
                    canCreate: true,
                  },
                },
                general: {
                  ancillaryRange: { canManage: false },
                },
                concussion: {
                  canManageConcussionAssessments: false,
                  canManageNpcAssessments: false,
                },
              }}
            />
          </Provider>
        );

        await waitForElementToBeRemoved(
          screen.queryByTestId('DelayedLoadingFeedback')
        );

        expect(screen.getByText('Add TUE')).toBeInTheDocument();
      });
    });

    it('does not render the AddConcussionTestResultsSidePanel container without permissions', async () => {
      render(
        <Provider store={store}>
          <IssuesTab
            {...props}
            permissions={{
              medical: {
                notes: {
                  canCreate: false,
                },
                documents: {
                  canCreate: false,
                },
              },
              concussion: {},
            }}
          />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      expect(
        screen.queryByText('Add near point of convergence (NPC) results')
      ).not.toBeInTheDocument();
    });

    it('renders the AddMedicalDocumentSidePanel container', async () => {
      window.setFlag('pm-show-tue', true);
      render(
        <Provider store={store}>
          <IssuesTab
            {...props}
            permissions={{
              medical: {
                notes: {
                  canCreate: false,
                },
                documents: {
                  canCreate: true,
                },
              },
              concussion: {
                canManageConcussionAssessments: false,
                canManageNpcAssessments: false,
              },
            }}
          />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const expectedTitles = [
        'Filters',
        'Add diagnostic',
        'Add injury/ illness',
        'Add medical note',
        'Add modification',
        'Add allergy',
        'Add medical alert',
        'Add procedure',
        'Add vaccination',
        'Add treatment',
        'Add TUE',
        'Add documents', // AddMedicalDocumentSidePanel|Parent
        'Add documents', // AddMedicalFileSidePanel|Parent
      ];
      const sidePanelsTitles = screen.getAllByTestId('sliding-panel|title');

      expect(sidePanelsTitles).toHaveLength(expectedTitles.length);

      expectedTitles.forEach((title, index) => {
        expect(sidePanelsTitles[index]).toHaveTextContent(title);
      });

      expect(
        screen.getByTestId('AddMedicalDocumentSidePanel|Parent')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('AddMedicalFileSidePanel|Parent')
      ).toBeInTheDocument();
    });

    it('does not render the AddMedicalDocumentSidePanel container without permissions', async () => {
      render(
        <Provider store={store}>
          <IssuesTab
            {...props}
            permissions={{
              medical: {
                notes: {
                  canCreate: false,
                },
                documents: {
                  canCreate: false,
                },
              },
              concussion: {
                canManageConcussionAssessments: false,
                canManageNpcAssessments: false,
              },
            }}
          />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      expect(
        screen.queryByTestId('AddMedicalDocumentSidePanel|Parent')
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('AddMedicalFileSidePanel|Parent')
      ).not.toBeInTheDocument();
    });

    it('populates the status filter with the correct options', async () => {
      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const statusFilterLabel = screen.getByLabelText('Status');
      expect(statusFilterLabel).toBeInTheDocument();

      const statusFilters = screen.getAllByText('Status', {
        class: 'kitmanReactSelect__placeholder',
      });
      expect(statusFilters).toHaveLength(4);
      selectEvent.openMenu(statusFilters[0]);

      mockedAthleteIssueStatuses.forEach((status) => {
        expect(screen.getByTitle(status.description)).toBeInTheDocument();
      });
    });

    it('populates the open and closed issues tables with the correct data', async () => {
      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const openTitle = screen.getByRole('heading', {
        level: 3,
        name: 'Open injury/ illness',
      });
      expect(openTitle).toBeInTheDocument();

      const tables = screen.getAllByRole('table');
      expect(tables).toHaveLength(2);
      expect(
        within(tables[0]).getByText(mockedOpenIssues.issues[0].full_pathology)
      ).toBeInTheDocument();

      const priorTitle = screen.getByRole('heading', {
        level: 3,
        name: 'Prior injury/illness',
      });
      expect(priorTitle).toBeInTheDocument();
      expect(
        within(tables[1]).getByText(mockedClosedIssues.issues[0].full_pathology)
      ).toBeInTheDocument();
    });

    describe('ChronicIssuesTable', () => {
      beforeEach(() => {
        window.featureFlags['chronic-injury-illness'] = true;
      });
      it('populates the chronic issues table with the correct data', async () => {
        render(
          <Provider store={store}>
            <IssuesTab {...props} />
          </Provider>
        );

        await waitForElementToBeRemoved(
          screen.queryByTestId('DelayedLoadingFeedback')
        );

        const chronicTableTitle = screen.getByRole('heading', {
          level: 3,
          name: 'Chronic conditions',
        });
        expect(chronicTableTitle).toBeInTheDocument();

        const tables = screen.getAllByRole('table');
        expect(tables).toHaveLength(3);
        expect(
          within(tables[1]).getByRole('link', {
            name: mockedChronicIssues[0].title,
          })
        ).toBeInTheDocument();
      });

      it('populates the chronic issues table with the correct data when grouped_response = true', async () => {
        window.featureFlags['chronic-injury-illness'] = true;
        window.featureFlags['chronic-conditions-resolution'] = true;

        render(
          <Provider store={store}>
            <IssuesTab {...props} />
          </Provider>
        );

        await waitForElementToBeRemoved(
          screen.queryByTestId('DelayedLoadingFeedback')
        );

        const chronicTableTitle = screen.getByRole('heading', {
          level: 3,
          name: 'Chronic conditions',
        });
        expect(chronicTableTitle).toBeInTheDocument();

        const closedChronicTableTitle = screen.getByRole('heading', {
          level: 3,
          name: 'Prior Chronic Conditions',
        });
        expect(closedChronicTableTitle).toBeInTheDocument();

        const tables = screen.getAllByRole('table');
        expect(tables).toHaveLength(4);

        expect(
          within(tables[1]).getByRole('link', {
            name: mockedGroupedChronicIssues.active_chronic_issues[0].title,
          })
        ).toBeInTheDocument();

        expect(
          within(tables[3]).getByRole('link', {
            name: mockedGroupedChronicIssues.resolved_chronic_issues[0].title,
          })
        ).toBeInTheDocument();
      });
    });

    describe('when applying filters', () => {
      let user;

      beforeEach(() => {
        jest.useFakeTimers();
        user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      });

      afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });

      it('populates the tables with filtered issues correct data', async () => {
        render(
          <Provider store={store}>
            <IssuesTab {...props} />
          </Provider>
        );

        await waitForElementToBeRemoved(
          screen.queryByTestId('DelayedLoadingFeedback')
        );

        const typeFilters = screen.getAllByLabelText('Type');
        expect(typeFilters).toHaveLength(2);

        selectEvent.openMenu(typeFilters[0]);
        const option = screen.getByText('New injury');
        await user.click(option);

        const openConcussionIssue = screen.getByText('Acute Concussion [N/A]');
        expect(openConcussionIssue).toBeInTheDocument();
        const openAsthmaIssue = screen.getByText('Asthma and/or allergy');
        expect(openAsthmaIssue).toBeInTheDocument();

        const searchFields = screen.getAllByPlaceholderText('Search');

        fireEvent.change(searchFields[0], { target: { value: 'Asthma' } });
        jest.advanceTimersByTime(250); // Debounce search
        await waitForElementToBeRemoved(
          screen.queryByText('Acute Concussion [N/A]') // Filtered away
        );

        const filteredToAsthmaIssue = screen.getByText('Asthma and/or allergy');
        expect(filteredToAsthmaIssue).toBeInTheDocument();

        const tables = screen.getAllByRole('table');

        const openTable = tables[0];
        expect(
          within(openTable).getByText('Asthma and/or allergy')
        ).toBeInTheDocument();
        expect(
          within(openTable).getByRole('link', {
            name: 'Asthma and/or allergy',
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe('when requests fail', () => {
    beforeEach(() => {
      server.use(
        rest.get('/ui/medical/issues/injury_statuses', (req, res, ctx) => {
          return res(ctx.status(500));
        }),
        rest.get(
          '/ui/medical/athletes/:athleteId/issue_occurrences',
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );
    });

    it('shows an error message', async () => {
      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const errorScreen = await screen.findByTestId('AppStatus-error');

      expect(errorScreen).toBeInTheDocument();
    });
  });

  describe('[feature-flag] pm-date-range-picker-custom', () => {
    let requests = [];

    beforeEach(() => {
      server.use(
        rest.get(
          '/ui/medical/athletes/:athleteId/issue_occurrences',
          (req, res, ctx) => {
            const sp = req.url.searchParams;
            const issueStatus = sp.get('issue_status');
            const start = sp.get('occurrence_date_range[start_date]');
            const end = sp.get('occurrence_date_range[end_date]');
            requests.push({ issueStatus, start, end });
            return res(
              ctx.json({
                meta: { next_page: null },
                issues: [],
              })
            );
          }
        )
      );
    });

    afterEach(() => {
      requests = [];
    });

    it('includes occurrence_date_range params in all requests by default when flag is off', async () => {
      window.setFlag('pm-date-range-picker-custom', false);

      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const statuses = requests.map((r) => r.issueStatus).sort();
      expect(statuses).toEqual(['archived', 'closed', 'open']);
      requests.forEach(({ start, end }) => {
        expect(start).toBeTruthy();
        expect(end).toBeTruthy();
      });
    });

    it('does not include occurrence_date_range params until user selects a date when flag is on', async () => {
      window.setFlag('pm-date-range-picker-custom', true);

      render(
        <Provider store={store}>
          <IssuesTab {...props} />
        </Provider>
      );

      await waitForElementToBeRemoved(
        screen.queryByTestId('DelayedLoadingFeedback')
      );

      const statuses = requests.map((r) => r.issueStatus).sort();
      expect(statuses).toEqual(['archived', 'closed', 'open']);
      requests.forEach(({ start, end }) => {
        expect(start).toBeNull();
        expect(end).toBeNull();
      });
    });
  });
});
