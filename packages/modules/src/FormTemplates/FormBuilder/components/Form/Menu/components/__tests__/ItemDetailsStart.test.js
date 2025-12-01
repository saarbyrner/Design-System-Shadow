import { render, screen } from '@testing-library/react';

import { levelEnumLike } from '../../utils/enum-likes';
import ItemDetailsStart from '../ItemDetailsStart';

describe('<ItemDetailsStart />', () => {
  const props = {
    name: 'Gyrados',
    level: levelEnumLike.menuGroup,
    numberOfChildrenText: 'I have 10 children',
  };

  const dragIconTestId = 'DragIndicatorIcon';

  it('should render the component properly for a menu group', () => {
    render(<ItemDetailsStart {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByTestId(dragIconTestId)).toBeInTheDocument();
    expect(screen.getByText(props.numberOfChildrenText)).toBeInTheDocument();
  });

  it('should render the component properly for a menu item', () => {
    render(<ItemDetailsStart {...props} level={levelEnumLike.menuItem} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByTestId(dragIconTestId)).toBeInTheDocument();
    expect(screen.getByText(props.numberOfChildrenText)).toBeInTheDocument();
  });

  it('should render the component properly for a question', () => {
    render(<ItemDetailsStart {...props} level={levelEnumLike.question} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByTestId(dragIconTestId)).toBeInTheDocument();
    expect(
      screen.queryByText(props.numberOfChildrenText)
    ).not.toBeInTheDocument();
  });
});
