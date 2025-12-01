import { render, screen } from '@testing-library/react';
import { renderStatusChip } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart/utils';

describe('renderStatusChip', () => {
  it('renders Complete chip', () => {
    const component = renderStatusChip('complete');
    render(component);

    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('renders Draft chip', () => {
    const component = renderStatusChip('draft');
    render(component);

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders Deleted chip', () => {
    const component = renderStatusChip('deleted');
    render(component);

    expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
  });

  it('renders unsuppported status message', () => {
    const component = renderStatusChip('unknown');
    render(component);

    expect(screen.getByText('Status not supported')).toBeInTheDocument();
  });
});
