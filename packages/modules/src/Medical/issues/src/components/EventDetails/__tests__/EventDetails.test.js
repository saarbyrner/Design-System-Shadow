import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  storeFake,
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import EventDetails from '..';

const store = storeFake({
  globalApi: {},
  medicalApi: {},
  medicalSharedApi: {},
  medicalHistory: {},
});

jest.mock('@kitman/modules/src/Medical/shared/hooks/useIssueFields', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@kitman/services/src/services/medical/getIssueContactTypes', () => ({
  __esModule: true,
  default: jest.fn(() => []),
}));

jest.mock('@kitman/services', () => ({
  __esModule: true,
  getGameAndTrainingOptions: jest.fn(() => ({
    games: [],
    training_sessions: [],
    other_events: [],
  })),
  saveIssue: jest.fn(() => Promise.resolve({})),
  getActivityGroups: jest.fn(() => []),
  getPositionGroups: jest.fn(() => []),
  getPresentationTypes: jest.fn(() => []),
}));

describe('<EventDetails />', () => {
  beforeAll(() => {
    window.featureFlags['pm-editing-examination-and-date-of-injury'] = false;
  });
  beforeEach(() => {
    i18nextTranslateStub();
    useIssueFields.mockReturnValue({
      getFieldLabel: jest.fn((label) => label),
      isFieldVisible: jest.fn(() => true), // Default to true for most tests
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PresentationView', () => {
    it('renders the default presentation view', async () => {
      renderWithProvider(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <EventDetails onEnterEditMode={jest.fn()} />
        </PermissionsContext.Provider>,
        store
      );

      expect(() => screen.getAllByRole('button')).toThrow();

      await waitFor(() => {
        const dataItems = screen.getAllByRole('listitem');
        expect(dataItems[1]).toHaveTextContent('Event:');
      });
    });

    it('renders the action buttons with the correct permissions', async () => {
      renderWithProvider(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <EventDetails onEnterEditMode={jest.fn()} />
        </PermissionsContext.Provider>,
        store
      );

      const editButton = await screen.findByRole('button');
      await waitFor(() => {
        expect(editButton).toHaveTextContent('Edit');
      });
    });

    it('does not render the action button when the issue is a continuation', async () => {
      renderWithProvider(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              isContinuationIssue: true,
            }}
          >
            <EventDetails onEnterEditMode={jest.fn()} />
          </MockedIssueContextProvider>
        </PermissionsContext.Provider>,
        store
      );

      const editButton = screen.queryByRole('button');
      expect(editButton).not.toBeInTheDocument();
    });

    describe('Date of Event (Issue) Field', () => {
      beforeEach(() => {
        window.featureFlags[
          'pm-editing-examination-and-date-of-injury'
        ] = false;
      });

      afterEach(() => {
        window.featureFlags[
          'pm-editing-examination-and-date-of-injury'
        ] = false;
      });

      it('renders the date of event field when pm-editing-examination-and-date-of-injury is false and codingSystemIsCI is true', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  coding: {
                    [codingSystemKeys.CLINICAL_IMPRESSIONS]: true,
                  },
                },
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const dateOfInjuryLabel = screen.getByText('Date of injury:');
          expect(dateOfInjuryLabel).toBeInTheDocument();
        });
      });

      it('does render the date of event (Issue) field when pm-editing-examination-and-date-of-injury is false and codingSystemIsCI is false', async () => {
        window.featureFlags[
          'pm-editing-examination-and-date-of-injury'
        ] = false;
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  coding: {
                    [codingSystemKeys.DATALYS]: {},
                  },
                },
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const dateOfInjuryLabel = screen.getByText('Date of injury:');
          expect(dateOfInjuryLabel).toBeInTheDocument();
        });
      });

      it('does render the date of event field when pm-editing-examination-and-date-of-injury is false and codingSystemIsCI is true', async () => {
        window.featureFlags[
          'pm-editing-examination-and-date-of-injury'
        ] = false;
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  coding: {
                    [codingSystemKeys.CLINICAL_IMPRESSIONS]: {},
                  },
                },
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const dateOfInjuryLabel = screen.queryByText('Date of injury:');
          expect(dateOfInjuryLabel).toBeInTheDocument();
        });
      });

      it('does not render the date of event field when pm-editing-examination-and-date-of-injury is true and codingSystemIsCI is true', async () => {
        window.featureFlags['pm-editing-examination-and-date-of-injury'] = true;
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  coding: {
                    [codingSystemKeys.CLINICAL_IMPRESSIONS]: {},
                  },
                },
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const dateOfInjuryLabel = screen.queryByText('Date of injury:');
          expect(dateOfInjuryLabel).not.toBeInTheDocument();
        });
      });

      it('does not render the date of event field when pm-editing-examination-and-date-of-injury is true and codingSystemIsCI is false', async () => {
        window.featureFlags['pm-editing-examination-and-date-of-injury'] = true;
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  coding: {
                    [codingSystemKeys.DATALYS]: {},
                  },
                },
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const dateOfInjuryLabel = screen.queryByText('Date of injury:');
          expect(dateOfInjuryLabel).not.toBeInTheDocument();
        });
      });
    });

    describe('Reported Date Field', () => {
      beforeEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = true;
      });

      afterEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });

      it('renders the reported date field when nfl-injury-flow-fields is true and not a chronic issue', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isChronicIssue: false,
              }}
            >
              <EventDetails
                onEnterEditMode={jest.fn()}
                isFieldVisible={() => true}
              />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const reportedDateLabel = screen.getByText('Reported date:');
          expect(reportedDateLabel).toBeInTheDocument();
        });
      });

      it('renders the reported date field when nfl-injury-flow-fields is true, is a chronic issue, and reported_date field is visible', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isChronicIssue: true,
              }}
            >
              <EventDetails
                onEnterEditMode={jest.fn()}
                isFieldVisible={(field) => field === 'reported_date'}
              />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const reportedDateLabel = screen.getByText('Reported date:');
          expect(reportedDateLabel).toBeInTheDocument();
        });
      });

      it('does not render the reported date field when nfl-injury-flow-fields is false', async () => {
        window.featureFlags['nfl-injury-flow-fields'] = false;
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <EventDetails
                onEnterEditMode={jest.fn()}
                isFieldVisible={() => true}
              />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        await waitFor(() => {
          const reportedDateLabel = screen.queryByText('Reported date:');
          expect(reportedDateLabel).not.toBeInTheDocument();
        });
      });

      it('does not render the reported date field when nfl-injury-flow-fields is true, is a chronic issue, and reported_date field is not visible', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                isChronicIssue: true,
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );
        useIssueFields.mockReturnValue({
          getFieldLabel: jest.fn((label) => label),
          isFieldVisible: jest.fn(() => false), // Override for this specific test
        });

        await waitFor(() => {
          const reportedDateLabel = screen.queryByText('Reported date:');
          expect(reportedDateLabel).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('EditView', () => {
    it('renders the edit view when clicked', async () => {
      renderWithProvider(
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...DEFAULT_CONTEXT_VALUE.permissions,
              medical: {
                issues: {
                  canEdit: true,
                },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <EventDetails onEnterEditMode={jest.fn()} />
          </MockedIssueContextProvider>
        </PermissionsContext.Provider>,
        store
      );

      const editButton = await screen.findByRole('button');
      expect(editButton).toHaveTextContent('Edit');
      await userEvent.click(editButton);

      await waitFor(() => {
        const discardChangesButton = screen.getByRole('button', {
          name: 'Discard changes',
        });
        const saveChangesButton = screen.getByRole('button', { name: 'Save' });

        expect(discardChangesButton).toBeInTheDocument();
        expect(saveChangesButton).toBeInTheDocument();
      });
    });

    describe('Date of Event (Issue) Field - MovementAware DatePicker', () => {
      beforeEach(() => {
        window.featureFlags['player-movement-entity-injury'] = true;
        window.featureFlags['player-movement-entity-illness'] = true;
        window.featureFlags['player-movement-aware-datepicker'] = true;
      });

      afterEach(() => {
        window.featureFlags['player-movement-entity-injury'] = false;
        window.featureFlags['player-movement-entity-illness'] = false;
        window.featureFlags['player-movement-aware-datepicker'] = false;
      });

      it('renders the new MovementAwareDatePicker when feature flags are enabled', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
                medical: {
                  issues: {
                    canEdit: true,
                  },
                },
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="en-gb"
              >
                <EventDetails onEnterEditMode={jest.fn()} />
              </LocalizationProvider>
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        const editButton = await screen.findByRole('button');
        await userEvent.click(editButton);

        await waitFor(() => {
          const datePickerInput = screen.getByPlaceholderText('DD/MM/YYYY');
          expect(datePickerInput).toHaveValue('13/01/2022');
          expect(
            datePickerInput.parentNode.parentNode.parentNode.querySelector(
              'label'
            )
          ).toHaveTextContent('Date of injury');
        });
      });
    });

    describe('Date of Event (Issue) Field - Legacy DatePicker', () => {
      beforeEach(() => {
        window.featureFlags['player-movement-entity-injury'] = false;
        window.featureFlags['player-movement-entity-illness'] = false;
        window.featureFlags['player-movement-aware-datepicker'] = false;
      });

      it('renders the legacy DatePicker when feature flags are disabled', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
                medical: {
                  issues: {
                    canEdit: true,
                  },
                },
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        const editButton = await screen.findByRole('button');
        await userEvent.click(editButton);

        await waitFor(() => {
          const dateOfInjuryLabel = screen.getByLabelText('Date of injury');
          expect(dateOfInjuryLabel).toBeInTheDocument();
        });
      });
    });

    describe('[feature-flag] pm-editing-examination-and-date-of-injury', () => {
      beforeEach(() => {
        window.featureFlags['pm-editing-examination-and-date-of-injury'] = true;
      });

      afterEach(() => {
        window.featureFlags[
          'pm-editing-examination-and-date-of-injury'
        ] = false;
      });

      it('does not render the date of event field when the feature flag is enabled', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
                medical: {
                  issues: {
                    canEdit: true,
                  },
                },
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        const editButton = await screen.findByRole('button');
        await userEvent.click(editButton);

        await waitFor(() => {
          const dateOfInjuryLabel = screen.queryByLabelText('Date of injury');
          expect(dateOfInjuryLabel).not.toBeInTheDocument();
        });
      });

      it('does not render the date of event field when the feature flag is enabled and codingSystemIsCI is true', async () => {
        renderWithProvider(
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
                medical: {
                  issues: {
                    canEdit: true,
                  },
                },
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <MockedIssueContextProvider
              issueContext={{
                ...mockedIssueContextValue,
                issue: {
                  ...mockedIssueContextValue.issue,
                  coding: {
                    [codingSystemKeys.CLINICAL_IMPRESSIONS]: true,
                  },
                },
              }}
            >
              <EventDetails onEnterEditMode={jest.fn()} />
            </MockedIssueContextProvider>
          </PermissionsContext.Provider>,
          store
        );

        const editButton = await screen.findByRole('button');
        await userEvent.click(editButton);

        await waitFor(() => {
          const dateOfInjuryLabel = screen.queryByLabelText('Date of injury');
          expect(dateOfInjuryLabel).not.toBeInTheDocument();
        });
      });
    });
  });
});
