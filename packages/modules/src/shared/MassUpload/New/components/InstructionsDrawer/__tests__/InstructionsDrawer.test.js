import { render, screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import InstructionsDrawer from '../index';

describe('<InstructionsDrawer />', () => {
  const mockProps = {
    isDrawerOpen: true,
    setIsDrawerOpen: jest.fn(),
    ruleset: <p>Mock ruleset</p>,
    title: 'Mass upload instructions',
    importType: IMPORT_TYPES.LeagueBenchmarking,
  };

  it('should render contents', () => {
    render(<InstructionsDrawer {...mockProps} />);

    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText('Mock ruleset')).toBeInTheDocument();
    expect(screen.getByTestId('CopyAllIcon')).toBeInTheDocument();
  });

  it('should not render copy svg if import type does not have instructions text to copy', () => {
    render(
      <InstructionsDrawer {...mockProps} importType="something_different" />
    );
    expect(screen.queryByTestId('CopyAllIcon')).not.toBeInTheDocument();
  });

  it('should call setIsDrawerOpen on click on chevron', async () => {
    const { user } = renderWithUserEventSetup(
      <InstructionsDrawer {...mockProps} />
    );

    await user.click(screen.getAllByRole('button')[1]);
    expect(mockProps.setIsDrawerOpen).toHaveBeenCalled();
  });
});
