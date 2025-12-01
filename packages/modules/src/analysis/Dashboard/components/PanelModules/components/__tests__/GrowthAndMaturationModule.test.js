import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetMaturityEstimatesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { data as maturityEstimates } from '@kitman/services/src/mocks/handlers/analysis/getMaturityEstimates';

import GrowthAndMaturationModule from '../GrowthAndMaturationModule';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');

describe('<GrowthAndMaturationModule />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetMaturityEstimatesQuery.mockReturnValue({ data: maturityEstimates });
  });

  it('renders correctly', () => {
    render(<GrowthAndMaturationModule {...props} />);

    expect(
      screen.getByText('Growth and maturation source')
    ).toBeInTheDocument();
    expect(screen.getByText('Calculation')).toBeInTheDocument();
  });

  it('renders growth and maturation sources correctly', async () => {
    const user = userEvent.setup();
    render(<GrowthAndMaturationModule {...props} />);

    await user.click(screen.getByLabelText('Growth and maturation source'));

    expect(screen.getByText('Biological age (years)')).toBeInTheDocument();
    expect(screen.getByText('Height velocity (%)')).toBeInTheDocument();
    expect(screen.getByText('Date of birth quarter')).toBeInTheDocument();
    expect(screen.getByText('Standing Height 1')).toBeInTheDocument();
    expect(screen.getByText('Weight 1')).toBeInTheDocument();
    expect(screen.getByText('Weight velocity (kg/yr)')).toBeInTheDocument();
    expect(
      screen.getByText('Seated height / height ratio (%)')
    ).toBeInTheDocument();
  });

  it('calls onEstimateChange on a growth and maturation source click', async () => {
    const onEstimateChange = jest.fn();
    const user = userEvent.setup();
    render(
      <GrowthAndMaturationModule
        {...props}
        onEstimateChange={onEstimateChange}
      />
    );

    await user.click(screen.getByLabelText('Growth and maturation source'));
    await user.click(screen.getByText('Biological age (years)'));

    expect(onEstimateChange).toHaveBeenCalledWith(
      'Biological age (years)',
      18695
    );
  });
});
