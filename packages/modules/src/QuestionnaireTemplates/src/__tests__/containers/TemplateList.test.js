import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { buildTemplates } from '../test_utils';

import TemplateListContainer from '../../containers/TemplateList';
import * as templateActions from '../../actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../actions');

describe('Questionnaire Templates <TemplateList /> Container', () => {
  let user;
  let preloadedState;
  const templates = buildTemplates(3);
  const templateIds = Object.keys(templates);

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks(); // Clear mocks before each test
    window.featureFlags = {};

    // Define a base preloaded state for the Redux store
    preloadedState = {
      templates,
      sorting: {
        column: 'name',
        direction: 'asc',
      },
      // Add other necessary state slices with default values
      dialogues: {
        delete: { isVisible: false, templateId: null },
        activate: { isVisible: false, templateId: null },
      },
    };
  });

  it('renders and maps state to props correctly', () => {
    renderWithRedux(<TemplateListContainer templates={templates} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Check that a template name from the state is rendered
    expect(
      screen.getByRole('link', { name: templates[templateIds[0]].name })
    ).toBeInTheDocument();
  });

  it('maps dispatch to props and calls rename when rename button is clicked', async () => {
    renderWithRedux(<TemplateListContainer templates={templates} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const firstRow = screen.getAllByRole('row')[1]; // 0 is header
    const renameButton = within(firstRow).getAllByRole('button')[1];
    await user.click(renameButton);

    expect(templateActions.showRenameModal).toHaveBeenCalledTimes(1);
    expect(templateActions.showRenameModal).toHaveBeenCalledWith(
      templates[templateIds[0]].id
    );
  });
});
