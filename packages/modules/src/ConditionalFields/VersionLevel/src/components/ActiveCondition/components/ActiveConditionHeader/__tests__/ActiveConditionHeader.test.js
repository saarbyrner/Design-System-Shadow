import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import {
  useSaveVersionMutation,
  useFetchVersionQuery,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  MOCK_CONDITIONS,
  MOCK_ACTIVE_CONDITION,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';
import { data as MOCK_VERSION } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_version';

import {
  onSetValidationStatus,
  onSetRequestStatus,
  onSetFlattenedNames,
  onResetFormState,
  onSetActiveCondition,
} from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import {
  transformConditionForPayload,
  validateData,
} from '@kitman/modules/src/ConditionalFields/shared/utils';

import { ActiveConditionHeaderTranslated } from '..';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
    ),
    useSaveVersionMutation: jest.fn(),
    useFetchVersionQuery: jest.fn(),
  })
);

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@kitman/modules/src/ConditionalFields/shared/routes/utils', () => ({
  parseVersionIdFromLocation: jest.fn(() => '456'),
  parseRulesetIdFromLocation: jest.fn(() => '123'),
}));

jest.mock('@kitman/modules/src/ConditionalFields/shared/utils', () => ({
  transformConditionForPayload: jest.fn((condition) => condition),
  validateData: jest.fn(() => ({ passedValidation: true, flattenedNames: [] })),
}));

const defaultProps = {
  title: '',
  rulesetId: 42,
  isPublished: false,
  t: i18nextTranslateStub(),
};

const mockSaveVersion = jest.fn();

