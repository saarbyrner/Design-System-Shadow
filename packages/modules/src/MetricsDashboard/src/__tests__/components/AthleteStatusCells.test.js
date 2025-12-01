import { render } from '@testing-library/react';
import {
  buildStatuses,
  buildAthletes,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { statusesToIds, statusesToMap } from '@kitman/common/src/utils';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import AthleteStatusCells from '../../components/AthleteStatusCells';

describe('AthleteStatusCells Component', () => {
  beforeAll(() => {
    setI18n(i18n);
  });

  const buildBaseProps = (statusesCount = 10, dummyCellsNumber = 0) => {
    const statuses = buildStatuses(statusesCount);
    return {
      canViewGraph: false,
      groupedAthletes: {
        unavailable: buildAthletes(3),
        injured: buildAthletes(5),
        returning: buildAthletes(1),
        available: buildAthletes(2),
      },
      orderedGroup: ['unavailable', 'injured', 'returning', 'available'],
      statuses: {
        ids: statusesToIds(statuses),
        byId: statusesToMap(statuses),
      },
      dummyCellsNumber,
      t: i18nextTranslateStub(),
    };
  };

  it('renders container', () => {
    const { container } = render(<AthleteStatusCells {...buildBaseProps()} />);
    expect(container.querySelector('.athleteStatusCells')).toBeInTheDocument();
  });

  it('renders a cell row per athlete', () => {
    const props = buildBaseProps();
    const { container } = render(<AthleteStatusCells {...props} />);
    const rows = container.querySelectorAll('.athleteStatusCells__row');
    const totalAthletes = Object.values(props.groupedAthletes).reduce(
      (acc, list) => acc + list.length,
      0
    );
    expect(rows.length).toBe(totalAthletes);
  });

  it('renders a cell inside a row for every status', () => {
    const props = buildBaseProps();
    const { container } = render(<AthleteStatusCells {...props} />);
    const firstRow = container.querySelectorAll('.athleteStatusCells__row')[0];
    const cells = firstRow.querySelectorAll('.athleteStatusCells__cell');
    expect(cells.length).toBe(props.statuses.ids.length);
  });

  it('renders a break element per grouping', () => {
    const props = buildBaseProps();
    const { container } = render(<AthleteStatusCells {...props} />);
    const breaks = container.querySelectorAll('.athleteStatusCells__break');
    expect(breaks.length).toBe(Object.keys(props.groupedAthletes).length);
  });

  it('adds dummy cells when statuses are fewer than minimum', () => {
    const statusesCount = 3;
    const dummyCells = 5;
    const props = buildBaseProps(statusesCount, dummyCells);
    const { container } = render(<AthleteStatusCells {...props} />);
    const firstRow = container.querySelectorAll('.athleteStatusCells__row')[0];
    const cells = firstRow.querySelectorAll('.athleteStatusCells__cell');
    expect(cells.length).toBe(statusesCount + dummyCells);
  });
});
