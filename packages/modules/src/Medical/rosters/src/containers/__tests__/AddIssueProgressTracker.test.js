import userEvent from '@testing-library/user-event';
import {
  storeFake,
  renderWithProvider,
} from '@kitman/common/src/utils/test_utils';
import AddIssueProgressTracker from '../AddIssueProgressTracker';

describe('Add Issue Progress Tracker', () => {
  let component;
  const initialStore = storeFake({
    addIssuePanel: {
      page: 1,
    },
  });
  const endStore = storeFake({
    addIssuePanel: {
      page: 3,
    },
  });
  const headings = [
    {
      id: 1,
      name: 'Heading One',
    },
    {
      id: 2,
      name: 'Heading Two',
    },
    {
      id: 3,
      name: 'Heading Three',
    },
  ];
  const useDispatchMock = jest.fn();
  initialStore.dispatch = useDispatchMock;
  endStore.dispatch = useDispatchMock;

  const componentRender = (
    mockStore,
    currentID,
    formValidationMock = jest.fn
  ) =>
    renderWithProvider(
      <AddIssueProgressTracker
        currentHeadingId={currentID}
        headings={headings}
        formValidation={formValidationMock}
        issueType="injury"
      />,
      mockStore
    );

  beforeEach(() => {
    jest.resetAllMocks();
    window.innerWidth = 500;
    window.featureFlags = { 'preliminary-injury-illness': true };
  });

  afterEach(() => {
    window.innerWidth = 1400;
    window.featureFlags = {};
  });

  describe('initial mobile render', () => {
    let formValidationMock;
    beforeEach(() => {
      formValidationMock = jest.fn(() => true);
      component = componentRender(initialStore, 1, formValidationMock);
    });

    it('clicking the progress next arrow in mobile dispatches an gotoNextPanelPage call', async () => {
      await userEvent.click(component.getByTestId('icon-next-chevron'));
      expect(formValidationMock).toHaveBeenCalled();
      expect(useDispatchMock).toHaveBeenCalledWith({
        type: 'GO_TO_NEXT_PANEL_PAGE',
      });
    });
  });

  describe('final mobile render', () => {
    beforeEach(() => {
      component = componentRender(initialStore, 3);
    });

    it('clicking the progress back arrow in mobile dispatches an gotoPreviousPanelPage call', async () => {
      await userEvent.click(component.getByTestId('icon-back-chevron'));
      expect(useDispatchMock).toHaveBeenCalledWith({
        type: 'GO_TO_PREVIOUS_PANEL_PAGE',
      });
    });
  });
});
