import { screen } from '@testing-library/react';
import { render } from '../../../../testUtils';
import TableLegendItem from '../TableLegendItem';

describe('BenchmarkReport|Table|TableLegendItem', () => {
  it('renders the "National (white)" TableLegendItem component', () => {
    render(
      <TableLegendItem
        strokeColor="#f1f2f3"
        fill="#ffffff"
        labelText="National (white)"
        resultTypeLabel="national color legend"
      />
    );

    const legendColorCircle = screen.getByTitle('national color legend');
    expect(legendColorCircle).toBeVisible();

    const legendLabelText = screen.getByText('National (white)');
    expect(legendLabelText).toBeVisible();
  });

  it('renders the "My club (purple)" TableLegendItem component', () => {
    render(
      <TableLegendItem
        strokeColor="#f1f2f3"
        fill="#9b58b5"
        labelText="My club (purple)"
        resultTypeLabel="my_club color legend"
      />
    );

    const legendColorCircle = screen.getByTitle('my_club color legend');
    expect(legendColorCircle).toBeVisible();

    const legendLabelText = screen.getByText('My club (purple)');
    expect(legendLabelText).toBeVisible();
  });

  it('renders the "Individual athletes (yellow)" TableLegendItem component', () => {
    render(
      <TableLegendItem
        strokeColor="#f1f2f3"
        fill="#ffab00"
        labelText="Individual athletes (yellow)"
        resultTypeLabel="individual color legend"
      />
    );

    const legendColorCircle = screen.getByTitle('individual color legend');
    expect(legendColorCircle).toBeVisible();

    const legendLabelText = screen.getByText('Individual athletes (yellow)');
    expect(legendLabelText).toBeVisible();
  });
});
