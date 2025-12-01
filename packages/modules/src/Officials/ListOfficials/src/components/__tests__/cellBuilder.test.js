import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import buildCellContent from '../cellBuilder';
import { data } from '../../../../shared/redux/services/mocks/data/mock_official_list';

describe('buildCellContent', () => {
  it('renders an LinkCell fullname', () => {
    render(buildCellContent({ row_key: 'fullname' }, data[0]));
    expect(screen.getByText(data[0].fullname)).toBeInTheDocument();
  });

  it('renders the username', () => {
    render(buildCellContent({ row_key: 'username' }, data[0]));
    expect(screen.getByText(data[0].username)).toBeInTheDocument();
  });
  it('renders the email', () => {
    render(buildCellContent({ row_key: 'email' }, data[0]));
    expect(screen.getByText(data[0].email)).toBeInTheDocument();
  });

  it('renders the created_at', () => {
    render(buildCellContent({ row_key: 'created_at' }, data[0]));
    expect(
      screen.getByText(
        formatStandard({
          date: moment(data[0].created_at),
          displayLongDate: true,
        })
      )
    ).toBeInTheDocument();
  });
});
