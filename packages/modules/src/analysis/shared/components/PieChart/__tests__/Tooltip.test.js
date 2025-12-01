import { render, screen } from '@testing-library/react';
import Tooltip from '../components/Tootip';
import { getOtherSegementLabel } from '../constants';

describe('<Tooltip />', () => {
  const mockProps = {
    left: 100,
    top: 100,
    sourceName: 'Test-Source',
    data: {
      label: 'International Squad',
      value: '100',
      color: '#2A6EBB',
      percentage: 33,
    },
    seriesData: [
      { label: 'International Squad', value: '1000' },
      { label: 'Academy Squad', value: '1000' },
      { label: 'U16', value: '1000' },
    ],
    otherSegment: [],
  };

  const renderWrapper = (props = mockProps) => {
    return render(<Tooltip {...props} />);
  };

  it('renders the source name correctly', () => {
    renderWrapper();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders the label from data', () => {
    renderWrapper();
    expect(screen.getByText('International Squad')).toBeInTheDocument();
  });

  it('renders the percentage with % symbol', () => {
    renderWrapper();
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  describe('other segment on tooltip', () => {
    const otherLabel = getOtherSegementLabel();

    const props = {
      ...mockProps,
      data: {
        label: otherLabel,
        value: '750',
        color: '#2A6EBB',
        percentage: 6,
      },
      seriesData: [
        { label: 'Openside Flanker', value: '1000' },
        { label: 'Blindside Flanker', value: '1000' },
        { label: 'Wing', value: '800' },
        { label: 'Loose-head Prop', value: '800' },
        { label: 'Tight-head Prop', value: '600' },
        { label: 'Hooker', value: '600' },
        { label: 'Inside Center', value: '500' },
        { label: 'No 8', value: '500' },
        { label: 'Other', value: '500' },
        { label: otherLabel, value: '400' }, // combines Out Half and Fullback
      ],
      otherSegment: [
        { label: 'Out Half', value: '250' },
        { label: 'Fullback', value: '150' },
      ],
      valueAccessor: ({ value }) => value,
    };

    it('renders the otherSegment labels and percentages', () => {
      renderWrapper(props);

      expect(screen.getByText('Out Half')).toBeInTheDocument();
      expect(screen.getByText('4%')).toBeInTheDocument();
      expect(screen.getByText('Fullback')).toBeInTheDocument();
      expect(screen.getByText('2%')).toBeInTheDocument();
    });
  });
});
