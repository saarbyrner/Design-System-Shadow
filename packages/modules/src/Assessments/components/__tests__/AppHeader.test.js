import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AppHeader from '../AppHeader';
import PermissionsContext, {
  defaultPermissions,
} from '../../contexts/PermissionsContext';

describe('AppHeader component', () => {
  const baseProps = {
    assessmentTemplates: [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ],
    onClickViewTypeTab: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    baseProps.onClickViewTypeTab.mockClear();
  });

  it('renders all tabs correctly', () => {
    render(<AppHeader {...baseProps} />);
    expect(screen.getByRole('tab', { name: 'Athlete' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Group' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Templates' })).toBeInTheDocument();
  });

  describe('when clicking tabs', () => {
    it('calls props.onClickViewTypeTab with the correct view', async () => {
      const user = userEvent.setup();
      render(<AppHeader {...baseProps} />);

      await user.click(screen.getByRole('tab', { name: 'Group' }));
      expect(baseProps.onClickViewTypeTab).toHaveBeenCalledWith('GRID');

      await user.click(screen.getByRole('tab', { name: 'Templates' }));
      expect(baseProps.onClickViewTypeTab).toHaveBeenCalledWith('TEMPLATE');

      await user.click(screen.getByRole('tab', { name: 'Athlete' }));
      expect(baseProps.onClickViewTypeTab).toHaveBeenCalledWith('LIST');
    });
  });

  describe('when the squad has no templates', () => {
    it('does not render the templates tab', () => {
      render(<AppHeader {...baseProps} assessmentTemplates={[]} />);
      expect(
        screen.queryByRole('tab', { name: 'Templates' })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Athlete' })).toBeInTheDocument();
    });
  });

  describe('When the user does not have the manage template permission', () => {
    it('does not render the templates tab', () => {
      const customPermissions = {
        ...defaultPermissions,
        manageAssessmentTemplate: false,
      };

      render(<AppHeader {...baseProps} />, {
        wrapper: ({ children }) => (
          <PermissionsContext.Provider value={customPermissions}>
            {children}
          </PermissionsContext.Provider>
        ),
      });

      expect(
        screen.queryByRole('tab', { name: 'Templates' })
      ).not.toBeInTheDocument();
    });
  });
});
