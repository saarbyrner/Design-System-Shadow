import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PlanningSettingsHeader from '../PlanningSettingsHeader';

describe('<PlanningSettingsHeader />', () => {
  it('displays the correct title', () => {
    const props = {
      t: i18nextTranslateStub(),
    };

    render(<PlanningSettingsHeader {...props} />);

    // Check for the heading with the accessible name "Planning"
    expect(
      screen.getByRole('heading', { name: 'Planning' })
    ).toBeInTheDocument();
  });
});
