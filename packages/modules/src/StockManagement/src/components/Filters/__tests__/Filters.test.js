import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Filters from '..';

describe('<StockManagementFilters />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    isDisabled: false,
    onUpdateFilters: jest.fn(),
    filters: {},
  };

  afterEach(() => {
    window.featureflags = {};
  });

  const renderTestComponent = (props) =>
    render(<Filters {...{ ...defaultProps, ...props }} />);

  it('renders the correct content', () => {
    renderTestComponent();

    const desktopComponent = screen.getByTestId(
      'StockManagementFilters|DesktopFilters'
    );
    const mobileComponent = screen.getByTestId(
      'StockManagementFilters|MobileFilters'
    );

    // Filter fields
    expect(
      within(desktopComponent).getByPlaceholderText(/Search/i)
    ).toBeInTheDocument();
    expect(
      within(desktopComponent).getByText(/Expiration Date/i)
    ).toBeInTheDocument();
    expect(
      within(desktopComponent).getByLabelText(/In stock only/i)
    ).toBeInTheDocument();
    expect(
      within(mobileComponent).getByPlaceholderText(/Search/i)
    ).toBeInTheDocument();
    expect(
      within(mobileComponent).getByText(/Expiration Date/i)
    ).toBeInTheDocument();
    expect(
      within(mobileComponent).getByLabelText(/In stock only/i)
    ).toBeInTheDocument();
  });
});
