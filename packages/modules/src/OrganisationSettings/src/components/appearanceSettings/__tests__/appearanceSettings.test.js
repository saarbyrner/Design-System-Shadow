import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AppearanceSettings from '../index';

// Mock child components to isolate the AppearanceSettings logic
jest.mock('../../GraphColours', () => ({
  GraphColoursTranslated: ({ fetchColours, onUpdateColours }) => (
    <div>
      <span>GraphColours Mock</span>
      <button type="button" onClick={fetchColours}>
        Fetch Colours
      </button>
      <button type="button" onClick={() => onUpdateColours(['#111', '#222'])}>
        Update Colours
      </button>
    </div>
  ),
}));

jest.mock('../../ScaleColours', () => ({
  ScaleColoursTranslated: () => <div>ScaleColours Mock</div>,
}));

describe('Organisation Settings <AppearanceSettings /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {}; // Reset flags

    baseProps = {
      nameFormattings: {
        display_name: {
          active: 1,
          options: [
            { id: 1, title: 'First name, Last name' },
            { id: 2, title: 'Last name, First name' },
          ],
        },
        shortened_name: {
          active: 1,
          options: [
            { id: 1, title: 'First name initial, Last name' },
            { id: 2, title: 'Last name' },
          ],
        },
      },
      fetchNamingSettings: jest.fn(),
      updateNameFormattings: jest.fn(),
      fetchGraphColours: jest.fn(),
      graphColourPalette: [],
      onResetGraphColours: jest.fn(),
      onUpdateGraphColourPalette: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the Branding section and GraphColours component by default', () => {
    render(<AppearanceSettings {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Branding' })
    ).toBeInTheDocument();
    expect(screen.getByText('GraphColours Mock')).toBeInTheDocument();
  });

  it('calls fetchGraphColours when the child component requests it', async () => {
    render(<AppearanceSettings {...baseProps} />);
    await user.click(screen.getByRole('button', { name: 'Fetch Colours' }));
    expect(baseProps.fetchGraphColours).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdateGraphColourPalette when a colour is changed in the child component', async () => {
    render(<AppearanceSettings {...baseProps} />);
    await user.click(screen.getByRole('button', { name: 'Update Colours' }));
    expect(baseProps.onUpdateGraphColourPalette).toHaveBeenCalledWith([
      '#111',
      '#222',
    ]);
  });

  describe('when the scales-colours feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['scales-colours'] = true;
    });

    it('shows the ScaleColours widget', () => {
      render(<AppearanceSettings {...baseProps} />);
      expect(screen.getByText('ScaleColours Mock')).toBeInTheDocument();
    });
  });

  describe('when the athlete-name-display-settings feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['athlete-name-display-settings'] = true;
    });

    it('renders both Naming and Branding sections', () => {
      render(<AppearanceSettings {...baseProps} />);
      expect(
        screen.getByRole('heading', { name: 'Naming' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Branding' })
      ).toBeInTheDocument();
    });

    it('renders dropdowns with the correct default values', () => {
      render(<AppearanceSettings {...baseProps} />);
      // The Dropdown component renders a button with the selected value's text
      expect(
        screen.getByRole('button', { name: 'First name, Last name' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'First name initial, Last name' })
      ).toBeInTheDocument();
    });

    it('calls updateNameFormattings when the user selects a different option', async () => {
      render(<AppearanceSettings {...baseProps} />);

      // Change the "Display name" dropdown
      const displayNameDropdown = screen
        .getByText('Display name')
        .closest('button');
      await user.click(displayNameDropdown);
      await user.click(await screen.findByText('Last name, First name'));

      // The useEffect hook should trigger the callback
      await waitFor(() => {
        expect(baseProps.updateNameFormattings).toHaveBeenCalledTimes(1);
      });
      expect(baseProps.updateNameFormattings).toHaveBeenCalledWith({
        displayNameId: 2,
        shortenedNameId: 1, // initial value
      });

      // Change the "Shortened name" dropdown
      const shortenedNameDropdown = screen
        .getByText('Shortened name')
        .closest('button');
      await user.click(shortenedNameDropdown);
      await user.click(await screen.findByText('Last name'));

      await waitFor(() => {
        expect(baseProps.updateNameFormattings).toHaveBeenCalledTimes(2);
      });
      expect(baseProps.updateNameFormattings).toHaveBeenCalledWith({
        displayNameId: 2, // previous value
        shortenedNameId: 2,
      });
    });
  });
});
