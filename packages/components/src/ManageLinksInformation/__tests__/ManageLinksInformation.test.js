import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ManageLinksInformation from '../index';

describe('ManageLinksInformation', () => {
  let component;
  const mockOnRemove = jest.fn();
  const mockOnAddLink = jest.fn();
  const mockOnRemoveLink = jest.fn();
  const mockResetLinks = jest.fn();
  const mockEmptyCurrentLinks = [];
  const mockCurrentLinks = [
    { title: 'test site', uri: 'testSite.com' },
    { title: 'example test', uri: 'exampleTest.com' },
  ];

  const componentRender = (links) =>
    render(
      <ManageLinksInformation
        visibleHeader
        onRemove={mockOnRemove}
        currentLinks={links}
        onAddLink={mockOnAddLink}
        onRemoveLink={mockOnRemoveLink}
        resetLinks={mockResetLinks}
        t={(key) => key}
      />
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('initial render', () => {
    beforeEach(() => {
      component = componentRender(mockEmptyCurrentLinks);
    });

    it('renders the header area', () => {
      expect(component.getByText('Links')).toBeInTheDocument();
    });

    it('adding a valid link calls onAddLink when submitted', async () => {
      await userEvent.type(component.getByLabelText('Title'), 'Test Link');
      await userEvent.type(component.getByLabelText('Link'), 'TestLink.com');
      await userEvent.click(component.getByText('Add'));
      expect(mockOnAddLink).toHaveBeenCalledWith([
        { title: 'Test Link', uri: 'TestLink.com' },
      ]);
    });

    it('does not submit if the uri is invalid', async () => {
      await userEvent.type(component.getByLabelText('Title'), 'Test Link');
      await userEvent.type(component.getByLabelText('Link'), 'TestLink com');
      await userEvent.click(component.getByText('Add'));
      expect(mockOnAddLink).not.toHaveBeenCalled();
    });

    it('calls onRemove and resetLinks if the section bin icon is clicked', async () => {
      await userEvent.click(component.getAllByRole('button')[0]);
      expect(mockOnRemove).toHaveBeenCalled();
      expect(mockResetLinks).toHaveBeenCalled();
    });
  });

  describe('render with currentLinks populated', () => {
    beforeEach(() => {
      component = componentRender(mockCurrentLinks);
    });

    it('clicking the bin of an existing link causes it to call onRemoveLink', async () => {
      await userEvent.click(component.getAllByRole('button')[2]);
      expect(mockOnRemoveLink).toHaveBeenCalledWith({
        title: 'test site',
        uri: 'testSite.com',
      });
    });
  });
});
