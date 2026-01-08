import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartLegend from '../index';

describe('<ChartLegend />', () => {
  const props = {
    items: [
      {
        id: 'item1',
        name: 'Item 1',
        colour: null,
      },
      {
        id: 'item2',
        name: 'Item 2',
        colour: 'white',
      },
    ],
  };

  it('Renders correctly the list of item', () => {
    render(<ChartLegend {...props} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Item 1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Item 2');
  });

  it('renders a condensed legend when props.condensed is true', () => {
    const { container } = render(<ChartLegend {...props} condensed />);
    expect(container.firstChild).toHaveClass('chartLegend--condensed');
  });

  describe('when the colour is not specified', () => {
    it('renders the circle with the default colour', () => {
      render(
        <ChartLegend
          {...props}
          items={[
            {
              id: 'item1',
              name: 'Item 1',
              colour: null,
            },
          ]}
        />
      );
      expect(screen.getByTestId('ChartLegend|Circle')).toHaveStyle({
        border: '4px solid #00468F',
      });
    });
  });

  describe('when the colour is specified', () => {
    it('renders the circle with the specified colour', () => {
      render(
        <ChartLegend
          {...props}
          items={[
            {
              id: 'item1',
              name: 'Item 1',
              colour: '#111111',
            },
          ]}
        />
      );

      expect(screen.getByTestId('ChartLegend|Circle')).toHaveStyle({
        border: '4px solid #111111',
      });
    });
  });

  describe('when props.items is an empty array', () => {
    it('renders an empty list', () => {
      render(<ChartLegend {...props} items={[]} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  describe('when a label is provided', () => {
    it('adds a label to the legend', () => {
      const labelText = 'Legend Label';
      render(<ChartLegend {...props} label={labelText} />);
      expect(screen.getByTestId('ChartLegend|Label')).toHaveTextContent(
        labelText
      );
    });
  });

  describe('when a label is not provided', () => {
    it('does not show a label', () => {
      render(<ChartLegend {...props} />);
      expect(screen.queryByTestId('ChartLegend|Label')).not.toBeInTheDocument();
    });
  });

  describe('when a callback is provded', () => {
    it('fires the callback on click with the item', async () => {
      const onClick = jest.fn();

      render(
        <ChartLegend
          {...props}
          items={[
            {
              id: 'item1',
              name: 'Item 1',
              colour: null,
            },
            {
              id: 'item2',
              name: 'Item 2',
              colour: 'white',
            },
          ]}
          onClick={onClick}
        />
      );
      await userEvent.click(screen.getAllByRole('listitem')[0]);
      expect(onClick).toHaveBeenCalledTimes(1);

      await userEvent.click(screen.getAllByRole('listitem')[1]);
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  it('disables disabled items', () => {
    render(
      <ChartLegend
        {...props}
        items={[
          {
            id: 'item1',
            name: 'Item 1',
            colour: null,
            isDisabled: false,
          },
          {
            id: 'item2',
            name: 'Item 2',
            colour: 'white',
            isDisabled: true,
          },
          {
            id: 'item3',
            name: 'Item 3',
            colour: 'red',
            isDisabled: true,
          },
        ]}
      />
    );

    expect(screen.getAllByRole('listitem')[0]).not.toHaveClass(
      'chartLegend__item--disabled'
    );
    expect(screen.getAllByTestId('ChartLegend|Circle')[0]).toHaveStyle({
      border: '4px solid #00468F',
    });

    expect(screen.getAllByRole('listitem')[1]).toHaveClass(
      'chartLegend__item--disabled'
    );
    expect(screen.getAllByTestId('ChartLegend|Circle')[1]).toHaveStyle({
      border: '4px solid #DEDEDE',
    });
  });

  describe('when the item type is plotline', () => {
    it('shows a dash icon instead of a circle', () => {
      render(
        <ChartLegend
          {...props}
          items={[
            {
              id: 'item1',
              name: 'Item 1',
              colour: '#00468F',
              type: 'plotline',
            },
          ]}
        />
      );

      expect(screen.getByRole('listitem')).not.toHaveClass(
        'chartLegend__item--disabled'
      );
      expect(screen.getByTestId('ChartLegend|Dash')).toHaveStyle({
        border: '1px dashed #00468F',
      });
    });
  });
});
