import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Controls from '../../components/Controls';
import { formatSquadOptions } from '../../utils';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetActiveSquadQuery: jest.fn(),
}));

describe('Controls', () => {
  const currentSquad = mockSquads[2];

  const props = {
    templateName: 'Template 1',
    searchTerm: 'Search term',
    setFilter: jest.fn(),
    clearFilter: jest.fn(),
    groupBy: 'positionGroup',
    setGroupBy: jest.fn(),
    setPlatform: jest.fn(),
    platformOptions: [
      { name: 'MSK', value: 'msk' },
      { name: 'Well-being', value: 'wellbeing' },
    ],
    platform: 'wellbeing',
    selectedSquad: mockSquads[0].name,
    showWarningMessage: false,
    setShowWarningMessage: jest.fn(),
    squadOptions: formatSquadOptions(mockSquads),
    setSquadFilter: jest.fn(),
    isMassInput: false,
    setMassInput: jest.fn(),
    setSquadFilterLocalState: jest.fn(),
    localSquadFilter: mockSquads[1].name,
    t: i18nextTranslateStub(),
  };

  const radioListText = 'Filter Form By';
  const showWarningMessageText = 'Show Warning Message:';

  beforeEach(() => {
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        ...currentSquad,
        owner_id: 1234,
      },
      isSuccess: true,
    });
  });
  it('renders the component properly', async () => {
    renderWithRedux(<Controls {...props} />, {
      preloadedState: storeFake,
      useGlobalStore: false,
    });

    // toggle switch
    expect(await screen.findByText('Mass Input:')).toBeInTheDocument();

    // warning message toggle should not be rendered without the FF
    expect(screen.queryByText(showWarningMessageText)).not.toBeInTheDocument();

    // search for an athlete
    const searchBox = screen.getByRole('searchbox');
    expect(searchBox).toBeInTheDocument();
    expect(searchBox).toHaveValue(props.searchTerm);

    // squad selection
    expect(screen.getByDisplayValue(props.selectedSquad)).toBeInTheDocument();
    expect(
      screen.queryByDisplayValue(props.localSquadFilter)
    ).not.toBeInTheDocument();

    // platform options
    expect(screen.getByText(radioListText)).toBeInTheDocument();

    // template name
    expect(screen.getByText(props.templateName)).toBeInTheDocument();

    // link back to the list
    const linkElement = screen.getByText('Back to the list', { exact: false });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(
      'href',
      '/settings/questionnaire_templates'
    );

    // without FF
    expect(props.setSquadFilter).not.toHaveBeenCalledWith(currentSquad.id);
  });

  it('renders the Group By dropdown (and not the squad one) when there are not enough squad options', async () => {
    renderWithRedux(<Controls {...props} squadOptions={[]} />, {
      preloadedState: storeFake,
      useGlobalStore: false,
    });

    expect(await screen.findByText('Group By')).toBeInTheDocument();
    expect(screen.queryByText(props.selectedSquad)).not.toBeInTheDocument();
  });

  it('does not render the platform options radio list when there is just platform options', async () => {
    renderWithRedux(
      <Controls
        {...props}
        platformOptions={props.platformOptions.slice(0, 1)}
      />,
      {
        preloadedState: storeFake,
        useGlobalStore: false,
      }
    );

    await waitFor(() => {
      expect(screen.queryByText(radioListText)).not.toBeInTheDocument();
    });
  });

  describe('with the manage-forms-default-to-current-squad FF on', () => {
    beforeEach(() => {
      window.featureFlags['manage-forms-default-to-current-squad'] = true;
    });
    afterEach(() => {
      window.featureFlags['manage-forms-default-to-current-squad'] = false;
    });

    it('should set the squad filter to be the user current squad with FF on', async () => {
      renderWithRedux(<Controls {...props} />, {
        preloadedState: storeFake,
        useGlobalStore: false,
      });
      expect(
        screen.getByDisplayValue(props.localSquadFilter)
      ).toBeInTheDocument();
      expect(
        screen.queryByDisplayValue(props.selectedSquad)
      ).not.toBeInTheDocument();
      await waitFor(() => {
        expect(props.setSquadFilter).toHaveBeenCalledWith(currentSquad.id);
      });
    });

    it('should call setSquadFilterLocalState when selecting a squad', async () => {
      const user = userEvent.setup();
      const chosenSquad = mockSquads[2];

      renderWithRedux(<Controls {...props} />, {
        preloadedState: storeFake,
        useGlobalStore: false,
      });

      await user.click(screen.getByDisplayValue(props.localSquadFilter));
      await user.click(screen.getByText(chosenSquad.name));

      expect(props.setSquadFilter).toHaveBeenCalledWith(chosenSquad.id);
      expect(props.setSquadFilterLocalState).toHaveBeenCalledWith(
        chosenSquad.id
      );
    });
  });

  it('should call setSquadFilter when selecting a squad', async () => {
    const user = userEvent.setup();
    const chosenSquad = mockSquads[2];

    renderWithRedux(<Controls {...props} />, {
      preloadedState: storeFake,
      useGlobalStore: false,
    });

    await user.click(screen.getByDisplayValue(props.selectedSquad));
    await user.click(screen.getByText(chosenSquad.name));

    expect(props.setSquadFilter).toHaveBeenCalledWith(chosenSquad.id);
  });

  describe('with the warning-answer FF on', () => {
    beforeEach(() => {
      window.featureFlags['warning-answer'] = true;
    });
    afterEach(() => {
      window.featureFlags['warning-answer'] = false;
    });

    it('shows the show warning message toggle', async () => {
      renderWithRedux(<Controls {...props} />, {
        preloadedState: storeFake,
        useGlobalStore: false,
      });
      expect(
        await screen.findByText(showWarningMessageText)
      ).toBeInTheDocument();
    });
  });
});
