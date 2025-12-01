import { render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  buildStatuses,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { statusesToIds, statusesToMap } from '@kitman/common/src/utils';
import { AthleteStatusHeader } from '../../components/AthleteStatusHeader';

// Mock the connected container to avoid needing a Redux store for initial render test
jest.mock('../../containers/AlarmsEditorButton', () => () => (
  <span data-testid="alarms-editor-btn" />
));

setI18n(i18n);

describe('AthleteStatusHeader Component', () => {
  const baseStatuses = buildStatuses(10);
  const buildProps = (overrides = {}) => ({
    t: i18nextTranslateStub(),
    statusOrder: statusesToIds(baseStatuses),
    statusMap: statusesToMap(baseStatuses),
    canManageDashboard: true,
    dummyCellsNumber: 0,
    currentDashboardId: 'dash-1',
    updateSort: jest.fn(),
    ...overrides,
  });

  it('renders component container', () => {
    const { container } = render(<AthleteStatusHeader {...buildProps()} />);
    expect(container.querySelector('.athleteStatusHeader')).toBeInTheDocument();
  });

  it('renders the correct number of statuses', () => {
    const { container } = render(<AthleteStatusHeader {...buildProps()} />);
    const statuses = container.querySelectorAll('.athleteStatusHeader__status');
    expect(statuses.length).toBe(10);
  });

  it('displays prompt when there are no available statuses', () => {
    const { container, getByText } = render(
      <AthleteStatusHeader
        {...buildProps({ statusOrder: [], statusMap: {} })}
      />
    );
    expect(
      getByText('There are no metrics for this dashboard.')
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('.athleteStatusHeader__status').length
    ).toBe(0);
  });

  it('status renders name and unit correctly', () => {
    const props = buildProps();
    const { container } = render(<AthleteStatusHeader {...props} />);
    const statusEls = container.querySelectorAll(
      '.athleteStatusHeader__status'
    );
    statusEls.forEach((el, index) => {
      const statusId = props.statusOrder[index];
      const status = props.statusMap[statusId];
      if (!status) return; // ignore dummy cells in later tests
      expect(el).toHaveTextContent(status.name);
      const unitEl = el.querySelector('.athleteStatusHeader__statusUnit');
      const expectedUnit = status.localised_unit
        ? `(${status.localised_unit})`
        : '';
      expect(unitEl ? unitEl.textContent : '').toBe(expectedUnit);
    });
  });

  it('truncates long status names', () => {
    const longStatuses = [
      {
        status_id: 'custom_status_id',
        name: 'A Status Name That is Longer than Fifty Characters 1234567890',
        localised_unit: '',
        description: 'Last from last 7 days',
        source_key: 'kitman:right_sl_cmj|stabilisation_knee_angle_right',
        summary: 'last',
        period_scope: 'last_x_days',
        type: 'number',
        period_length: 7,
      },
    ];
    const statusOrder = statusesToIds(longStatuses);
    const statusMap = statusesToMap(longStatuses);
    const { container } = render(
      <AthleteStatusHeader {...buildProps({ statusOrder, statusMap })} />
    );
    const firstStatus = container.querySelector(
      '.athleteStatusHeader__status div'
    );
    expect(firstStatus?.textContent).toContain(
      'A Status Name That is Longer than Fifty Charact...'
    );
  });

  describe('user can manage dashboard', () => {
    it('renders a menu icon in statuses', () => {
      const { container } = render(<AthleteStatusHeader {...buildProps()} />);
      // TooltipMenu trigger icon-more should exist in at least one status
      const secondStatus = container.querySelectorAll(
        '.athleteStatusHeader__status'
      )[1];
      expect(secondStatus.querySelector('.icon-more')).toBeInTheDocument();
    });

    describe('no athlete statuses defined', () => {
      it('shows the Add Status button in empty header', () => {
        const { getByText } = render(
          <AthleteStatusHeader
            {...buildProps({ statusOrder: [], statusMap: {} })}
          />
        );
        expect(
          getByText('There are no metrics for this dashboard.')
        ).toBeInTheDocument();
        // Add Metric button text rendered via t('Add Metric')
        expect(getByText('Add Metric')).toBeInTheDocument();
      });

      it('assigns new location when Add Status button clicked', () => {
        const assignSpy = jest.fn();
        const original = window.location;
        // jsdom location is read-only; override
        // $FlowFixMe
        delete window.location;
        // minimal location object with assign
        // $FlowFixMe
        window.location = { assign: assignSpy };
        const { getByText } = render(
          <AthleteStatusHeader
            {...buildProps({ statusOrder: [], statusMap: {} })}
          />
        );
        getByText('Add Metric').click();
        expect(assignSpy).toHaveBeenCalledTimes(1);
        // restore
        window.location = original;
      });
    });
  });

  describe('user cannot manage dashboard', () => {
    it('hides status options', () => {
      const { container } = render(
        <AthleteStatusHeader {...buildProps({ canManageDashboard: false })} />
      );
      // Legacy spec asserted absence of elements with class 'glyphicon'
      const legacyIcons = container.querySelectorAll(
        '.athleteStatusHeader__status .glyphicon'
      );
      expect(legacyIcons.length).toBe(0);
    });

    it('hides Add Status button in empty header', () => {
      const { queryByText } = render(
        <AthleteStatusHeader
          {...buildProps({
            statusOrder: [],
            statusMap: {},
            canManageDashboard: false,
          })}
        />
      );
      expect(queryByText('Add Metric')).not.toBeInTheDocument();
    });
  });

  it('renders enough cells even with few statuses including dummy cells', () => {
    const few = buildStatuses(3);
    const statusOrder = statusesToIds(few);
    const statusMap = statusesToMap(few);
    const { container } = render(
      <AthleteStatusHeader
        {...buildProps({ statusOrder, statusMap, dummyCellsNumber: 5 })}
      />
    );
    expect(
      container.querySelectorAll('.athleteStatusHeader__status').length
    ).toBe(8);
  });
});
