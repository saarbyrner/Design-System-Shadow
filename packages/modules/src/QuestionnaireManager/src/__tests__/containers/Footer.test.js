import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import FooterContainer from '../../containers/Footer';
import * as questionnaireActions from '../../actions';

jest.mock('../../actions');
jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('QuestionnaireManager <Footer /> Container', () => {
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    // Configure the mocked hook to return our spy function for each test
    useLocationAssign.mockReturnValue(mockLocationAssign);
    jest.clearAllMocks();
  });

  it('renders all action buttons correctly', () => {
    renderWithRedux(<FooterContainer />, { useGlobalStore: false });

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Clear All' })
    ).toBeInTheDocument();
  });

  it('maps dispatch to props and calls saveQuestionnaire when Save is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<FooterContainer />, { useGlobalStore: false });

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(questionnaireActions.saveQuestionnaire).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls showDialogue when Clear All is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<FooterContainer />, { useGlobalStore: false });

    const clearAllButton = screen.getByRole('button', { name: 'Clear All' });
    await user.click(clearAllButton);

    expect(questionnaireActions.showDialogue).toHaveBeenCalledTimes(1);
    expect(questionnaireActions.showDialogue).toHaveBeenCalledWith(
      'clear_all_warning'
    );
  });

  it('calls locationAssign with the correct URL when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<FooterContainer />, { useGlobalStore: false });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      '/settings/questionnaire_templates'
    );
  });
});
