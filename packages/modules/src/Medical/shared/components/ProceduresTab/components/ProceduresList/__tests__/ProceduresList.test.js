import { within, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import mockedProcedures from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';
import {
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import ProceduresList from '../ProceduresList';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  medicalHistory: {},
});

const props = {
  onReachingEnd: jest.fn(),
  onOpenArchiveProcedureModal: jest.fn(),
  showAvatar: true,
  isLoading: false,
  procedures: mockedProcedures.procedures,
  currentOrganisation: { id: 37 },
  next_id: 1,
  athleteOnTrial: false,
  t: i18nextTranslateStub(),
};

const mockChronicIssueProcedures = {
  ...mockedProcedures.procedures[0],
  chronic_issues: [
    {
      id: 19,
      pathology: 'Chronic Issue 1',
      reported_date: '2023-01-10T00:00:00+00:00',
      status: null,
      title: 'Testing Chronic',
    },
  ],
};

const defaultPermissions = {
  ...DEFAULT_CONTEXT_VALUE.permissions,
  medical: {
    ...DEFAULT_CONTEXT_VALUE.permissions.medical,
  },
};

const renderTestComponent = (passedProps, procedurePermissions) => {
  return renderWithProvider(
    <PermissionsContext.Provider
      value={{
        permissions: {
          ...defaultPermissions,
          ...{ medical: { procedures: { ...procedurePermissions } } },
        },
      }}
    >
      <ProceduresList {...props} {...passedProps} />
    </PermissionsContext.Provider>,
    store
  );
};

describe('<ProceduresList/>', () => {
  beforeEach(() => {
    window.featureFlags['medical-procedure'] = true;
  });

  afterEach(() => {
    window.featureFlags['medical-procedure'] = false;
  });

  describe('rendering content', () => {
    beforeEach(() => {
      window.featureFlags['medical-procedure'] = true;
    });

    it('renders the correct table column headings', async () => {
      renderTestComponent(
        { isLoading: false },
        {
          canView: true,
        }
      );

      const columns = screen.getAllByRole('columnheader');
      expect(columns).toHaveLength(8);

      expect(columns[0]).toHaveClass('dataTable__th--player');
      expect(columns[1]).toHaveClass('dataTable__th--procedure');
      expect(columns[2]).toHaveClass('dataTable__th--reason');
      expect(columns[3]).toHaveClass('dataTable__th--company');
      expect(columns[4]).toHaveClass('dataTable__th--date');
      expect(columns[5]).toHaveClass('dataTable__th--provider');
      expect(columns[6]).toHaveClass('dataTable__th--attachments');

      expect(columns[0]).toHaveTextContent('Player');
      expect(columns[1]).toHaveTextContent('Procedure');
      expect(columns[2]).toHaveTextContent('Reason');
      expect(columns[3]).toHaveTextContent('Company');
      expect(columns[4]).toHaveTextContent('Date');
      expect(columns[5]).toHaveTextContent('Provider');
      expect(columns[6]).toHaveTextContent('Attachments');
    });

    it('renders the correct TextCell values', () => {
      render(<ProceduresList {...props} />);
      const textCells = screen.getAllByRole('cell');

      expect(textCells[0]).toHaveTextContent('Alpha AlphaHooker');
      expect(textCells[1]).toHaveTextContent('My Type1');
      expect(textCells[2]).toHaveTextContent('Procedure Reason 2');
      expect(textCells[3]).toHaveTextContent('Location 1');
      expect(textCells[4]).toHaveTextContent('Dec 5, 2022');
      expect(textCells[5]).toHaveTextContent('Test User 3');
    });

    it('renders the correct TextCell values for chronic procedure', () => {
      const mockPropForChronicIssue = {
        onReachingEnd: jest.fn(),
        currentOrganisation: { id: 37 },
        showAvatar: true,
        isLoading: false,
        procedures: [mockChronicIssueProcedures],
        next_id: 1,
        t: i18nextTranslateStub(),
      };

      render(<ProceduresList {...mockPropForChronicIssue} />);
      const textCells = screen.getAllByRole('cell');
      expect(textCells[2]).toHaveTextContent('Chronic Issue 1');
    });

    it('should not renders issue links if there is', () => {
      mockChronicIssueProcedures.chronic_issues = [];
      const mockPropForChronicIssue = {
        onReachingEnd: jest.fn(),
        currentOrganisation: { id: 37 },
        showAvatar: true,
        isLoading: false,
        procedures: [mockChronicIssueProcedures],
        next_id: 1,
        t: i18nextTranslateStub(),
      };

      render(<ProceduresList {...mockPropForChronicIssue} />);
      const reasonContent = screen.getByTestId(
        'ProcedureOverviewTab|ReasonContent'
      );
      expect(reasonContent).toHaveTextContent('Procedure Reason 2');
    });
    // Currently archive is the only action button
    it('renders the action buttons when player is not on trial and canArchive permission true', async () => {
      renderTestComponent(
        { isLoading: false, athleteOnTrial: false },
        {
          canView: true,
          canArchive: true,
        }
      );
      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons).toHaveLength(4);
    });

    it('does not render the action buttons when player is not on trial and canArchive permission false', async () => {
      renderTestComponent(
        { isLoading: false, athleteOnTrial: false },
        {
          canView: true,
          canArchive: false,
        }
      );

      const actionButtons = screen.queryByRole('button');
      expect(actionButtons).not.toBeInTheDocument();
    });

    it('does not render the action buttons when player is on trial', async () => {
      renderTestComponent(
        { isLoading: false, athleteOnTrial: true },
        {
          canView: true,
          canArchive: true,
        }
      );

      const actionButtons = screen.queryByRole('button');
      expect(actionButtons).not.toBeInTheDocument();
    });

    it('does not render the action buttons when player is on trial and canArchive permission false', async () => {
      renderTestComponent(
        { isLoading: false, athleteOnTrial: true },
        {
          canView: true,
          canArchive: false,
        }
      );

      const actionButtons = screen.queryByRole('button');
      expect(actionButtons).not.toBeInTheDocument();
    });

    it('should render attached_links if they exist', () => {
      render(<ProceduresList {...props} />);

      const linkAttachments = screen.getByTestId('ProcedureCardList|Link');
      expect(linkAttachments).toBeInTheDocument();

      const linkAttachmentsUrl = linkAttachments.querySelector('a');
      expect(linkAttachmentsUrl).toHaveAttribute('href', 'https://rte.ie');
    });

    it('[PERMISSIONS] - should render tooltip if canArchive permission is on', async () => {
      renderTestComponent(
        {},
        {
          canView: true,
          canArchive: true,
        }
      );

      // Check for existence of Archive button within tooltip
      const procedureActionsCell = screen.getAllByRole('cell')[7];
      const tooltipButton = within(procedureActionsCell).getByRole('button');
      await userEvent.click(tooltipButton);

      expect(
        screen.getByRole('button', { name: 'Archive' })
      ).toBeInTheDocument();
    });

    it('[PERMISSIONS] - should not render tooltip if canArchive permission is on', async () => {
      renderTestComponent(
        {},
        {
          canView: true,
          canArchive: false,
        }
      );

      // Check for lack of Archive button within tooltip
      const procedureActionsCell = screen.getAllByRole('cell')[7];
      expect(
        within(procedureActionsCell).queryByRole('button', { name: 'Archive' })
      ).not.toBeInTheDocument();
    });
  });
});
