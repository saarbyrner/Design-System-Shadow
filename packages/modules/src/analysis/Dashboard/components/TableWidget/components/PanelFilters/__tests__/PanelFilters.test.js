import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import _cloneDeep from 'lodash/cloneDeep';
import PanelFilters from '../index';

describe('<PanelFilters />', () => {
  const baseProps = {
    t: i18nextTranslateStub(),
    isOpen: true,
    onSetFilters: jest.fn(),
    onClickOpenFilters: jest.fn(),
    onClickCloseFilters: jest.fn(),
    supportedFilters: [
      { label: 'Session type', value: 'activity_group_ids' },
      { label: 'Time Loss', value: 'time_loss' },
    ],
  };
  it('renders the session type filters selector', () => {
    renderWithStore(<PanelFilters {...baseProps} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('if multiple filters are supported it should open filters block by default', () => {
    renderWithStore(<PanelFilters {...baseProps} />);

    expect(baseProps.onClickOpenFilters).toHaveBeenCalled();
  });

  it('if multiple filters are supported it should have a dropdown to choose filters', () => {
    renderWithStore(<PanelFilters {...baseProps} />);

    expect(baseProps.onClickOpenFilters).toHaveBeenCalled();
    expect(screen.getByText('Add filter')).toBeInTheDocument();
  });

  it('should render Session Types if filter type is `training_session_types`', async () => {
    const props = _cloneDeep(baseProps);
    props.filters = {
      training_session_types: [12],
    };
    renderWithStore(<PanelFilters {...props} />);
    expect(screen.getByText('Session Type')).toBeInTheDocument();
  });

  it('should load only on the click of the button if only one filter supported', async () => {
    const user = userEvent.setup();
    const props = _cloneDeep(baseProps);
    props.supportedFilters = [
      { label: 'Session type', value: 'activity_group_ids' },
    ];
    props.isOpen = false;
    renderWithStore(<PanelFilters {...props} />);

    await user.click(screen.getByText('Add Filter'));

    expect(props.onClickOpenFilters).toHaveBeenCalled();
  });

  it('should allow canceling if only one filter supported', async () => {
    const props = _cloneDeep(baseProps);
    props.supportedFilters = [
      { label: 'Session type', value: 'activity_group_ids' },
    ];
    props.isOpen = true;
    renderWithStore(<PanelFilters {...props} />);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  describe('when match day filter flag is present', () => {
    const props = _cloneDeep(baseProps);
    props.supportedFilters = [
      { label: 'Session type', value: 'activity_group_ids' },
      { label: 'Game Day +/-', value: 'match_day_number' },
    ];
    props.isOpen = true;

    beforeEach(() => {
      window.setFlag('rep-match-day-filter', true);
    });

    it('should render MatchDay filter', async () => {
      props.filters = {
        match_days: [12],
      };
      renderWithStore(<PanelFilters {...props} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(props.onClickOpenFilters).toHaveBeenCalled();
      expect(screen.getByText('Game Day +/-')).toBeInTheDocument();
    });

    it('should not render MatchDay filter when selected filter is empty', async () => {
      props.filters = {
        match_days: [], // empty filter
      };
      renderWithStore(<PanelFilters {...props} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.queryByText('Game Day +/-')).not.toBeInTheDocument();
    });
  });
});
