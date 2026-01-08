import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import List from '../components/List';

describe('Athletes | <List />', () => {
  describe('<List.GroupHeading />', () => {
    it('renders a title', () => {
      render(<List.GroupHeading title="Group Title" />);

      expect(screen.getByTestId('List.GroupHeading|title')).toHaveTextContent(
        'Group Title'
      );
    });

    it('renders actions', async () => {
      const selectAll = jest.fn();
      const clearAll = jest.fn();
      const actions = [
        { label: 'Select All', onClick: selectAll },
        { label: 'Clear All', onClick: clearAll },
      ];

      render(<List.GroupHeading title="Group Title" actions={actions} />);

      expect(selectAll).toHaveBeenCalledTimes(0);
      await userEvent.click(screen.getByRole('button', { name: 'Select All' }));
      expect(selectAll).toHaveBeenCalledTimes(1);

      expect(clearAll).toHaveBeenCalledTimes(0);
      await userEvent.click(screen.getByRole('button', { name: 'Clear All' }));
      expect(clearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('<List.Option />', () => {
    it('renders a title', () => {
      render(<List.Option title="Title" />);
      expect(screen.getByTestId('List.Option|title')).toHaveTextContent(
        'Title'
      );
    });

    it('sets the bolder style on the rendered title', () => {
      render(<List.Option title="Title" isBolder />);
      expect(screen.getByTestId('List.Option|title')).toHaveStyle(
        'font-weight:600'
      );
    });

    it('renders subtitle', () => {
      render(<List.Option title="Title" subTitle="(Group)" />);
      expect(screen.getByTestId('List.Option|subTitle')).toHaveTextContent(
        '(Group)'
      );
    });

    it('renders something to the left of the title when given renderLeft', () => {
      render(
        <List.Option
          title="Title"
          subTitle="(Group)"
          renderLeft={() => {
            return <div data-testid="LeftContent">Left</div>;
          }}
        />
      );

      expect(screen.getByTestId('LeftContent')).toHaveTextContent('Left');
    });

    it('renders something to the right of the title when given renderRight', () => {
      render(
        <List.Option
          title="Title"
          subTitle="(Group)"
          renderRight={() => {
            return <div data-testid="RightContent">Right</div>;
          }}
        />
      );

      expect(screen.getByTestId('RightContent')).toHaveTextContent('Right');
    });
  });
});
