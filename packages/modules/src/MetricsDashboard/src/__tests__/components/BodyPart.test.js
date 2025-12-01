import { render } from '@testing-library/react';
import BodyPart from '../../components/BodyPart';

describe('BodyPart Component', () => {
  const baseProps = {
    bodyPart: 'Neck',
    score: 6,
    pos: { x: 66, y: 338 },
    size: { height: 141, width: 35 },
    svgData: 'M97.1132812,452.693848 Z',
    viewBox: '66 338 35 141',
    opacity: 0.8,
    scoreOffset: { left: '50%', top: '50%' },
  };

  it('renders component container', () => {
    const { container } = render(<BodyPart {...baseProps} />);
    expect(container.querySelector('.bodyPartContainer')).toBeInTheDocument();
  });

  it('renders body part with specified props', () => {
    const { container, getByText } = render(<BodyPart {...baseProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', baseProps.viewBox);
    expect(svg).toHaveAttribute('width', `${baseProps.size.width}px`);
    expect(svg).toHaveAttribute('height', `${baseProps.size.height}px`);
    expect(getByText(String(baseProps.score))).toBeInTheDocument();
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill-opacity', String(baseProps.opacity));
    expect(path).toHaveAttribute('d', baseProps.svgData);
    const wrapper = container.querySelector('.bodyPartContainer');
    expect(wrapper?.getAttribute('style')).toContain(
      `top: ${baseProps.pos.y}px`
    );
    expect(wrapper?.getAttribute('style')).toContain(
      `left: ${baseProps.pos.x}px`
    );
  });

  it('respects score offset when specified', () => {
    const propsWithOffset = {
      ...baseProps,
      scoreOffset: { left: '35%', top: '12%' },
    };
    const { getByText } = render(<BodyPart {...propsWithOffset} />);
    const scoreEl = getByText(String(baseProps.score));
    const styleAttr = scoreEl.getAttribute('style');
    expect(styleAttr).toContain('top: 12%');
    expect(styleAttr).toContain('left: 35%');
  });
});
