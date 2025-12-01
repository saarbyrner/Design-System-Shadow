import { render, screen } from '@testing-library/react';
import { KitmanIcon } from '../index';
import iconData from '../kitmanIconData';

describe('@kitman/playbook|<KitmanIcon />', () => {
  it('renders a custom kitman icon if it is available', () => {
    render(
      <>
        {iconData.map(({ name }) => (
          <KitmanIcon key={name} customIconName={name} />
        ))}
      </>
    );

    iconData.forEach(({ name, path }) => {
      const icon = screen.getByTestId(`${name}Icon`);

      expect(icon).toBeInTheDocument();
      expect(icon.innerHTML).toContain(path);
    });
  });

  it('renders a material icon when available', () => {
    render(<KitmanIcon name="ChevronLeft" />);

    expect(screen.getByTestId('ChevronLeftIcon')).toBeInTheDocument();
  });

  it('renders nothing if invalid name not given', () => {
    const { container } = render(<KitmanIcon name="ThisIsNotAnIcon" />);

    expect(container).toBeEmptyDOMElement();
  });
});
