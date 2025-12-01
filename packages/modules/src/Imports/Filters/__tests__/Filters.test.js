import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Filters from '..';

describe('<Filters />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  const renderTestComponent = (props) =>
    render(<Filters {...{ ...defaultProps, ...props }} />);

  it('renders the correct content', () => {
    renderTestComponent();

    const desktopComponent = screen.getByTestId('Filters|DesktopFilters');
    const mobileComponent = screen.getByTestId('Filters|MobileFilters');

    // Filter fields
    expect(
      within(desktopComponent).getByText(/Import Type/i)
    ).toBeInTheDocument();
    expect(within(desktopComponent).getByText(/Status/i)).toBeInTheDocument();
    expect(
      within(mobileComponent).getByText(/Import Type/i)
    ).toBeInTheDocument();
    expect(within(mobileComponent).getByText(/Status/i)).toBeInTheDocument();
  });
});
