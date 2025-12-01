import { render, screen, waitFor } from '@testing-library/react';
import useFormResultsData from '@kitman/modules/src/Medical/shared/hooks/useFormResultsData';
import { axios } from '@kitman/common/src/utils/services';
import { mockSections } from '@kitman/modules/src/Medical/shared/components/DynamicMedicalForms/mocks/data.mock';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import formInfoMock from '@kitman/modules/src/Medical/forms/src/mocks/formInfoMock';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ResultsFormDisplay from '../index';

jest.mock('@kitman/modules/src/Medical/shared/hooks/useFormResultsData');

describe('<ResultsFormDisplay />', () => {
  const defaultMedicalPermissions = DEFAULT_CONTEXT_VALUE.permissions.medical;
  const defaultConcussionPermissions =
    DEFAULT_CONTEXT_VALUE.permissions.concussion;
  const props = {
    formId: 100,
    athleteId: 1,
    t: i18nextTranslateStub(),
  };

  const mockedPermissionsContextValue = {
    permissions: {
      medical: {
        ...defaultMedicalPermissions,
        forms: {
          canView: true,
        },
      },
      concussion: {
        ...defaultConcussionPermissions,
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  };

  describe('when request for form sections is successful', () => {
    beforeEach(() => {
      window.featureFlags = {
        'medical-forms-tab-iteration-1': true,
        'concussion-entity-view': true,
      };

      useFormResultsData.mockReturnValue({
        fetchFormResultsData: jest.fn(),
        formResults: mockSections,
        formInfo: formInfoMock,
      });

      jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: mockAthleteData }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
      window.featureFlags = {
        'medical-forms-tab-iteration-1': false,
        'concussion-entity-view': false,
      };
    });

    it('renders a DelayedLoadingFeedback initially', () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ResultsFormDisplay {...props} />
        </MockedPermissionContextProvider>
      );

      expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
    });

    it('renders a QuestionSectionsDisplay without permissions?', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ResultsFormDisplay {...props} />
        </MockedPermissionContextProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId('DelayedLoadingFeedback')
        ).not.toBeInTheDocument();
      });

      expect(
        screen.getAllByTestId('QuestionSectionsDisplay|Section')
      ).toHaveLength(2);
    });

    it('renders a FormOverviewTab with FormDetails', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ResultsFormDisplay {...props} />
        </MockedPermissionContextProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId('DelayedLoadingFeedback')
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText('Form overview')).toBeInTheDocument();
      expect(screen.getByText('Form details')).toBeInTheDocument();
    });
  });

  describe('when request for CARE form is successful', () => {
    const mockCareSections = [
      {
        title: 'Form Details',
        elementId: 'section_form_details',
        elements: [
          {
            questionsAndAnswers: [
              {
                question: 'Initially captured on:',
                answer: 'May 19, 2023',
                id: 'initial_date',
                type: 'questionAndAnswer',
              },
            ],
            id: 1810,
            isConditional: false,
            isGroupInData: false,
            type: 'group',
          },
        ],
        id: 1809,
        sidePanelSection: true,
        columns: 1,
      },
      {
        title: 'Personal Details',
        elementId: 'section_personal_details',
        elements: [
          {
            questionsAndAnswers: [
              {
                question: 'Did athlete change their name?',
                answer: 'No',
                id: 'changed_name',
                type: 'questionAndAnswer',
              },
            ],
            id: 1815,
            isConditional: false,
            isGroupInData: false,
            type: 'group',
          },
        ],
        id: 1814,
        sidePanelSection: false,
        columns: 2,
      },
    ];

    beforeEach(() => {
      window.featureFlags = {
        'medical-forms-tab-iteration-1': true,
      };

      useFormResultsData.mockReturnValue({
        fetchFormResultsData: jest.fn(),
        formResults: mockCareSections,
        formInfo: {
          ...formInfoMock,
          formMeta: {
            ...formInfoMock.formMeta,
            key: 'care_demographics',
          },
        },
      });

      jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: mockAthleteData }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
      window.featureFlags = {
        'medical-forms-tab-iteration-1': false,
      };
    });

    it('renders a FormOverviewTab without FormDetails', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <ResultsFormDisplay {...props} />
        </MockedPermissionContextProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId('DelayedLoadingFeedback')
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText('Form overview')).toBeInTheDocument();
      expect(screen.queryByText('Form details')).not.toBeInTheDocument();
    });
  });
});
