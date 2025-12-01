import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '../../../../TemplateDashboards/testUtils';
import EmptyState from '..';

const props = {
  t: i18nextTranslateStub(),
  icon: 'icon-column-graph',
  title: 'No data available',
  infoMessage: 'Apply some filters to render your report',
};

describe('TemplateDashboards|EmptyState', () => {
  it('renders data correctly', () => {
    render(<EmptyState {...props} />);

    expect(screen.queryByRole('button')).toHaveClass('icon-column-graph');
    expect(screen.queryByText('No data available')).toBeInTheDocument();
    expect(
      screen.queryByText('Apply some filters to render your report')
    ).toBeInTheDocument();
  });

  it('reload to have been called', async () => {
    const updatedProps = {
      ...props,
      actionButtonText: 'Reload',
      onActionButtonClick: jest.fn(),
    };
    const { queryByText } = render(<EmptyState {...updatedProps} />);
    const user = userEvent.setup();

    await user.click(queryByText('Reload'));

    expect(updatedProps.onActionButtonClick).toHaveBeenCalledTimes(1);
  });
});
