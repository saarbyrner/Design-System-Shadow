import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  i18nextTranslateStub,
  buildEvent,
} from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import ImportedDataTab from '../index';

jest.mock('../../PlanningTabLayout', () => {
  const PlanningTab = ({ children, styles }) => (
    <div data-testid="planning-tab" data-styles={JSON.stringify(styles)}>
      {children}
    </div>
  );
  PlanningTab.TabHeader = ({ children }) => (
    <div data-testid="tab-header">{children}</div>
  );
  PlanningTab.TabTitle = ({ children }) => (
    <div data-testid="tab-title">{children}</div>
  );
  PlanningTab.TabActions = ({ children }) => (
    <div data-testid="tab-actions">{children}</div>
  );
  PlanningTab.TabContent = ({ children }) => (
    <div data-testid="tab-content">{children}</div>
  );
  return PlanningTab;
});

jest.mock('../ImportTable/ImportTable', () => ({
  ImportTableTranslated: (props) => (
    <div data-testid="import-table" data-showimport={props.showImport} />
  ),
}));
jest.mock('../ImportTable/MUIimportTable', () => ({
  MUIimportTable: () => <div data-testid="mui-import-table" />,
}));
jest.mock('../ImportActions', () => ({
  ImportActionsTranslated: ({ onClickImportData }) => (
    <button
      data-testid="import-actions"
      onClick={onClickImportData}
      type="button"
    >
      Import Data
    </button>
  ),
}));
jest.mock('@kitman/modules/src/ImportWorkflow/src/components/App', () => ({
  AppTranslated: () => <div data-testid="import-workflow-modal" />,
}));

describe('<ImportedDataTab />', () => {
  const baseProps = {
    event: buildEvent(),
    canEditEvent: true,
    orgTimezone: 'UTC',
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props) => {
    return renderWithProviders(<ImportedDataTab {...baseProps} {...props} />);
  };

  describe('with feature flag OFF', () => {
    it('renders the correct content when user can edit', () => {
      renderComponent({ canEditEvent: true });
      expect(screen.getByTestId('planning-tab')).toBeInTheDocument();
      expect(screen.getByTestId('tab-header')).toBeInTheDocument();
      expect(screen.getByText('Imported Data')).toBeInTheDocument();
      expect(screen.getByTestId('tab-actions')).toBeInTheDocument();
      expect(screen.getByTestId('import-actions')).toBeInTheDocument();
      expect(screen.getByTestId('tab-content')).toBeInTheDocument();
      expect(screen.getByTestId('import-table')).toBeInTheDocument();
      expect(screen.getByTestId('import-table')).toHaveAttribute(
        'data-showimport',
        'true'
      );
    });

    it('does not show import actions when the user cannot edit', () => {
      renderComponent({ canEditEvent: false });
      expect(screen.queryByTestId('import-actions')).not.toBeInTheDocument();
      expect(screen.getByTestId('import-table')).toHaveAttribute(
        'data-showimport',
        'false'
      );
    });

    it('opens the import modal when import is clicked', async () => {
      renderComponent();
      expect(
        screen.queryByTestId('import-workflow-modal')
      ).not.toBeInTheDocument();
      await userEvent.click(screen.getByTestId('import-actions'));
      expect(screen.getByTestId('import-workflow-modal')).toBeInTheDocument();
    });
  });

  describe('with feature flag ON', () => {
    beforeEach(() => {
      window.setFlag('pac-calendar-events-imported-data-tab-in-mui', true);
    });

    it('renders the MUI table and no header', () => {
      renderComponent();
      expect(screen.getByTestId('planning-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('tab-header')).not.toBeInTheDocument();
      expect(screen.getByTestId('mui-import-table')).toBeInTheDocument();
      expect(screen.queryByTestId('import-table')).not.toBeInTheDocument();
    });
  });
});