describe('<ActiveConditionHeader/>', () => {
  beforeEach(() => {
    jest.resetModules(); // Reset modules to ensure fresh mocks
    useSaveVersionMutation.mockReturnValue([mockSaveVersion, {}]); // Consolidated mock
    useFetchVersionQuery.mockReturnValue({
      data: MOCK_VERSION,
      isSuccess: true,
    });

    useLocationPathname.mockReturnValue('/some/path/ruleset/123/version/456');

    mockSaveVersion.mockResolvedValue({});
  });

  it('renders header with activeCondition order', () => {
    renderWithRedux(<ActiveConditionHeaderTranslated {...defaultProps} />, {
      preloadedState: {
        conditionBuildViewSlice: {
          activeCondition: MOCK_ACTIVE_CONDITION,
          allConditions: [MOCK_ACTIVE_CONDITION],
        },
      },
      useGlobalStore: false,
    });

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      `Rule ${MOCK_ACTIVE_CONDITION.order}`
    );
  });

  describe('Allowed to edit', () => {
    it('renders save and discard button if version is not published yet', () => {
      renderWithRedux(<ActiveConditionHeaderTranslated {...defaultProps} />, {
        preloadedState: {
          conditionBuildViewSlice: {
            activeCondition: MOCK_ACTIVE_CONDITION,
            allConditions: [MOCK_ACTIVE_CONDITION],
          },
        },
        useGlobalStore: false,
      });

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Discard changes' })
      ).toBeInTheDocument();
    });

    it('does not render save and discard button if version is published', () => {
      renderWithRedux(
        <ActiveConditionHeaderTranslated {...defaultProps} isPublished />,
        {
          preloadedState: {
            conditionBuildViewSlice: {
              activeCondition: MOCK_CONDITIONS[0],
              allConditions: MOCK_CONDITIONS,
            },
          },
          useGlobalStore: false,
        }
      );

      expect(screen.queryByText('Save')).not.toBeInTheDocument();
      expect(screen.queryByText('Discard')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        `Rule ${MOCK_ACTIVE_CONDITION.order}`
      );
    });
  });

  describe('handleSaveCondition', () => {
    it('dispatches validation status and request status on save', async () => {
      const user = userEvent.setup();
      const { mockedStore } = renderWithRedux(
        <ActiveConditionHeaderTranslated
          {...defaultProps}
          isPublished={false}
        />,
        {
          preloadedState: {
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
            },
          },
          useGlobalStore: false,
        }
      );
      const dispatchSpy = jest.spyOn(mockedStore, 'dispatch');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetValidationStatus({ validationStatus: 'PENDING' })
      );
      expect(transformConditionForPayload).toHaveBeenCalledWith(
        MOCK_ACTIVE_CONDITION
      );
      expect(validateData).toHaveBeenCalledWith({
        data: MOCK_ACTIVE_CONDITION,
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetValidationStatus({ validationStatus: 'DORMANT' })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetRequestStatus({ requestStatus: 'PENDING' })
      );
      expect(mockSaveVersion).toHaveBeenCalledTimes(1);
    });

    it('calls saveVersion with correctly ordered conditions', async () => {
      const user = userEvent.setup();
      renderWithRedux(
        <ActiveConditionHeaderTranslated
          {...defaultProps}
          isPublished={false}
        />,
        {
          preloadedState: {
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
            },
          },
          useGlobalStore: false,
        }
      );

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(mockSaveVersion).toHaveBeenCalledWith({
        rulesetId: '123',
        versionId: '456',
        conditions: [
          MOCK_ACTIVE_CONDITION,
          transformConditionForPayload(MOCK_CONDITIONS[1]),
        ],
        versionName: null,
      });
    });

    it('dispatches success and resets form state on successful save', async () => {
      const user = userEvent.setup();
      const { mockedStore } = renderWithRedux(
        <ActiveConditionHeaderTranslated
          {...defaultProps}
          isPublished={false}
        />,
        {
          preloadedState: {
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
            },
          },
          useGlobalStore: false,
        }
      );
      const dispatchSpy = jest.spyOn(mockedStore, 'dispatch');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetRequestStatus({ requestStatus: 'SUCCESS' })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(onResetFormState());
    });

    it('dispatches error on failed save', async () => {
      mockSaveVersion.mockRejectedValue(new Error('Save failed'));
      const user = userEvent.setup();
      const { mockedStore } = renderWithRedux(
        <ActiveConditionHeaderTranslated
          {...defaultProps}
          isPublished={false}
        />,
        {
          preloadedState: {
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
            },
          },
          useGlobalStore: false,
        }
      );
      const dispatchSpy = jest.spyOn(mockedStore, 'dispatch');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetRequestStatus({ requestStatus: 'ERROR' })
      );
    });

    it('handles validation failure', async () => {
      validateData.mockReturnValueOnce({
        passedValidation: false,
        flattenedNames: ['name1'],
      });
      const user = userEvent.setup();
      const { mockedStore } = renderWithRedux(
        <ActiveConditionHeaderTranslated
          {...defaultProps}
          isPublished={false}
        />,
        {
          preloadedState: {
            conditionBuildViewSlice: {
              activeCondition: MOCK_ACTIVE_CONDITION,
              allConditions: [MOCK_ACTIVE_CONDITION],
            },
          },
          useGlobalStore: false,
        }
      );
      const dispatchSpy = jest.spyOn(mockedStore, 'dispatch');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetValidationStatus({ validationStatus: 'PENDING' })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        onSetFlattenedNames({ flattenedNames: ['name1'] })
      );
      expect(mockSaveVersion).not.toHaveBeenCalled();
    });
  });

  it('dispatches onSetActiveCondition when Discard changes button is clicked', async () => {
    const user = userEvent.setup();
    const { mockedStore } = renderWithRedux(
      <ActiveConditionHeaderTranslated {...defaultProps} isPublished={false} />,
      {
        preloadedState: {
          conditionBuildViewSlice: {
            activeCondition: MOCK_ACTIVE_CONDITION,
            allConditions: [MOCK_ACTIVE_CONDITION],
          },
        },
        useGlobalStore: false,
      }
    );
    const dispatchSpy = jest.spyOn(mockedStore, 'dispatch');

    await user.click(screen.getByRole('button', { name: 'Discard changes' }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      onSetActiveCondition({ activeCondition: MOCK_ACTIVE_CONDITION })
    );
  });
});
