import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { buildAthletes, buildVariables } from '../test_utils';
import Manager from '../../components/Manager';

jest.mock('../../containers/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../../containers/CheckboxCells', () => () => (
  <div>CheckboxCells</div>
));
jest.mock('../../containers/Footer', () => () => <div>Footer</div>);
jest.mock('../../containers/Header', () => () => <div>Header</div>);
jest.mock('../../containers/Controls', () => () => <div>Controls</div>);

describe('<Manager />', () => {
  let baseProps;
  let preloadedState;

  beforeEach(() => {
    baseProps = {
      variables: buildVariables(3),
      allAthletes: buildAthletes(10),
      t: i18nextTranslateStub(),
    };

    preloadedState = {
      variablePlatforms: [],
      variables: {
        selectedPlatform: 'msk',
      },
      athletes: {
        searchTerm: '',
      },
      dialogues: {
        clear_all_warning: false,
      },
      modal: {
        status: 'CLOSED',
      },
      squadOptions: {
        squads: [{}],
      },
    };
  });

  it('renders the main manager view when athletes are present', () => {
    renderWithRedux(<Manager {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Check for content from a key child component to confirm rendering
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('has the correct class when cantShowManager prop is true', () => {
    const { container } = renderWithRedux(
      <Manager {...baseProps} cantShowManager />,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );

    // Check for the presence of the modifier class on the main container
    const managerElement = container.querySelector('.questionnaireManager');

    expect(managerElement).toHaveClass('questionnaireManager--cantShowManager');
  });

  it('does not display a message when there are athletes in the selected squad', () => {
    renderWithRedux(<Manager {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The "No athletes" message should not be present
    expect(
      screen.queryByText(
        '#sport_specific__There_are_no_athletes_within_this_squad'
      )
    ).not.toBeInTheDocument();
  });

  it('displays a message when there are no athletes in the selected squad', () => {
    // Override props for this specific test case
    const propsWithNoAthletes = {
      ...baseProps,
      allAthletes: [],
    };

    renderWithRedux(<Manager {...propsWithNoAthletes} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The "No athletes" message should be visible
    expect(
      screen.getByText(
        '#sport_specific__There_are_no_athletes_within_this_squad'
      )
    ).toBeInTheDocument();

    // The main manager UI should not be rendered
    expect(screen.queryByText('Controls')).not.toBeInTheDocument();
  });
});
