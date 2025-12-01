import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import Footer from '../../components/Footer';

jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('QuestionnaireManager <Footer /> Component', () => {
  let baseProps;
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
    jest.clearAllMocks();

    baseProps = {
      saveQuestionnaire: jest.fn(),
      clearAllVisibleVariables: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders all action buttons correctly', () => {
    render(<Footer {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Clear All' })
    ).toBeInTheDocument();
  });

  it('calls the saveQuestionnaire prop when the Save button is clicked', async () => {
    const user = userEvent.setup();

    render(<Footer {...baseProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(baseProps.saveQuestionnaire).toHaveBeenCalledTimes(1);
  });

  it('calls the clearAllVisibleVariables prop when the Clear All button is clicked', async () => {
    const user = userEvent.setup();

    render(<Footer {...baseProps} />);

    const clearAllButton = screen.getByRole('button', { name: 'Clear All' });

    await user.click(clearAllButton);

    expect(baseProps.clearAllVisibleVariables).toHaveBeenCalledTimes(1);
  });

  it('calls locationAssign with the correct URL when the Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<Footer {...baseProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(mockLocationAssign).toHaveBeenCalledTimes(1);
    expect(mockLocationAssign).toHaveBeenCalledWith(
      '/settings/questionnaire_templates'
    );
  });
});
