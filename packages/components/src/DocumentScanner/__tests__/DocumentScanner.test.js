import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DocumentScanner from '..';

jest.mock('../dwt/DynamsoftSDK', () => () => 'DynamsoftSDKComponent');

describe('<DocumentScanner />', () => {
  const props = {
    isOpen: true,
    onSave: jest.fn(),
    onCancel: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    window.featureFlags['scanner-integration'] = true;
    window.organisationSport = 'nfl';
  });
  afterEach(() => {
    window.featureFlags['scanner-integration'] = false;
    window.organisationSport = '';
  });

  it('renders the toasts correctly', async () => {
    render(<DocumentScanner {...props} />);

    expect(screen.getByTestId('Modal|Title')).toHaveTextContent('Scan');

    const DynamsoftSDKComponent = await screen.findByText(
      /DynamsoftSDKComponent/
    );
    expect(DynamsoftSDKComponent).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /cancel/i,
        hidden: true,
      })
    ).toBeInTheDocument();
  });
});
