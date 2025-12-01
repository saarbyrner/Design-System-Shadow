import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { ActionBarTranslated as ActionBar } from '../index';
import useBulkUpdateLabelsAction from '../utils/hooks/useBulkUpdateLabelsAction';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('../utils/hooks/useBulkUpdateLabelsAction');

setI18n(i18n);

const createMockStore = (state = {}) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const DEFAULT_PERMISSIONS = {
  settings: { canAssignLabels: true },
  homegrown: { canViewHomegrown: true },
};

const DEFAULT_LABELS_ACTION = {
  areLabelsDataFetching: false,
  isBulkUpdateAthleteLabelsLoading: false,
  handleLabelChange: jest.fn(),
  handleBulkUpdateLabelsClick: jest.fn(),
  labelsOptions: [],
  selectedLabelIds: [],
};

const DEFAULT_STORE = createMockStore({
  globalApi: {
    useGetOrganisationQuery: jest
      .fn()
      .mockReturnValue({ data: { id: 1, name: 'Test Organisation' } }),
    useGetCurrentUserQuery: jest
      .fn()
      .mockReturnValue({ data: { id: 1, name: 'Test User' } }),
    useGetActiveSquadQuery: jest
      .fn()
      .mockReturnValue({ data: { id: 1, name: 'Test Squad' } }),
  },
});

const renderActionBar = (props = {}) => {
  return render(
    <Provider store={DEFAULT_STORE}>
      <ActionBar selectedAthleteIds={[1, 2, 3]} {...props} />
    </Provider>
  );
};

describe('ActionBar', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({ permissions: DEFAULT_PERMISSIONS });
    useBulkUpdateLabelsAction.mockReturnValue(DEFAULT_LABELS_ACTION);
    jest.clearAllMocks();
  });

  describe('permission and feature flag checks', () => {
    it('should not render when feature flag is disabled', () => {
      usePermissions.mockReturnValue({
        permissions: {
          settings: { canAssignLabels: false },
        },
      });

      renderActionBar();
      expect(screen.queryByText('Assign Labels')).not.toBeInTheDocument();
    });

    it('should not render when user does not have assign labels permission', () => {
      usePermissions.mockReturnValue({
        permissions: {
          ...DEFAULT_PERMISSIONS,
          settings: { canAssignLabels: false },
        },
      });
      renderActionBar();
      expect(screen.queryByText('Assign Labels')).not.toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('should display selected athletes count', () => {
      renderActionBar();
      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });

    it('should show Assign Labels button', () => {
      renderActionBar();
      const assignLabelsButton = screen.getByRole('button', {
        name: /assign labels/i,
      });
      expect(assignLabelsButton).toBeInTheDocument();
    });
  });

  describe('Labels menu interaction', () => {
    it('triggers labels action with correct parameters', async () => {
      const user = userEvent.setup();
      renderActionBar();

      const assignLabelsButton = screen.getByRole('button', {
        name: /assign labels/i,
      });
      await user.click(assignLabelsButton);

      expect(useBulkUpdateLabelsAction).toHaveBeenCalledWith({
        t: expect.any(Function),
        selectedAthleteIds: [1, 2, 3],
        canViewLabels: true,
      });
    });

    it('renders LabelsMenu values', async () => {
      const user = userEvent.setup();
      useBulkUpdateLabelsAction.mockReturnValue({
        ...DEFAULT_LABELS_ACTION,
        labelsOptions: [
          {
            id: 1,
            label: 'Homegrown 1',
            name: 'homegrown_1',
          },
          {
            id: 2,
            label: 'Homegrown 2',
            name: 'homegrown_2',
          },
          {
            id: 3,
            label: 'Homegrown 3',
            name: 'homegrown_3',
          },
        ],
      });
      renderActionBar();
      await user.click(screen.getByRole('button', { name: /assign labels/i }));

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Homegrown 1')).toBeInTheDocument();
      expect(screen.getByText('Homegrown 2')).toBeInTheDocument();
      expect(screen.getByText('Homegrown 3')).toBeInTheDocument();
    });

    it('should handle label assignment', async () => {
      const user = userEvent.setup();
      useBulkUpdateLabelsAction.mockReturnValue({
        ...DEFAULT_LABELS_ACTION,
        labelsOptions: [
          {
            id: 1,
            label: 'Homegrown 1',
            name: 'homegrown_1',
          },
          {
            id: 2,
            label: 'Homegrown 2',
            name: 'homegrown_2',
          },
          {
            id: 3,
            label: 'Homegrown 3',
            name: 'homegrown_3',
          },
        ],
      });
      renderActionBar();
      await user.click(screen.getByRole('button', { name: /assign labels/i }));
      const firstCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(firstCheckbox);

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(
        DEFAULT_LABELS_ACTION.handleBulkUpdateLabelsClick
      ).toHaveBeenCalled();
    });
  });
});
