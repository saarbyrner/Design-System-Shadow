import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ActivateButtonContainer from '../../containers/ActivateButton';
import * as templateActions from '../../actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../actions');

describe('Questionnaire Templates <ActivateButton /> Container', () => {
  let user;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks(); // Clear mocks before each test
    window.featureFlags = {};

    // A typical state shape for the templates module
    preloadedState = {
      templates: {
        1: { id: '1', active: false },
        4: { id: '4', active: false },
        7: { id: '7', active: true },
      },
      dialogues: {
        activate: { isVisible: false, templateId: null },
      },
    };
  });

  it('renders an inactive button correctly based on props', () => {
    renderWithRedux(
      <ActivateButtonContainer templateId="1" isActive={false} />,
      {
        useGlobalStore: false,
        preloadedState,
      }
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('icon-tick'); // Inactive class
    expect(button).not.toHaveClass('icon-tick-active');
  });

  it('renders an active button correctly based on props', () => {
    renderWithRedux(<ActivateButtonContainer templateId="7" isActive />, {
      useGlobalStore: false,
      preloadedState,
    });

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('icon-tick-active'); // Active class
  });

  it('is disabled when it is the only active template', () => {
    // The initial preloadedState has only one active template (id: '7')
    renderWithRedux(<ActivateButtonContainer templateId="7" isActive />, {
      useGlobalStore: false,
      preloadedState,
    });

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'questionnaireTemplates__activateButton--disabled'
    );
  });

  it('is NOT disabled when it is active but not the only one', () => {
    // Add another active template to the state
    preloadedState.templates['4'].active = true;

    renderWithRedux(<ActivateButtonContainer templateId="7" isActive />, {
      useGlobalStore: false,
      preloadedState,
    });

    const button = screen.getByRole('button');

    expect(button).toBeEnabled();
  });

  describe('when athlete-forms-list FF is OFF (default behavior)', () => {
    it('dispatches showActivateDialogue when an inactive button is clicked', async () => {
      renderWithRedux(
        <ActivateButtonContainer templateId="1" isActive={false} />,
        {
          useGlobalStore: false,
          preloadedState,
        }
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // When FF is off, activating shows a confirmation dialogue
      expect(templateActions.showActivateDialogue).toHaveBeenCalledTimes(1);
      expect(templateActions.showActivateDialogue).toHaveBeenCalledWith('1');
    });

    it('does NOT dispatch any action when an active button is clicked', async () => {
      preloadedState.templates['4'].active = true; // Make sure it's not disabled
      renderWithRedux(<ActivateButtonContainer templateId="7" isActive />, {
        useGlobalStore: false,
        preloadedState,
      });

      const button = screen.getByRole('button');
      await user.click(button);

      // When FF is off, clicking an active button does nothing
      expect(templateActions.deactivateTemplateRequest).not.toHaveBeenCalled();
      expect(templateActions.showActivateDialogue).not.toHaveBeenCalled();
    });
  });

  describe('when athlete-forms-list FF is ON', () => {
    beforeEach(() => {
      window.featureFlags['athlete-forms-list'] = true;
    });

    it('dispatches activateTemplateRequest when an inactive button is clicked', async () => {
      renderWithRedux(
        <ActivateButtonContainer templateId="1" isActive={false} />,
        {
          useGlobalStore: false,
          preloadedState,
        }
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // When FF is on, it directly calls the request
      expect(templateActions.activateTemplateRequest).toHaveBeenCalledTimes(1);
      expect(templateActions.activateTemplateRequest).toHaveBeenCalledWith('1');
    });

    it('dispatches deactivateTemplateRequest when an active (but not only active) button is clicked', async () => {
      // Add another active template to the state so the button is not disabled
      preloadedState.templates['4'].active = true;

      renderWithRedux(<ActivateButtonContainer templateId="7" isActive />, {
        useGlobalStore: false,
        preloadedState,
      });

      const button = screen.getByRole('button');
      await user.click(button);

      // When FF is on, deactivating directly calls the request
      expect(templateActions.deactivateTemplateRequest).toHaveBeenCalledTimes(
        1
      );
      expect(templateActions.deactivateTemplateRequest).toHaveBeenCalledWith(
        '7'
      );
    });
  });
});
