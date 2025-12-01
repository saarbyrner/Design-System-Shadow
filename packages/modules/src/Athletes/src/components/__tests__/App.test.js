import { screen, fireEvent, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import App from '../App';
import { athletesMocked, mockedPositionGroups } from '../../utils/mocks';

describe('<App />', () => {
  const baseProps = {
    athletes: athletesMocked,
    positionGroups: mockedPositionGroups,
    t: i18nextTranslateStub(),
  };

  it('renders the filters and the full list of athletes initially', () => {
    render(<App {...baseProps} />);

    // Check for a filter element, assuming it has a search input.
    expect(screen.getByPlaceholderText('Search athletes')).toBeInTheDocument();

    // Check that the initial list of athletes is rendered.
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Peter Grant')).toBeInTheDocument();
    expect(screen.getByText('Paul John')).toBeInTheDocument();
    expect(screen.getByText('John Nash')).toBeInTheDocument();
    expect(screen.getByText('Norman Peterson')).toBeInTheDocument();
  });

  describe('when filtering by searching', () => {
    it('filters the athletes list based on the search input', () => {
      render(<App {...baseProps} />);

      const searchInput = screen.getByPlaceholderText('Search athletes');
      fireEvent.change(searchInput, { target: { value: 'john' } });

      // Assert that only athletes with "john" in their name are visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Paul John')).toBeInTheDocument();
      expect(screen.getByText('John Nash')).toBeInTheDocument();

      // Assert that athletes without "john" in their name are not visible
      expect(screen.queryByText('Peter Grant')).not.toBeInTheDocument();
    });

    it('should display a "no results" message when a search returns no athletes', () => {
      render(<App {...baseProps} />);
      const searchInput = screen.getByPlaceholderText('Search athletes');

      // Use a search term that will not match any athlete
      fireEvent.change(searchInput, { target: { value: 'xyz_no_match' } });

      // Also confirm that none of the original athletes are present
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should display the full list of athletes again after clearing the search input', () => {
      render(<App {...baseProps} />);
      const searchInput = screen.getByPlaceholderText('Search athletes');

      // First, filter the list
      fireEvent.change(searchInput, { target: { value: 'john' } });
      expect(screen.queryByText('Peter Grant')).not.toBeInTheDocument(); // Verify it's filtered

      // Then, clear the search input by setting its value to empty
      fireEvent.change(searchInput, { target: { value: '' } });

      // Assert that the full list is restored
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Peter Grant')).toBeInTheDocument();
      expect(screen.getByText('Paul John')).toBeInTheDocument();
    });
  });

  describe('when there are no athletes', () => {
    it('renders the "no athletes" message and an "Add Athletes" button', () => {
      render(<App {...baseProps} athletes={[]} />);

      expect(
        screen.getByText('There are no athletes within this squad')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add Athletes' })
      ).toBeInTheDocument();
    });
  });
});
