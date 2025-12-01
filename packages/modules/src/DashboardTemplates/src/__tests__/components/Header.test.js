import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  buildTemplates,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { Header } from '../../components/Header';

const baseProps = () => ({
  templates: buildTemplates(5),
  addTemplate: jest.fn(),
  t: i18nextTranslateStub(),
});

describe('Dashboard Templates <Header /> component', () => {
  it('renders', () => {
    render(<Header {...baseProps()} />);
    expect(screen.getByText('Dashboard Manager')).toBeInTheDocument();
  });

  it('renders breadcrumb with dashboard link and manager text', () => {
    render(<Header {...baseProps()} />);
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('href', '/dashboards/show');
    expect(screen.getByText('Dashboard Manager')).toBeInTheDocument();
  });

  it('renders an add template button', () => {
    render(<Header {...baseProps()} />);
    // The IconButton has icon-add class; ensure button exists and has that class
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.className).toMatch(/icon-add/);
  });

  it('fires addTemplate when add button clicked', async () => {
    const user = userEvent.setup();
    const addTemplate = jest.fn();
    render(<Header {...baseProps()} addTemplate={addTemplate} />);
    await user.click(screen.getByRole('button'));
    expect(addTemplate).toHaveBeenCalledTimes(1);
  });

  describe('when maximum number of templates is reached', () => {
    it('disables add button and shows tooltip hotspot', () => {
      const many = baseProps();
      many.templates = buildTemplates(200);
      render(<Header {...many} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(
        document.querySelector('.dashboardTemplatesHeader__tooltipHotspot')
      ).toBeInTheDocument();
    });
  });
});
