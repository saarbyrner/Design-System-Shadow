import { render, screen } from '@testing-library/react';
import {
  FALLBACK_DASH,
  DISCIPLINARY_STATUS_VALUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import { ABOUT_THREE_FIDDY } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import {
  formatAvatarCell,
  formatCurrencyCell,
  formatAddressCell,
  formatRegistrationStatusCell,
  formatDesignationCell,
  formatLinkCell,
  formatActionableCell,
  formatDisciplinaryStatusCell,
  formatLabelStatusCell,
} from '..';

describe('cells', () => {
  it('returns the correct cell for formatAvatarCell', () => {
    const items = [
      {
        text: 'Cell',
        avatar_src: 'some/url',
        href: 'some/resource',
      },
    ];
    render(<>{formatAvatarCell(items)}</>);
    expect(screen.getByText(/Cell/)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', items[0].href);
    expect(screen.getByRole('img')).toHaveAttribute('src', items[0].avatar_src);
  });
  it('returns the correct cell for formatAvatarCell with n0 href', () => {
    const items = [
      {
        text: 'Cell',
        avatar_src: 'some/url',
      },
    ];
    render(<>{formatAvatarCell(items)}</>);
    expect(screen.getByText(/Cell/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', items[0].avatar_src);
  });
  it('returns the correct cell for formatAvatarCell when we have multiple', () => {
    const items = [
      {
        id: 1,
        text: 'Cell 1',
        avatar_src: 'some/url/1',
      },
      {
        id: 2,
        text: 'Cell 2',
        avatar_src: 'some/url/2',
      },
    ];
    render(<>{formatAvatarCell(items)}</>);
    expect(screen.getAllByRole('img')[0]).toHaveAttribute(
      'src',
      items[1].avatar_src
    );
    expect(screen.getAllByRole('img')[1]).toHaveAttribute(
      'src',
      items[0].avatar_src
    );
  });
  it('returns the correct cell for formatCurrencyCell', () => {
    const params = {
      currency: 'USD',
      value: 350,
      userLocale: 'en-US',
    };
    render(<>{formatCurrencyCell({ ...params })}</>);
    expect(screen.getByText(ABOUT_THREE_FIDDY)).toBeInTheDocument();
  });
  it('returns the correct cell for formatCurrencyCell with no userLocale', () => {
    const params = {
      currency: 'USD',
      value: 350,
    };
    render(<>{formatCurrencyCell({ ...params })}</>);
    expect(screen.getByText('US$350.00')).toBeInTheDocument();
  });
  it('returns the correct cell for formatAddressCell', () => {
    const params = {
      address: ['123', 'Fake', 'Street'],
    };
    render(<>{formatAddressCell({ ...params })}</>);
    expect(screen.getByText('123 Fake Street')).toBeInTheDocument();
  });
  it('returns the correct cell for formatAddressCell with no parts', () => {
    const params = {
      address: [],
    };
    render(<>{formatAddressCell({ ...params })}</>);
    expect(screen.getByText(FALLBACK_DASH)).toBeInTheDocument();
  });
  it('returns the correct cell for formatRegistrationStatusCell', () => {
    const params = {
      registrationStatus: 'incomplete',
      withTooltip: false,
    };
    render(<>{formatRegistrationStatusCell({ ...params })}</>);
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
  });

  it('returns the correct cell for formatRegistrationStatusCell with registrationSystemStatus', () => {
    const params = {
      registrationStatus: 'incomplete',
      registrationSystemStatus: {
        id: 1,
        name: 'Incomplete',
        type: 'incomplete',
      },
      useRegistrationSystemStatus: true,
      withTooltip: false,
    };
    render(<>{formatRegistrationStatusCell({ ...params })}</>);
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
  });

  it('returns the correct cell for formatDesignationCell', () => {
    const params = {
      designation: 'primary',
    };
    render(<>{formatDesignationCell({ ...params })}</>);
    expect(screen.getByText('P')).toBeInTheDocument();
  });
  it('returns the correct cell for formatLinkCell', () => {
    const params = {
      text: 'primary',
      href: 'some/url/2',
    };
    render(<>{formatLinkCell({ ...params })}</>);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'some/url/2');
    expect(screen.getByRole('link')).toHaveTextContent('primary');
  });
  it('returns the correct cell for formatActionableCell when not isActionable', () => {
    const params = {
      text: 'TEXT',
      isActionable: false,
    };
    render(<>{formatActionableCell({ ...params })}</>);
    expect(screen.getByText('TEXT')).toBeInTheDocument();
    expect(screen.getByText('TEXT')).toHaveStyle('font-weight: 400');
  });
  it('returns the correct cell for formatActionableCell when isActionable', () => {
    const params = {
      text: 'TEXT',
      isActionable: true,
    };
    render(<>{formatActionableCell({ ...params })}</>);
    expect(screen.getByText('TEXT')).toBeInTheDocument();
    expect(screen.getByText('TEXT')).toHaveStyle('font-weight: 600');
  });
  it('returns the correct cell for formatDisciplinaryStatusCell', () => {
    const params = {
      status: DISCIPLINARY_STATUS_VALUE.Eligible,
    };
    render(<>{formatDisciplinaryStatusCell({ ...params })}</>);
    expect(screen.getByText('Eligible')).toBeInTheDocument();
  });

  it('should render label chips when labels are provided', () => {
    const mockLabels = [
      { id: 1, name: 'Label 1', color: '#000' },
      { id: 2, name: 'Label 2', color: '#fff' },
    ];
    render(<>{formatLabelStatusCell({ labels: mockLabels })}</>);
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
  });
});
