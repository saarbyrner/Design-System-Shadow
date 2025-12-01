import { render, screen } from '@testing-library/react';

import getPowerBiEmbedConfig from '@kitman/services/src/services/getPowerBiEmbedConfig';
import { data } from '@kitman/services/src/mocks/handlers/getPowerBiEmbedConfig';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

import PowerBiEmbeddedReports from '..';

jest.mock('@kitman/services/src/services/getPowerBiEmbedConfig');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('<PowerBiEmbeddedReports />', () => {
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: { analysis: { powerBiReports: { canView: true } } },
      isSuccess: true,
    });
    useLocationAssign.mockReturnValue(mockLocationAssign);
  });

  it('should redirect to homepage if permission is false', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: { analysis: { powerBiReports: { canView: false } } },
      isSuccess: true,
    });

    render(<PowerBiEmbeddedReports />);
    expect(mockLocationAssign).toHaveBeenCalledWith('/');
  });

  it('should not redirect to homepage if permission is true', () => {
    render(<PowerBiEmbeddedReports />);
    expect(mockLocationAssign).not.toHaveBeenCalled();
  });

  it('should show loading text if getPowerBiEmbedConfig has not responded', () => {
    render(<PowerBiEmbeddedReports />);
    expect(screen.getByText('Generating report...')).toBeInTheDocument();
  });

  it('should show loading text if getPowerBiEmbedConfig has responded', async () => {
    getPowerBiEmbedConfig.mockReturnValue(data);

    render(<PowerBiEmbeddedReports />);
    expect(await screen.findByText('Loading data...')).toBeInTheDocument();
  });

  it('should show error text if request errors', async () => {
    getPowerBiEmbedConfig.mockRejectedValue(new Error('whoops'));

    render(<PowerBiEmbeddedReports />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });
});
