import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as segmentData } from '@kitman/services/src/mocks/handlers/analysis/groups';
import { data as labelData } from '@kitman/services/src/mocks/handlers/analysis/labels';
import { data as MOCK_SQUAD_ATHLETES } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';

import ScorecardColumn from '../ScorecardColumn';

describe('ScorecardColumn Component', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    columnData: [
      {
        id: 1,
        value: 34,
        status: 'SUCCESS',
        rowDetails: {
          summary: 'mean',
        },
      },
    ],
    dateSettings: {
      time_period: 'this_season',
      time_period_length: null,
      start_time: null,
      end_time: null,
    },
    squadAthletes: {
      all_squads: false,
      applies_to_squad: false,
      athletes: [],
      squads: [],
      positions: [],
      position_groups: [],
    },
    populationDetails: {},
    formattingRules: { 1: { formattingRules: [] } },
    id: 999,
    isSorted: false,
    name: 'Entire Squad',
    tableMetrics: [{ id: 1 }],
    t: i18nT,
  };

  it('renders a session/date row', () => {
    const { container } = render(<ScorecardColumn {...props} />);
    expect(
      container.getElementsByClassName('tableWidget__sessionOrDateRow').length
    ).toEqual(1);
  });

  it('renders the correct text', () => {
    render(<ScorecardColumn {...props} />);
    expect(screen.getByText('This Season')).toBeInTheDocument();
  });

  it('renders the correct text when last x events is present', () => {
    props.dateSettings = {
      time_period: 'last_x_events',
      time_period_length: 5,
      time_period_length_offset: null,
      start_time: null,
      end_time: null,
    };
    render(<ScorecardColumn dataStatus="SUCCESS" {...props} />);
    expect(screen.getByText('Last 5 events')).toBeInTheDocument();
  });

  it('renders the correct text when last x events and offset is present', () => {
    props.dateSettings = {
      time_period: 'last_x_events',
      time_period_length: 5,
      time_period_length_offset: 5,
      start_time: null,
      end_time: null,
    };
    render(<ScorecardColumn dataStatus="SUCCESS" {...props} />);
    expect(screen.getByText('Last 5 - 10 events')).toBeInTheDocument();
  });

  it('renders a header row', () => {
    const { container } = render(<ScorecardColumn {...props} />);
    expect(
      container.getElementsByClassName('tableWidget__columnHeader').length
    ).toEqual(1);
  });

  it('does not render `tableWidget__columnHeader--disabled` when the dashboard can be managed', () => {
    const { container } = render(
      <ScorecardColumn {...props} canManageDashboard />
    );
    expect(
      container.getElementsByClassName('tableWidget__columnHeader--disabled')
        .length
    ).toEqual(0);
  });

  it('renders `tableWidget__columnHeader--disabled` when the dashboard cannot be managed', () => {
    const { container } = render(
      <ScorecardColumn {...props} canManageDashboard={false} />
    );
    expect(
      container.getElementsByClassName('tableWidget__columnHeader--disabled')
        .length
    ).toEqual(1);
  });

  it('renders a loading cell', () => {
    const { container } = render(
      <ScorecardColumn
        {...props}
        columnData={[{ id: 1, value: null, status: 'PENDING' }]}
      />
    );

    expect(
      container.getElementsByClassName('tableWidget__loadingCell').length
    ).toEqual(2);
  });

  it('renders an error row', () => {
    const { container } = render(
      <ScorecardColumn
        {...props}
        columnData={[{ id: 1, value: null, status: 'FAILURE' }]}
      />
    );

    // expect session/date row + header row + 1 loading row
    expect(container.getElementsByTagName('tr').length).toEqual(3);
    expect(screen.getByText('Reload Row')).toBeInTheDocument();
  });

  it('renders the caching loader when status is "CACHING"', () => {
    const cachingProps = {
      ...props,
      columnData: [
        {
          id: 1,
          value: 34,
          status: DATA_STATUS.caching,
        },
      ],
    };
    render(<ScorecardColumn {...cachingProps} />);
    expect(screen.getByText('Calculating large dataset')).toBeInTheDocument();
    expect(screen.getByTestId('AnimatedCalculateLoader')).toBeInTheDocument();
  });

  it('does not render the caching loader when status is "PENDING"', () => {
    const cachingProps = {
      ...props,
      columnData: [
        {
          id: 1,
          value: 34,
          status: DATA_STATUS.pending,
        },
      ],
    };
    render(<ScorecardColumn {...cachingProps} />);
    expect(
      screen.queryByTestId('AnimatedCalculateLoader')
    ).not.toBeInTheDocument();
  });

  describe('labels and groups', () => {
    const { name, ...rest } = props;
    const updatedProps = {
      ...rest,
      squadAthletes: MOCK_SQUAD_ATHLETES.squads[0],
      labels: labelData,
      groups: segmentData,
    };
    it('renders a label column header', async () => {
      render(
        <ScorecardColumn
          {...updatedProps}
          populationDetails={{
            ...props.squadAthletes,
            labels: [labelData[0].id],
          }}
        />
      );

      expect(await screen.findByText(labelData[0].name)).toBeInTheDocument();
    });

    it('renders a segment column header', async () => {
      render(
        <ScorecardColumn
          {...updatedProps}
          populationDetails={{
            ...props.squadAthletes,
            segments: [segmentData[0].id],
          }}
        />
      );

      expect(await screen.findByText(segmentData[0].name)).toBeInTheDocument();
    });
  });
});
