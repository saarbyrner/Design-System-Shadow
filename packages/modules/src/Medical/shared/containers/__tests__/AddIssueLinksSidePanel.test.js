import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AddIssueLinksSidePanel from '../AddIssueLinksSidePanel';

describe('AddIssueLinksSidePanel', () => {
  let component;
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const componentRender = (isOpen) =>
    render(
      <AddIssueLinksSidePanel
        isOpen={isOpen}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

  beforeEach(() => {
    i18nextTranslateStub();
    jest.resetAllMocks();
  });

  describe('initial render', () => {
    beforeEach(() => {
      component = componentRender(true);
    });

    it('Executes the on save process when a link is added and saved', async () => {
      await userEvent.type(component.getByLabelText('Title'), 'Test Link');
      await userEvent.type(component.getByLabelText('Link'), 'TestLink.com');
      await userEvent.click(component.getByText('Add'));
      await userEvent.click(component.getByText('Save'));
      expect(mockOnSave).toHaveBeenCalledWith('attached_links', [
        { title: 'Test Link', uri: 'TestLink.com' },
      ]);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('removing a link and saving updates the save with one less', async () => {
      await userEvent.type(component.getByLabelText('Title'), 'Test Link');
      await userEvent.type(component.getByLabelText('Link'), 'TestLink.com');
      await userEvent.click(component.getByText('Add'));
      await userEvent.type(component.getByLabelText('Title'), 'Test Link 2');
      await userEvent.type(component.getByLabelText('Link'), 'TestLink2.com');
      await userEvent.click(component.getByText('Add'));
      await userEvent.click(component.getAllByRole('button')[2]);
      await userEvent.click(component.getByText('Save'));
      expect(mockOnSave).toHaveBeenCalledWith('attached_links', [
        { title: 'Test Link 2', uri: 'TestLink2.com' },
      ]);
    });

    it('closing the panel reset and calls on close', async () => {
      await userEvent.click(
        component.getByTestId('sliding-panel|close-button')
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
