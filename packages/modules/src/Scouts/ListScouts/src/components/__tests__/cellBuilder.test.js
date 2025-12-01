import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import buildCellContent from '../cellBuilder';
import { data as mockData } from '../../../../shared/redux/services/mocks/data/mock_scout_list';

describe('buildCellContent', () => {
  it('renders an LinkCell fullname', () => {
    render(buildCellContent({ row_key: 'fullname' }, mockData[0]));
    expect(screen.getByText(mockData[0].fullname)).toBeInTheDocument();
  });

  it('renders the username', () => {
    render(buildCellContent({ row_key: 'username' }, mockData[0]));
    expect(screen.getByText(mockData[0].username)).toBeInTheDocument();
  });
  it('renders the email', () => {
    render(buildCellContent({ row_key: 'email' }, mockData[0]));
    expect(screen.getByText(mockData[0].email)).toBeInTheDocument();
  });

  it('renders the created_at', () => {
    render(buildCellContent({ row_key: 'created_at' }, mockData[0]));
    expect(
      screen.getByText(
        formatStandard({
          date: moment(mockData[0].created_at),
          displayLongDate: true,
        })
      )
    ).toBeInTheDocument();
  });
});
