import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import File from '../../../components/SourceSelection/sources/File';

// Mock jQuery ajax for this conversion - in production this would be replaced with proper axios/msw mocks
jest.mock('jquery', () => ({
  ajax: jest.fn(),
  fn: {},
}));

// Mock bootstrap-select with proper jQuery plugin structure
jest.mock('bootstrap-select', () => {
  return jest.fn();
});

// Mock daterangepicker
jest.mock('daterangepicker', () => {
  return jest.fn();
});

// Mock DateRangePicker component to avoid bootstrap initialization issues
jest.mock('@kitman/components/src/DateRangePicker', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock SelectWrapper component
jest.mock('@kitman/playbook/components/wrappers/SelectWrapper', () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <div data-testid="select-wrapper" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('Import Workflow sources <File /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      sourceData: {
        type: 'FILE',
        fileData: {
          file: null,
          source: '',
        },
      },
      sourceFormData: {
        loaded: true,
        integrations: [{ id: 6, name: 'Statsports' }],
        fileSources: {},
      },
      backwardButton: '',
      onFileDataChange: jest.fn(),
      onEventDataChange: jest.fn(),
      onForward: jest.fn(),
      t: i18nextTranslateStub({}),
    };
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  it('renders', () => {
    render(<File {...props} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders the next step button', () => {
    render(<File {...props} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders with file sources when available', () => {
    props.sourceFormData.fileSources = {
      statsports: 'Statsports',
      catapult: 'Catapult',
    };

    render(<File {...props} />);

    // Basic rendering test - component should render without errors
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders with integration data when available', () => {
    // Integration data is already in props - component should render without errors
    render(<File {...props} />);

    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
