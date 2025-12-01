import { fireEvent, screen, waitFor } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import { colors } from '@kitman/common/src/variables';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import {
  data as LABEL_DATA,
  dataById as LABEL_DATA_BY_ID,
} from '@kitman/services/src/mocks/handlers/analysis/labels';
import LabelSelector from '..';

describe('<LabelSelector />', () => {
  const i18nT = i18nextTranslateStub();
  const mockProps = {
    t: i18nT,
    labels: LABEL_DATA,
  };

  test('renders LabelSelector', () => {
    renderWithStore(<LabelSelector {...mockProps} />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  const navigateToAthleteList = async (labelIndex) => {
    const user = userEvent.setup();

    const renderedComponent = renderWithStore(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 1000, itemHeight: 40 }}
      >
        <LabelSelector {...mockProps} />
      </VirtuosoMockContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const label = LABEL_DATA[labelIndex];

    await user.click(screen.getByText(label.name));

    const athleteData = LABEL_DATA_BY_ID[label.id];

    return { user, renderedComponent, label, athleteData };
  };
  describe('for label list', () => {
    it('renders the list of items from the api', async () => {
      renderWithStore(<LabelSelector {...mockProps} />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      LABEL_DATA.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByText(name)).toHaveStyle({ color: colors.white });
      });
    });

    it('renders a list of athletes in a grouping when clicking a label', async () => {
      const { athleteData } = await navigateToAthleteList(1);

      athleteData.athletes.forEach(({ fullname }) => {
        expect(screen.getByText(fullname)).toBeInTheDocument();
      });
    });

    it('navigates back to the label list when clicking the back button', async () => {
      const { user } = await navigateToAthleteList(0);

      const backButton = screen.getByRole('button', {
        name: /back/i,
      });

      expect(backButton).toBeInTheDocument();

      await user.click(backButton);

      LABEL_DATA.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it('renders an empty state when no labels are present', async () => {
      renderWithStore(<LabelSelector {...mockProps} labels={[]} />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText(/No Labels created./i)).toBeInTheDocument();

      const link = screen.getByRole('link', {
        name: /Labels section/i,
      });

      expect(link).toHaveAttribute('href', '/administration/labels/manage');
    });
  });

  describe('when searching', () => {
    it('searches labels', async () => {
      renderWithStore(<LabelSelector {...mockProps} />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Search'), {
        target: { value: 'One' },
      });

      expect(screen.queryByText('Label One')).toBeInTheDocument();
      expect(screen.queryByText('Label Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Label Three')).not.toBeInTheDocument();
    });

    it('searches athletes', async () => {
      await navigateToAthleteList(1);

      fireEvent.change(screen.getByPlaceholderText('Search'), {
        target: { value: 'AJ' },
      });

      expect(screen.queryByText('AJ McClune')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });

    it('clears the search bar when transitioning between lists', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 40 }}
        >
          <LabelSelector {...mockProps} />
        </VirtuosoMockContext.Provider>
      );

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Search'), {
        target: { value: 'Two' },
      });

      // checking the display value was correct
      expect(screen.getByPlaceholderText('Search')).toHaveDisplayValue('Two');

      // Navigating into the searched group
      await user.click(screen.getByText('Label Two'));

      // this should be cleared
      expect(screen.getByPlaceholderText('Search')).toHaveDisplayValue('');

      // searching again

      fireEvent.change(screen.getByPlaceholderText('Search'), {
        target: { value: 'abc 123' },
      });

      // checks if the search is correctly inputted
      expect(screen.getByPlaceholderText('Search')).toHaveDisplayValue(
        'abc 123'
      );

      // going back
      await user.click(
        screen.getByRole('button', {
          name: /back/i,
        })
      );

      // search should be cleared
      expect(screen.getByPlaceholderText('Search')).toHaveDisplayValue('');
    });
  });
});
