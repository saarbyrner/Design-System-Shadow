import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import App from '../App';

describe('<App />', () => {
  const renderComponent = () => renderWithProviders(<App />);

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByTestId('ScoutScheduleApp')).toBeInTheDocument();
  });
});
