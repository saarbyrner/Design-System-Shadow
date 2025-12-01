import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { data as mockData } from '@kitman/modules/src/AdditionalUsers/shared/redux/services/mocks/data/mock_additional_users_list';

import buildCellContent from '../cellBuilder';

const mockPermissions = {
  permissions: {
    settings: {
      canCreateImports: true,
      canManageOfficials: true,
      canManageScouts: true,
      canManageMatchDirectors: true,
      canManageMatchMonitors: true,
    },
  },
};

describe('buildCellContent', () => {
  it('renders the fullname', () => {
    render(
      buildCellContent({ row_key: 'fullname' }, mockData[0], mockPermissions)
    );
    expect(screen.getByText(mockData[0].fullname)).toBeInTheDocument();
  });

  it('renders the username', () => {
    render(
      buildCellContent({ row_key: 'username' }, mockData[0], mockPermissions)
    );
    expect(screen.getByText(mockData[0].username)).toBeInTheDocument();
  });

  it('renders the email', () => {
    render(
      buildCellContent({ row_key: 'email' }, mockData[0], mockPermissions)
    );
    expect(screen.getByText(mockData[0].email)).toBeInTheDocument();
  });

  it('renders the type', () => {
    render(buildCellContent({ row_key: 'type' }, mockData[0], mockPermissions));
    expect(screen.getByText(mockData[0].type)).toBeInTheDocument();
  });

  it('renders the created_at', () => {
    render(
      buildCellContent({ row_key: 'created_at' }, mockData[0], mockPermissions)
    );
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
