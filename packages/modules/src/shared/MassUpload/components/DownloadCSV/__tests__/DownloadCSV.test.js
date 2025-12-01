import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DownloadCSV from '..';

const i18nT = i18nextTranslateStub();

const props = {
  userType: 'athlete',
  t: i18nT,
};

describe('<DownloadCSV/>', () => {
  it('renders', async () => {
    render(<DownloadCSV {...props} />);
    const downloadCSVButton = await screen.findByRole('button', {
      name: /Download Csv/i,
    });
    expect(downloadCSVButton).toBeInTheDocument();
  });
});
