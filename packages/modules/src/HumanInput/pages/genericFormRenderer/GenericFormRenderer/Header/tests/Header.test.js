import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import Header from '../index';

describe('<Header/>', () => {
  it('should render header title correctly', () => {
    const props = {
      title: 'Test Form Title',
      handleBack: jest.fn(),
    };

    renderWithProviders(<Header {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
  });

  it('should call handleBack when back button is clicked', async () => {
    const props = {
      title: 'Test Form',
      handleBack: jest.fn(),
    };

    renderWithProviders(<Header {...props} />);

    // icon button has no name
    const backButton = screen.getByRole('button', { name: '' });
    await userEvent.click(backButton);

    expect(props.handleBack).toHaveBeenCalled();
  });

  it('should render action buttons when provided', () => {
    const TestButton = () => <button type="button">Test Action</button>;
    const props = {
      title: 'Test Form',
      handleBack: jest.fn(),
      actionButtons: [<TestButton key="1" />],
    };

    renderWithProviders(<Header {...props} />);

    expect(
      screen.getByRole('button', { name: /test action/i })
    ).toBeInTheDocument();
  });

  it('should not render action buttons when not provided', () => {
    const props = {
      title: 'Test Form',
      handleBack: jest.fn(),
    };

    renderWithProviders(<Header {...props} />);

    expect(
      screen.queryByRole('button', { name: /test action/i })
    ).not.toBeInTheDocument();
  });

  it('should render athlete name with title', () => {
    const TestButton = () => <button type="button">Test Action</button>;
    const props = {
      title: 'Test Form',
      athlete: {
        firstname: 'John',
        lastname: 'Doe',
      },
      handleBack: jest.fn(),
      actionButtons: [<TestButton key="1" />],
    };

    renderWithProviders(<Header {...props} />);

    const headerTitle = `${props.title} - ${props.athlete.firstname} ${props.athlete.lastname}`;
    expect(screen.getByText(headerTitle)).toBeInTheDocument();
  });

  describe('Autosave Status', () => {
    it('should render AutosaveStatus when isAutosaveEnabled is true', () => {
      const props = {
        title: 'Test Form',
        handleBack: jest.fn(),
        isAutosaveEnabled: true,
        isAutosaving: true,
      };

      renderWithProviders(<Header {...props} />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should not render AutosaveStatus when isAutosaveEnabled is false', () => {
      const props = {
        title: 'Test Form',
        handleBack: jest.fn(),
        isAutosaveEnabled: false,
        isAutosaving: true,
      };

      renderWithProviders(<Header {...props} />);

      expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    });

    it('should not render AutosaveStatus when isAutosaveEnabled is not provided', () => {
      const props = {
        title: 'Test Form',
        handleBack: jest.fn(),
        isAutosaving: true,
      };

      renderWithProviders(<Header {...props} />);

      expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    });
  });
});
