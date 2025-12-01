import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LoadingOverlay from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/OpenIssues/LoadingOverlay';

setI18n(i18n);

describe('LoadingOverlay', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  it('should render correctly', () => {
    render(<LoadingOverlay {...defaultProps} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading injury details...')).toBeInTheDocument();
  });
});
