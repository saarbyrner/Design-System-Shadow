import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import InputProgressTracker from '../index';

describe('InputProgressTracker', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  it('renders Assign Form Progress Tracker sections', () => {
    const props = {
      headings: ['Step1', 'Step2', 'Step3'],
      currentHeadingId: 1,
    };

    render(<InputProgressTracker {...props} />);

    expect(screen.getByText('Step1')).toBeInTheDocument();
    expect(screen.getByText('Step2')).toBeInTheDocument();
    expect(screen.getByText('Step3')).toBeInTheDocument();
  });
});
