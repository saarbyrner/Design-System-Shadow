import userEvent from '@testing-library/user-event';
import {
  i18nextTranslateStub,
  storeFake,
  renderWithProvider,
} from '@kitman/common/src/utils/test_utils';
import ManageLinksInformation from '../ManageLinksInformation';

describe('ManageLinksInformation Container', () => {
  let component;
  const initialStore = storeFake({
    addIssuePanel: {
      additionalInfo: {
        issueLinks: [],
      },
    },
  });
  const savedStore = storeFake({
    addIssuePanel: {
      additionalInfo: {
        issueLinks: [
          { title: 'test url', uri: 'test-site-one.com' },
          { title: 'example two url', uri: 'test-site-two.com' },
        ],
      },
    },
  });
  const mockOnRemove = jest.fn();
  const useDispatchMock = jest.fn();
  initialStore.dispatch = useDispatchMock;
  savedStore.dispatch = useDispatchMock;

  const componentRender = (mockStore) =>
    renderWithProvider(
      <ManageLinksInformation onRemove={mockOnRemove} />,
      mockStore
    );

  beforeEach(() => {
    jest.resetAllMocks();
    i18nextTranslateStub();
  });

  describe('initial render', () => {
    beforeEach(() => {
      component = componentRender(initialStore);
    });

    it('adding a valid link dispatches an update', async () => {
      await userEvent.type(component.getByLabelText('Title'), 'Test Link');
      await userEvent.type(component.getByLabelText('Link'), 'TestLink.com');
      await userEvent.click(component.getByText('Add'));
      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: [{ title: 'Test Link', uri: 'TestLink.com' }],
        type: 'UPDATE_ISSUE_LINKS',
      });
    });

    it('calls onRemove and dispatches to reset the links if the section bin icon is clicked', async () => {
      await userEvent.click(component.getAllByRole('button')[0]);
      expect(mockOnRemove).toHaveBeenCalled();
      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: [],
        type: 'UPDATE_ISSUE_LINKS',
      });
    });
  });

  describe('render with redux IssueLinks populated', () => {
    beforeEach(() => {
      component = componentRender(savedStore);
    });

    it('clicking the bin of an existing link causes it to call a dispatch to update and remove the link', async () => {
      await userEvent.click(component.getAllByRole('button')[2]);
      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: [{ title: 'example two url', uri: 'test-site-two.com' }],
        type: 'UPDATE_ISSUE_LINKS',
      });
    });
  });
});
