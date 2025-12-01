import { screen } from '@testing-library/react';

import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useBenchmarkingUploadGrid from '@kitman/modules/src/Benchmarking/LeagueBenchmarkingApp/hooks/useBenchmarkingUploadGrid';

import getExpectedHeaders from '../utils/getExpectedHeaders';
import MassUploadNew from '../index';

const getSourceFormData = jest.requireActual(
  '@kitman/modules/src/shared/MassUpload/services/getSourceFormData'
);
const getSourceFormDataSpy = jest.spyOn(getSourceFormData, 'default');

describe('<MassUploadNew />', () => {
  const mockProps = {
    importType: IMPORT_TYPES.LeagueBenchmarking,
    importConfig: {
      grid: useBenchmarkingUploadGrid,
      expectedHeaders: getExpectedHeaders(IMPORT_TYPES.LeagueBenchmarking),
      redirectUrl: '/benchmark/league_benchmarking',
      enabled: true,
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const { container } = renderWithRedux(<MassUploadNew {...mockProps} />);

    // Stepper
    expect(screen.getByText('Upload file')).toBeInTheDocument();
    expect(screen.getByText('Preview import')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    // Instructions drawer
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText('League benchmarking')).toBeInTheDocument();

    // Dormant state (file pond)
    expect(
      container.getElementsByClassName('filepond--wrapper')[0]
    ).toBeInTheDocument();
  });

  it('should render with customSteps if passed', () => {
    renderWithRedux(
      <MassUploadNew
        {...mockProps}
        importConfig={{
          ...mockProps.importConfig,
          customSteps: [
            { title: 'Step 1', caption: 'Info' },
            { title: 'Step 2', caption: 'Info' },
            { title: 'Step 3', caption: 'Info' },
          ],
        }}
      />
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('should request getSourceFormData if importType is not event_data', () => {
    renderWithRedux(<MassUploadNew {...mockProps} />);
    expect(getSourceFormDataSpy).not.toHaveBeenCalled();
  });

  it('should request getSourceFormData if importType is event_data', () => {
    renderWithRedux(
      <MassUploadNew {...mockProps} importType={IMPORT_TYPES.EventData} />
    );
    expect(getSourceFormDataSpy).toHaveBeenCalled();
  });
});
