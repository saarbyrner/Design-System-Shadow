import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import GraphLinksModal from '..';

describe('<GraphLinksModal />', () => {
  const props = {
    open: false,
    metricList: [],
    dashboardList: [],
    graphLinks: [
      { metrics: [], dashboardId: null },
      { metrics: [], dashboardId: null },
    ],
    onClickCloseModal: jest.fn(),
    onClickAddGraphLinkRow: jest.fn(),
    onClickRemoveGraphLinkRow: jest.fn(),
    onSelectGraphLinkOrigin: jest.fn(),
    onUnselectGraphLinkOrigin: jest.fn(),
    onSelectGraphLinkTarget: jest.fn(),
    onClickSaveGraphLinks: jest.fn(),
    onClickCloseAppStatus: jest.fn(),
    t: (key) => key,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('contains a Modal', () => {
    renderWithStore(<GraphLinksModal {...props} open />);

    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Link to dashboard')).toBeInTheDocument();
  });

  it('calls the correct props when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<GraphLinksModal {...props} open />);

    const allButtons = screen.getAllByRole('button');
    const closeButton = allButtons.find((button) =>
      button.className.includes('reactModal__closeBtn')
    );
    await user.click(closeButton);

    expect(props.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls the correct props when removing a graph link row', async () => {
    const user = userEvent.setup();
    renderWithStore(<GraphLinksModal {...props} open />);

    const allButtons = screen.getAllByRole('button');
    const removeButtons = allButtons.filter(
      (button) =>
        button.className.includes('icon-close') &&
        button.className.includes('iconButton--transparent')
    );

    expect(removeButtons.length).toBeGreaterThanOrEqual(2);

    await user.click(removeButtons[1]);
    expect(props.onClickRemoveGraphLinkRow).toHaveBeenCalledWith(1);
  });

  describe('When the form is empty and clicking the save button', () => {
    it('calls the onClickSaveGraphLinks', async () => {
      const user = userEvent.setup();
      renderWithStore(<GraphLinksModal {...props} open />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(props.onClickSaveGraphLinks).toHaveBeenCalledTimes(1);
    });
  });

  describe('When the form is valid and clicking the save button', () => {
    it('calls the onClickSaveGraphLinks', async () => {
      const user = userEvent.setup();
      const testProps = {
        ...props,
        graphLinks: [
          { metrics: [], dashboardId: null },
          { metrics: ['1'], dashboardId: '1' },
        ],
      };
      renderWithStore(<GraphLinksModal {...testProps} open />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(props.onClickSaveGraphLinks).toHaveBeenCalledTimes(1);
    });
  });

  describe('When a row has a dashboard selected but no metrics and clicking the save button', () => {
    it('reveals incomplete entries', async () => {
      const user = userEvent.setup();
      const testProps = {
        ...props,
        graphLinks: [
          { metrics: [], dashboardId: null },
          { metrics: [], dashboardId: '1' },
        ],
      };
      renderWithStore(<GraphLinksModal {...testProps} open />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(props.onClickSaveGraphLinks).not.toHaveBeenCalled();
    });
  });

  describe('When a row has a metric selected but no dashboard and clicking the save button', () => {
    it('reveals incomplete entries on dirty rows', async () => {
      const user = userEvent.setup();
      const testProps = {
        ...props,
        graphLinks: [
          { metrics: [], dashboardId: null },
          { metrics: ['1'], dashboardId: null },
        ],
      };
      renderWithStore(<GraphLinksModal {...testProps} open />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(props.onClickSaveGraphLinks).not.toHaveBeenCalled();
    });

    it('keeps showing incomplete entries when deleting a row', async () => {
      const user = userEvent.setup();
      const testProps = {
        ...props,
        graphLinks: [
          { metrics: [], dashboardId: null },
          { metrics: ['1'], dashboardId: null },
        ],
      };
      renderWithStore(<GraphLinksModal {...testProps} open />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(props.onClickSaveGraphLinks).not.toHaveBeenCalled();

      const allButtons = screen.getAllByRole('button');
      const removeButtons = allButtons.filter(
        (button) =>
          button.className.includes('icon-close') &&
          button.className.includes('iconButton--transparent')
      );

      expect(removeButtons.length).toBeGreaterThanOrEqual(1);

      await user.click(removeButtons[0]);
      expect(props.onClickRemoveGraphLinkRow).toHaveBeenCalledWith(0);
    });
  });

  it('information tooltips are present', () => {
    renderWithStore(<GraphLinksModal {...props} open />);

    expect(screen.getByText('Select metric(s)')).toBeInTheDocument();
    expect(screen.getByText('Select linked dashboard')).toBeInTheDocument();
  });

  describe('When all metrics are selected', () => {
    it('disables the + button', () => {
      const testProps = {
        ...props,
        metricList: [
          { id: '1', name: 'Metric 1' },
          { id: '2', name: 'Metric 2' },
          { id: '3', name: 'Metric 3' },
        ],
        graphLinks: [
          { metrics: ['1'], dashboardId: null },
          { metrics: ['2', '3'], dashboardId: null },
        ],
      };
      renderWithStore(<GraphLinksModal {...testProps} open />);

      const allButtons = screen.getAllByRole('button');
      const addButton = allButtons.find((button) =>
        button.className.includes('icon-add')
      );

      expect(addButton).toBeDisabled();
    });
  });
});
