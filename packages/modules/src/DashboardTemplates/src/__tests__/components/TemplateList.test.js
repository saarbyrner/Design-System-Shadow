import { render } from '@testing-library/react';
import {
  buildTemplates,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { TemplateList } from '../../components/TemplateList';

const baseProps = () => ({
  templates: buildTemplates(5),
  delete: jest.fn(),
  duplicate: jest.fn(),
  rename: jest.fn(),
  t: i18nextTranslateStub(),
});

describe('Dashboard Templates <TemplateList /> component', () => {
  it('renders', () => {
    const { container } = render(<TemplateList {...baseProps()} />);
    expect(
      container.querySelector('table.dashboardTemplates')
    ).toBeInTheDocument();
  });

  it('shows the correct number of templates', () => {
    const { container } = render(<TemplateList {...baseProps()} />);
    const rows = container.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(5);
  });

  it('renders the template list table', () => {
    const { container } = render(<TemplateList {...baseProps()} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('displays templates data correctly', () => {
    const props = baseProps();
    const { container } = render(<TemplateList {...props} />);
    const rows = Array.from(container.querySelectorAll('tbody tr'));
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      expect(cells[0]).toHaveTextContent(props.templates[index].name);
      expect(cells[1]).toHaveTextContent(
        props.templates[index].editor.firstname
      );
      expect(cells[1]).toHaveTextContent(
        props.templates[index].editor.lastname
      );
    });
  });

  it('contains links to the templates', () => {
    const props = baseProps();
    const { container } = render(<TemplateList {...props} />);
    const rows = Array.from(container.querySelectorAll('tbody tr'));
    rows.forEach((row, index) => {
      const link = row.querySelector('td a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        `/dashboards/${props.templates[index].id}/edit`
      );
    });
  });

  describe('when there is only one template in the list', () => {
    it('has a tooltip on the delete button and the delete button is disabled', () => {
      const single = baseProps();
      single.templates = buildTemplates(1);
      const { container } = render(<TemplateList {...single} />);
      const row = container.querySelector('tbody tr');
      const tooltip = row.querySelector('.dashboardTemplates__tooltipHotspot');
      expect(tooltip).toBeInTheDocument();
      const deleteButton = row.querySelector('.icon-bin');
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('when there are multiple templates', () => {
    it('sorts templates in alphabetical order', () => {
      const props = {
        ...baseProps(),
        templates: [
          {
            id: 220,
            name: 'B',
            organisation: { id: 6, name: 'Kitman Rugby Club' },
            editor: { id: 21563, firstname: 'Jon', lastname: 'Doe' },
            created_at: '2017-07-14',
            updated_at: '2017-07-14',
          },
          {
            id: 221,
            name: 'A',
            organisation: { id: 6, name: 'Kitman Rugby Club' },
            editor: { id: 21563, firstname: 'Jon', lastname: 'Doe' },
            created_at: '2017-07-14',
            updated_at: '2017-07-14',
          },
        ],
      };
      const { container } = render(<TemplateList {...props} />);
      const rows = container.querySelectorAll('tbody tr');
      const firstName = rows[0].querySelector('td').textContent;
      const secondName = rows[1].querySelector('td').textContent;
      expect(firstName).toContain('A');
      expect(secondName).toContain('B');
    });
  });
});
