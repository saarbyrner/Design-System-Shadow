import { waitFor, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import userEvent from '@testing-library/user-event';
import {
  data as GROUP_DATA,
  dataById as GROUP_DATA_BY_ID,
} from '@kitman/services/src/mocks/handlers/analysis/groups';
import GroupSelector from '..';

describe('<GroupSelector />', () => {
  const i18nT = i18nextTranslateStub();
  const mockProps = {
    t: i18nT,
    groups: GROUP_DATA,
  };

  test('renders GroupSelector', () => {
    renderWithStore(<GroupSelector {...mockProps} />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  const navigateToAthleteList = async (groupIndex) => {
    const user = userEvent.setup();

    const renderedComponent = renderWithStore(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 1000, itemHeight: 40 }}
      >
        <GroupSelector {...mockProps} />
      </VirtuosoMockContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const group = GROUP_DATA[groupIndex];

    await user.click(screen.getByText(group.name));

    const athleteData = GROUP_DATA_BY_ID[group.id];

    return { user, renderedComponent, group, athleteData };
  };

  describe('for group list', () => {
    it('renders the list of items from the api', async () => {
      renderWithStore(<GroupSelector {...mockProps} />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      GROUP_DATA.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it('renders a list of athletes in a grouping when clicking a group', async () => {
      const { athleteData } = await navigateToAthleteList(1);

      athleteData.athletes.forEach(({ fullname }) => {
        expect(screen.getByText(fullname)).toBeInTheDocument();
      });
    });

    it('navigates back to the group list when clicking the back button', async () => {
      const { user } = await navigateToAthleteList(0);

      const backButton = screen.getByRole('button', {
        name: /back/i,
      });

      expect(backButton).toBeInTheDocument();

      await user.click(backButton);

      GROUP_DATA.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it('renders an empty state when no groups are present', async () => {
      renderWithStore(<GroupSelector {...mockProps} groups={[]} />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText(/No Groups created./i)).toBeInTheDocument();

      const link = screen.getByRole('link', {
        name: /Groups section/i,
      });

      expect(link).toHaveAttribute('href', '/administration/groups');
    });
  });

  describe('when searching', () => {
    it('searches groups', async () => {
      const user = userEvent.setup();

      renderWithStore(<GroupSelector {...mockProps} />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('Search'), '1');

      expect(screen.queryByText('Group 1')).toBeInTheDocument();
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Group 3')).not.toBeInTheDocument();
    });

    it('searches athletes', async () => {
      const { user } = await navigateToAthleteList(1);

      await user.type(screen.getByPlaceholderText('Search'), 'AJ');

      expect(screen.queryByText('AJ McClune')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });

    it('clears the search bar when transitioning between lists', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 40 }}
        >
          <GroupSelector {...mockProps} />
        </VirtuosoMockContext.Provider>
      );

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('Search'), '2');

      // checking the display value was correct
      expect(screen.getByPlaceholderText('Search')).toHaveDisplayValue('2');

      // Navigating into the searched group
      await user.click(screen.getByText('Group 2'));

      // this should be cleared
      expect(screen.getByPlaceholderText('Search')).toHaveDisplayValue('');

      // searching again
      await user.type(screen.getByPlaceholderText('Search'), 'abc 123');

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
