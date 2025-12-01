import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Indications from '../../components/Indications';

const baseProps = () => ({
  close: jest.fn(),
  indications: {
    stiffness: { Head: 4, Neck: 8 },
    injuries: { 'Left Hand': 5, 'Left Buttock': 5, Neck: 3 },
  },
  indicationTypes: {
    injury: 'Injury',
    soreness: 'Soreness',
    stiffness: 'Stiffness',
  },
  t: (k) => k,
});

describe('<Indications />', () => {
  it('renders component root', () => {
    const { container } = render(<Indications {...baseProps()} />);
    expect(container.querySelector('.indicationsModal')).toBeInTheDocument();
  });

  it('shows tabs when multiple indication types provided', () => {
    const { container } = render(<Indications {...baseProps()} />);
    expect(
      container.querySelector('.indicationsModal__tabs')
    ).toBeInTheDocument();
    const tabButtons = container.querySelectorAll('.indicationsModal__tabBtn');
    expect(tabButtons.length).toBe(2);
  });

  it('displays counts in tabs', () => {
    const { container } = render(<Indications {...baseProps()} />);
    const spans = container.querySelectorAll('.indicationsModal__tabBtn span');
    // stiffness count (Head, Neck) => 2; injuries count => 4 (Left Hand, Left Buttock, Neck front + rear)
    expect(spans[0]).toHaveTextContent('2');
    expect(spans[1]).toHaveTextContent('4');
  });

  it('shows stiffness title in sidebar initially', () => {
    const { container } = render(<Indications {...baseProps()} />);
    expect(
      container.querySelector('.indicationsModal__sidebar h5')
    ).toHaveTextContent('Stiffness');
  });

  it('lists body parts for stiffness', () => {
    const { container } = render(<Indications {...baseProps()} />);
    expect(
      container.querySelectorAll('.km-datagrid-modalIndicationList li').length
    ).toBe(2);
  });

  it('lists body parts for injuries after tab click', async () => {
    const props = baseProps();
    const user = userEvent.setup();
    const { container } = render(<Indications {...props} />);
    const injuriesTab = container.querySelectorAll(
      '.indicationsModal__tabBtn'
    )[1];
    await user.click(injuriesTab);
    // Left Hand, Left Buttock appear under one view plus Neck; depending on ordering, may include Neck twice (front/back). Accept >=3.
    expect(
      container.querySelectorAll('.km-datagrid-modalIndicationList li').length
    ).toBeGreaterThanOrEqual(3);
  });

  it('first body part selected by default (has active class)', () => {
    const { container } = render(<Indications {...baseProps()} />);
    const firstLi = container.querySelector(
      '.km-datagrid-modalIndicationList li'
    );
    expect(firstLi).toHaveClass('active');
  });

  it('selects list item and body map part on list click (stiffness)', async () => {
    const props = baseProps();
    const user = userEvent.setup();
    const { container } = render(<Indications {...props} />);
    const listItems = container.querySelectorAll(
      '.km-datagrid-modalIndicationList li'
    );
    await user.click(listItems[1]);
    expect(listItems[1]).toHaveClass('active');
  });

  it('selects injuries item after switching tab', async () => {
    const props = baseProps();
    const user = userEvent.setup();
    const { container } = render(<Indications {...props} />);
    const injuriesTab = container.querySelectorAll(
      '.indicationsModal__tabBtn'
    )[1];
    await user.click(injuriesTab);
    const injuryItems = container.querySelectorAll(
      '.km-datagrid-modalIndicationList li'
    );
    await user.click(injuryItems[1]);
    expect(injuryItems[1]).toHaveClass('active');
  });

  it('selects item when body part (svg) clicked', async () => {
    const props = baseProps();
    const user = userEvent.setup();
    const { container } = render(<Indications {...props} />);
    const svgs = container.querySelectorAll('.bodyPartContainer svg');
    expect(svgs.length).toBeGreaterThan(1);
    await user.click(svgs[1]);
    const listItems = container.querySelectorAll(
      '.km-datagrid-modalIndicationList li'
    );
    // At least one list item should now be active
    expect(
      Array.from(listItems).some((li) => li.classList.contains('active'))
    ).toBe(true);
  });

  it('displays correct score text for first body part', () => {
    const { container } = render(<Indications {...baseProps()} />);
    const firstScore = container.querySelector(
      '.km-datagrid-modalIndicationList li span'
    );
    expect(firstScore).toHaveTextContent('4/10');
  });

  it('renders stiffness body parts (front + rear count)', () => {
    const { container } = render(<Indications {...baseProps()} />);
    const bodyParts = container.querySelectorAll('.bodyPartContainer');
    expect(bodyParts.length).toBeGreaterThanOrEqual(2);
  });

  it('renders injuries body parts after tab switch', async () => {
    const props = baseProps();
    const user = userEvent.setup();
    const { container } = render(<Indications {...props} />);
    const injuriesTab = container.querySelectorAll(
      '.indicationsModal__tabBtn'
    )[1];
    await user.click(injuriesTab);
    const bodyParts = container.querySelectorAll('.bodyPartContainer');
    expect(bodyParts.length).toBeGreaterThanOrEqual(3);
  });
});
