import { screen } from '@testing-library/react';
import { render } from '../../../testUtils';
import WidgetSectionHeader from '..';

const props = {
  widgetId: 'some_widget_header',
  widgetTitle: 'Some Widget Header',
};

describe('TemplateDashboards|WidgetSectionHeader', () => {
  it('renders widget header without Intercom data attribute', () => {
    const { container } = render(<WidgetSectionHeader {...props} />);

    const headerWithIntercomDataAttribute = container.querySelector(
      '[data-intercom-target="Player Care"]'
    );
    expect(headerWithIntercomDataAttribute).not.toBeInTheDocument();

    const standardHeading = screen.queryByRole('heading', {
      level: 3,
      name: 'Some Widget Header',
    });
    expect(standardHeading).toBeVisible();
  });

  it('renders widget header with Intercom data attribute', () => {
    const playerCareProps = {
      ...props,
      widgetId: 'player_care_header',
    };
    const { container } = render(<WidgetSectionHeader {...playerCareProps} />);

    const headerWithIntercomDataAttribute = container.querySelector(
      '[data-intercom-target="Player Care"]'
    );
    expect(headerWithIntercomDataAttribute).toBeInTheDocument();
  });
});
