import { render, screen } from '@testing-library/react';
import colors from '@kitman/common/src/variables/colors';
import FormSection from '..';

describe('Graph Composer <FormSection /> component', () => {
  const props = {
    title: 'Section title',
  };

  it('renders the component', () => {
    render(<FormSection {...props} />);
    expect(screen.getByText('Section title')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(<FormSection {...props} />);
    const titleElement = screen.getByText(props.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('graphComposerFormSection__title');
  });

  describe("when border prop is provided as 'top'", () => {
    it('adds the correct class', () => {
      const { container } = render(<FormSection {...props} border="top" />);
      const formSectionDiv = container.firstChild;
      expect(formSectionDiv).toHaveClass('graphComposerFormSection--borderTop');
    });
  });

  describe("when border prop is provided as 'bottom'", () => {
    it('adds the correct class', () => {
      const { container } = render(<FormSection {...props} border="bottom" />);
      const formSectionDiv = container.firstChild;
      expect(formSectionDiv).toHaveClass(
        'graphComposerFormSection--borderBottom'
      );
    });
  });

  describe('when no border prop is provided', () => {
    it('has the correct class', () => {
      const { container } = render(<FormSection {...props} />);
      const formSectionDiv = container.firstChild;
      expect(formSectionDiv).toHaveClass('graphComposerFormSection');
      expect(formSectionDiv).not.toHaveClass(
        'graphComposerFormSection--borderTop'
      );
      expect(formSectionDiv).not.toHaveClass(
        'graphComposerFormSection--borderBottom'
      );
    });
  });

  describe('when sectionNumber prop is provided', () => {
    it('has the correct class and show the section number', () => {
      const { container } = render(
        <FormSection {...props} sectionNumber={2} />
      );
      const formSectionDiv = container.firstChild;
      expect(formSectionDiv).toHaveClass(
        'graphComposerFormSection--leftGutter'
      );

      const sectionNumber = screen.getByText('2');
      expect(sectionNumber).toBeInTheDocument();
      expect(sectionNumber).toHaveClass(
        'graphComposerFormSection__sectionNumber'
      );
    });
  });

  describe('when there is no title', () => {
    it("doesn't render a title and add graphComposerFormSection--noTitle class", () => {
      const { container } = render(<FormSection {...props} title={null} />);
      const formSectionDiv = container.firstChild;
      expect(formSectionDiv).toHaveClass('graphComposerFormSection--noTitle');

      const titleElement = screen.queryByText(props.title);
      expect(titleElement).not.toBeInTheDocument();
    });
  });

  it('shows the correct icon when sectionStyle is column', () => {
    const { container } = render(
      <FormSection {...props} sectionStyle="column" />
    );
    const formSectionDiv = container.firstChild;
    expect(formSectionDiv).toHaveClass('graphComposerFormSection--leftGutter');

    const sectionStyleIcon = container.querySelector(
      '.graphComposerFormSection__sectionStyleIcon'
    );
    expect(sectionStyleIcon).toBeInTheDocument();

    const paths = sectionStyleIcon.querySelectorAll('path');
    const columnPath = paths[0];
    const linePath = paths[1];

    expect(linePath).toHaveAttribute('stroke', colors.s13);
    expect(columnPath).toHaveAttribute('fill', colors.p01);
  });

  it('shows the correct icon when sectionStyle is line', () => {
    const { container } = render(
      <FormSection {...props} sectionStyle="line" />
    );
    const formSectionDiv = container.firstChild;
    expect(formSectionDiv).toHaveClass('graphComposerFormSection--leftGutter');

    const sectionStyleIcon = container.querySelector(
      '.graphComposerFormSection__sectionStyleIcon'
    );
    expect(sectionStyleIcon).toBeInTheDocument();

    const paths = sectionStyleIcon.querySelectorAll('path');
    const columnPath = paths[0];
    const linePath = paths[1];

    expect(linePath).toHaveAttribute('stroke', colors.p01);
    expect(columnPath).toHaveAttribute('fill', colors.s13);
  });
});
