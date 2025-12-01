import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import {
  STATUS,
  CONNECTION_ERROR,
} from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';
import DashboardStatus from '..';

describe('<DashboardStatus/>', () => {
  const renderComponent = (status) =>
    render(<DashboardStatus t={i18nextTranslateStub()} status={status} />);

  it('renders loading feedback', () => {
    renderComponent(STATUS.LOADING);
    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  it('renders connection error message', () => {
    renderComponent(STATUS.CONNECTION_ERROR);
    expect(screen.getByText(CONNECTION_ERROR)).toBeInTheDocument();
  });

  it('does not renders data message when status is done', () => {
    renderComponent(STATUS.DONE);
    expect(
      screen.queryByTestId('DelayedLoadingFeedback')
    ).not.toBeInTheDocument();
    expect(screen.queryByText(CONNECTION_ERROR)).not.toBeInTheDocument();
  });
});
