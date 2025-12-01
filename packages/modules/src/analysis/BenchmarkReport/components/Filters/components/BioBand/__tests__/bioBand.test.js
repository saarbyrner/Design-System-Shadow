import { screen } from '@testing-library/react';
import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import BioBand from '..';

const mockSetFilter = jest.fn();

jest.mock(
  '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter',
  () => {
    return jest.fn(() => ({
      filter: [],
      setFilter: mockSetFilter,
    }));
  }
);

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|BioBand', () => {
  it('renders the BioBand component', () => {
    render(<BioBand {...props} />);

    const bioBand = screen.getByText('Bio-band');

    expect(bioBand).toBeInTheDocument();
  });

  it('renders the bio-band selector', async () => {
    const { user } = renderWithUserEventSetup(<BioBand {...props} />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('radio', { name: 'Any' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Select range' })
    ).toBeInTheDocument();
  });

  it('calls setFilter when Apply is clicked', async () => {
    const { user } = renderWithUserEventSetup(<BioBand {...props} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('radio', { name: 'Select range' }));
    expect(screen.getByText(/of AH/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(mockSetFilter).toHaveBeenCalledWith([65, 100]);
  });
});
