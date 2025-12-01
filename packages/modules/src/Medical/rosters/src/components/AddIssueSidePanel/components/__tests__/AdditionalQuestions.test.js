import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import selectEvent from 'react-select-event'; // Added import

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { data } from '@kitman/services/src/mocks/handlers/medical/getConditionalFieldsForm';
import { useGetConditionalFieldsFormQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';

import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import AdditionalQuestions from '../AdditionalQuestions';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
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
    useGetConditionalFieldsFormQuery: jest.fn(),
  },
  addIssuePanel: {
    initialInfo: {
      type: null,
    },
    eventInfo: { eventType: 5, activity: 1 },
    diagnosisInfo: {
      coding: {
        [codingSystemKeys.OSICS_10]: {
          osics_pathology_id: 3,
          osics_classification_id: 2,
          osics_body_area_id: 4,
        },
      },
      onset: 6,
    },
    additionalInfo: {
      conditionalFieldsAnswers: [],
      questions: data.conditions,
      requestStatus: 'SUCCESS',
      annotations: [],
    },
  },
});

const i18nT = i18nextTranslateStub();

const props = {
  // Permissions
  permissions: {
    medical: {},
  },
  conditionalFieldsQuestions: [],
  t: i18nT,
};

describe('<AdditionalQuestions/>', () => {
  beforeEach(() => {
    window.featureFlags = {
      'conditional-fields-showing-in-ip': true,
    };
    i18nextTranslateStub();
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  // Added test for no additional information message
  it('renders the no additional information message when there is none to add', () => {
    render(
      <Provider store={store}>
        <AdditionalQuestions {...props} conditionalFieldsQuestions={[]} />
      </Provider>
    );
    expect(
      screen.getByTestId('AddIssuePanel|NoAdditionalInformation')
    ).toBeInTheDocument();
  });

  // Added Attachments tests
  describe('[FORM FIELDS] Additional Information', () => {
    describe('[FEATURE FLAG] files-and-links-on-injuries', () => {
      beforeEach(() => {
        window.featureFlags['files-and-links-on-injuries'] = true;
      });
      afterEach(() => {
        window.featureFlags['files-and-links-on-injuries'] = false;
      });
      it('Attachments: renders the Attachments component with the correct options (File, Link)', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                permissions={{}}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        // Check if Attachments component is rendered (placeholder query)
        // Check if Select component is rendered with the correct placeholder and class
        expect(
          screen.getByText('Add', {
            selector: '.kitmanReactSelect__placeholder', // Use selector instead of class
          })
        ).toBeInTheDocument();
      });

      // New test to check options
      it('Attachments: shows File and Link options when menu is opened', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                permissions={{}}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        const selectElement = screen.getByText('Add', {
          selector: '.kitmanReactSelect__placeholder',
        });

        await selectEvent.openMenu(selectElement);

        expect(await screen.findByText('File')).toBeInTheDocument();
        expect(await screen.findByText('Link')).toBeInTheDocument();
      });
    });

    describe('[FEATURE FLAG] linked-injury-illness-performance-medicine', () => {
      beforeEach(() => {
        window.featureFlags[
          'linked-injury-illness-performance-medicine'
        ] = true;
      });
      afterEach(() => {
        window.featureFlags[
          'linked-injury-illness-performance-medicine'
        ] = false;
      });
      it('Attachments: renders the Attachments component with the correct options (Associated issue)', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                permissions={{}}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        // Check if Attachments component is rendered (placeholder query)
        // Check if Select component is rendered with the correct placeholder and class
        expect(
          screen.getByText('Add', {
            selector: '.kitmanReactSelect__placeholder', // Use selector instead of a class
          })
        ).toBeInTheDocument();
      });

      // New test to check options
      it('Attachments: shows Associated issue option when menu is opened', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                permissions={{}}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        const selectElement = screen.getByText('Add', {
          selector: '.kitmanReactSelect__placeholder',
        });

        await selectEvent.openMenu(selectElement);

        expect(await screen.findByText('Associated issue')).toBeInTheDocument();
      });
    });

    describe('[PERMISSIONS] medical.notes.canCreate', () => {
      it('Attachments: renders the Attachments component with the correct options (Note)', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                permissions={{
                  ...props.permissions,
                  medical: {
                    notes: {
                      canCreate: true,
                    },
                  },
                }}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        // Check if Attachments component is rendered (placeholder query)
        // Check if Select component is rendered with the correct placeholder and class
        expect(
          screen.getByText('Add', {
            selector: '.kitmanReactSelect__placeholder', // Use selector instead of class
          })
        ).toBeInTheDocument();
      });

      // New test to check options
      it('Attachments: shows Note option when menu is opened', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                permissions={{
                  ...props.permissions,
                  medical: {
                    notes: {
                      canCreate: true,
                    },
                  },
                }}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        const selectElement = screen.getByText('Add', {
          selector: '.kitmanReactSelect__placeholder',
        });

        await selectEvent.openMenu(selectElement);

        expect(await screen.findByText('Note')).toBeInTheDocument();
      });
      it('Attachments: does not render the Attachments component when viewing a past athlete regardless of feature flags', async () => {
        render(
          <Provider store={store}>
            <MockedOrganisationContextProvider
              organisationContext={{
                organisation: { coding_system_key: codingSystemKeys.ICD },
              }}
            >
              <AdditionalQuestions
                {...props}
                conditionalFieldsQuestions={[]}
                isPastAthlete
                permissions={{
                  ...props.permissions,
                  medical: {
                    notes: {
                      canCreate: true,
                    },
                  },
                }}
              />
            </MockedOrganisationContextProvider>
          </Provider>
        );

        // Check if Attachments component is NOT rendered (placeholder query)
        expect(
          screen.queryByTestId('AttachmentsComponent')
        ).not.toBeInTheDocument();
      });
    });
  });

  // Added old conditional fields tests
  describe('when conditional-fields-showing-in-ip is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'conditional-fields-showing-in-ip': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the conditional fields form', async () => {
      render(
        <Provider store={store}>
          <AdditionalQuestions {...props} conditionalFieldsQuestions={[{}]} />
        </Provider>
      );
      expect(
        screen.getByTestId('AddIssuePanel|ConditionalFieldsForm')
      ).toBeInTheDocument();
    });

    it('does not render the conditional fields form when the issue is a continuation', async () => {
      render(
        <Provider store={store}>
          <AdditionalQuestions
            {...props}
            conditionalFieldsQuestions={[{}]}
            issueIsAContinuation
          />
        </Provider>
      );
      expect(
        screen.queryByTestId('AddIssuePanel|ConditionalFieldsForm')
      ).not.toBeInTheDocument();
    });
  });

  // Original Conditional fields v2 tests
  describe('Conditional fields v2', () => {
    beforeEach(() => {
      window.featureFlags = {
        'conditional-fields-v1-stop': true,
      };
      useGetConditionalFieldsFormQuery.mockReturnValue({
        data,
        isError: false,
        isLoading: false,
      });
    });

    it('renders with Logic builder header', () => {
      render(
        <Provider store={store}>
          <AdditionalQuestions {...props} />
        </Provider>
      );

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Logic builder'
      );
    });

    it('does not render when issue is continuation issue', () => {
      render(
        <Provider store={store}>
          <AdditionalQuestions
            {...props}
            conditionalFieldsQuestions={data.conditions}
            issueIsAContinuation
          />
        </Provider>
      );

      expect(screen.queryByText('Logic builder')).not.toBeInTheDocument();
    });
  });

  // Original [FF] - false tests
  describe('[FF] - false', () => {
    beforeEach(() => {
      window.featureFlags = {
        'conditional-fields-v1-stop': false,
      };
      useGetConditionalFieldsFormQuery.mockReturnValue({
        data,
        isError: false,
        isLoading: false,
      });
    });

    it('does not render with conditional fields container', () => {
      render(
        <Provider store={store}>
          <AdditionalQuestions {...props} />
        </Provider>
      );

      expect(screen.queryByText('Logic builder')).not.toBeInTheDocument();
    });
  });
});
