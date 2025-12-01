import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AddLinksSidePanel from '..';

describe('AddLinksSidePanel', () => {
  let component;
  const mockOnClose = jest.fn();
  const mockResetLinks = jest.fn();
  const mockOnSave = jest.fn();

  const componentRender = () =>
    render(
      <AddLinksSidePanel
        isOpen
        onClose={mockOnClose}
        panelTitle="Test Panel Name"
        addLink={jest.fn()}
        removeLink={jest.fn()}
        currentLinks={[]}
        resetLinks={mockResetLinks}
        onSave={mockOnSave}
        t={(key) => key}
      />
    );

  beforeEach(() => {
    i18nextTranslateStub();
    jest.resetAllMocks();
  });

  describe('initial render', () => {
    beforeEach(() => {
      component = componentRender();
    });

    it('renders the panel title', () => {
      expect(component.getByText('Test Panel Name')).toBeInTheDocument();
    });

    it('fires off resetLinks and onClose when the panel is toggled', async () => {
      await userEvent.click(
        component.getByTestId('sliding-panel|close-button')
      );
      expect(mockResetLinks).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('disables the save button if there are no links', async () => {
      await userEvent.click(component.getByText('Save'));
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });
});
