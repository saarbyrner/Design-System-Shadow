import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import Issue from '../Issue';

setI18n(i18n);

jest.mock('@kitman/modules/src/Medical/shared/utils', () => ({
  getIssueTypePath: jest.fn((issueType) => {
    if (issueType?.toLowerCase() === 'illness') return 'illnesses';
    return 'injuries';
  }),
}));

describe('Issue', () => {
  const defaultProps = {
    athleteId: '123',
    openIssue: {
      id: 1,
      name: 'Ankle Sprain',
      status: 'Active',
      issue_type: 'Injury',
      causing_unavailability: true,
    },
    issueAvailability: 'unavailable',
    canViewAvailabilities: true,
    t: i18nextTranslateStub(),
  };

  it('should render correctly', () => {
    render(<Issue {...defaultProps} />);

    expect(screen.getByText('Ankle Sprain')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Ankle Sprain' });
    expect(link).toHaveAttribute('href', '/medical/athletes/123/injuries/1');
  });

  it('should render correct link for illness issue type', () => {
    const props = {
      ...defaultProps,
      openIssue: {
        ...defaultProps.openIssue,
        issue_type: 'Illness',
        name: 'Common Cold',
      },
    };

    render(<Issue {...props} />);

    const link = screen.getByRole('link', { name: 'Common Cold' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/medical/athletes/123/illnesses/1');
  });

  it('should handle available issue availability', () => {
    const props = {
      ...defaultProps,
      issueAvailability: 'available',
      openIssue: {
        ...defaultProps.openIssue,
        causing_unavailability: false,
      },
    };

    render(<Issue {...props} />);

    const marker = screen.getByTestId('availability-marker-available');
    expect(marker).toBeInTheDocument();
  });
});
