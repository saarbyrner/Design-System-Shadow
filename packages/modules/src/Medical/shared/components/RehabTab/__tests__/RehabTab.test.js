import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { defaultRehabPermissions } from '@kitman/common/src/contexts/PermissionsContext/rehab';
import { useLazyGetExercisesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { getMockDataForExercise } from '@kitman/services/src/mocks/handlers/rehab/getExercises';
import RehabTab from '..';
import { TransferRecordContextProvider } from '../../../contexts/TransferRecordContext';
import { RehabProvider } from '../RehabContext';

// DelayedLoadingFeedback is mocked because it contains
// a timeout that complicates testing this component

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useFetchOrganisationPreferenceQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useLazyGetExercisesQuery: jest.fn(),
  })
);

describe('<RehabTab />', () => {
  const store = storeFake({
    addMedicalNotePanel: {
      isOpen: false,
    },
  });

  // We use React Portal to add the side panel to div 'issueMedicalProfile-Slideout'
  // And we add the rehabFilters button bar to
  // Mock in as needs to be present in the test
  beforeAll(() => {
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'issueMedicalProfile-Slideout');
    document.body.appendChild(mockElement);
    window.featureFlags = { 'rehab-groups': true };
  });

  afterAll(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
  });

  beforeEach(() => {
    i18nextTranslateStub();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-11-27'));
    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise(),
        isError: false,
        isLoading: false,
      }),
    ]);
    useFetchOrganisationPreferenceQuery.mockReturnValue({
      data: {
        value: false,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const props = {
    inMaintenance: false,
    issueOccurrenceId: '123',
    t: i18nextTranslateStub(),
  };

  it('displays the correct data after loading', async () => {
    const rendered = renderWithProvider(
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
        <TransferRecordContextProvider playerTransferRecord={null}>
          <RehabProvider>
            <RehabTab {...props} />
          </RehabProvider>
        </TransferRecordContextProvider>
      </PermissionsContext.Provider>,
      store
    );

    const loadingIndicator = rendered.getByTestId('Rehab|SessionsLoading');
    expect(loadingIndicator).toBeInTheDocument();

    // There are multiple loading texts but just wait for the session one to complete
    await waitForElementToBeRemoved(loadingIndicator);

    // Check that side panel is present
    expect(screen.getByTestId('Rehab|ExerciseListPanel')).toBeInTheDocument();

    const selectModeContainer = screen.getByTestId(
      'RehabFilters|DayModeSelect'
    );

    expect(selectModeContainer).toBeInTheDocument();
    expect(screen.getByText('3 day')).toBeInTheDocument();
    expect(screen.queryByText('5 day')).not.toBeInTheDocument();
    expect(screen.queryByText('7 day')).not.toBeInTheDocument();

    // check that there is 5 containers
    const containers = screen.getAllByTestId('Rehab|DroppableContainer');
    expect(containers).toHaveLength(3);

    // check the details match correctly for some of the draggable items
    const rehabs1 = within(containers[0]).getAllByTestId('Rehab|Item');
    expect(rehabs1).toHaveLength(3);
    expect(rehabs1[0]).toHaveTextContent('Active Stretch');
    expect(rehabs1[0].querySelector('span')).toHaveStyle({
      backgroundColor: '#2583ff',
    });
    expect(rehabs1[0].querySelector('span')).toHaveStyle({
      backgroundColor: '#2583ff',
    });
    expect(
      screen.queryByLabelText('Group indicator for Stretch items')
    ).toBeInTheDocument();

    expect(rehabs1[1]).toHaveTextContent('Active Stretch');
    expect(rehabs1[1].querySelector('span')).toHaveStyle({
      backgroundColor: '#2586ff',
    });
    expect(
      screen.queryByLabelText('Group indicator for Strength items')
    ).toBeInTheDocument();

    expect(rehabs1[2]).toHaveTextContent('1/2 Kneeling Ankle Mobility');
    expect(rehabs1[2].querySelector('span')).toHaveStyle({
      backgroundColor: '#2589ff',
    });
    expect(
      screen.queryByLabelText(
        'Group indicator for Warm down conditioning items'
      )
    ).toBeInTheDocument();

    const rehabs2 = within(containers[1]).getByTestId('Rehab|Item');
    expect(rehabs2).toBeInTheDocument();
    expect(rehabs2).toHaveTextContent('3 Way SLR');

    const rehabs3 = within(containers[2]).getByTestId('Rehab|Item');
    expect(rehabs3).toBeInTheDocument();
    expect(rehabs3).toHaveTextContent('4 Way Ankle');

    rehabs1.forEach((v) => {
      expect(v.querySelector('span')).toHaveStyle({
        width: '4px',
        flex: 1,
      });
    });
  });

  it('displays data in readOnly mode when a user does not have canManage permission', async () => {
    renderWithProvider(
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
        <TransferRecordContextProvider playerTransferRecord={null}>
          <RehabProvider>
            <RehabTab {...props} />
          </RehabProvider>
        </TransferRecordContextProvider>
      </PermissionsContext.Provider>,
      store
    );
    const loadingIndicator = screen.getByTestId('Rehab|SessionsLoading');
    expect(loadingIndicator).toBeInTheDocument();

    // There are multiple loading texts but just wait for the session one to complete
    await waitForElementToBeRemoved(loadingIndicator);

    // Check that side panel is not present
    expect(() => screen.getByTestId('Rehab|ExerciseListPanel')).toThrow();

    const selectModeContainer = screen.getByTestId(
      'RehabFilters|DayModeSelect'
    );

    expect(selectModeContainer).toBeInTheDocument();
    expect(screen.getByText('3 day')).toBeInTheDocument();
    expect(screen.queryByText('5 day')).not.toBeInTheDocument();
    expect(screen.queryByText('7 day')).not.toBeInTheDocument();

    // check that there is 5 containers
    const containers = screen.getAllByTestId('Rehab|DroppableContainer');
    expect(containers).toHaveLength(3);

    // check the details match correctly for some of the draggable items
    const rehabs1 = within(containers[0]).getAllByTestId('Rehab|Item');
    expect(rehabs1).toHaveLength(3);
    expect(rehabs1[0]).toHaveTextContent('Active Stretch');
    expect(rehabs1[1]).toHaveTextContent('Active Stretch');
    expect(rehabs1[2]).toHaveTextContent('1/2 Kneeling Ankle Mobility');

    const rehabs2 = within(containers[1]).getByTestId('Rehab|Item');
    expect(rehabs2).toBeInTheDocument();
    expect(rehabs2).toHaveTextContent('3 Way SLR');

    const rehabs3 = within(containers[2]).getByTestId('Rehab|Item');
    expect(rehabs3).toBeInTheDocument();
    expect(rehabs3).toHaveTextContent('4 Way Ankle');
  });

  it('does not display the ExerciseListPanel without manage permission', async () => {
    renderWithProvider(
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
        <TransferRecordContextProvider playerTransferRecord={null}>
          <RehabProvider>
            <RehabTab {...props} />
          </RehabProvider>
        </TransferRecordContextProvider>
      </PermissionsContext.Provider>,
      store
    );
    const loadingIndicator = screen.getByTestId('Rehab|SessionsLoading');
    expect(loadingIndicator).toBeInTheDocument();

    // There are multiple loading texts but just wait for the session one to complete
    await waitForElementToBeRemoved(loadingIndicator);

    // Check that side panel is not present
    expect(
      screen.queryByTestId('Rehab|ExerciseListPanel')
    ).not.toBeInTheDocument();
  });

  test('handles server error', async () => {
    server.use(
      rest.post('/ui/medical/rehab/sessions/filter', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    renderWithProvider(
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
        <TransferRecordContextProvider playerTransferRecord={null}>
          <RehabProvider>
            <RehabTab {...props} />
          </RehabProvider>
        </TransferRecordContextProvider>
      </PermissionsContext.Provider>,
      store
    );

    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });
});
