import { render, screen } from '@testing-library/react';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import CoachingLibrary from '../CoachingLibrary';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<CoachingLibrary />', () => {
  const trackEventMock = jest.fn();
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  it('renders <DrillLibrary /> if `window.location.hash` equals an empty string', async () => {
    render(<CoachingLibrary />);

    expect(screen.getByText('Coaching library')).toBeInTheDocument();
  });

  it('renders <DrillArchive /> if `window.location.hash` equals `#archive`', async () => {
    window.location.hash = '#archive';

    render(<CoachingLibrary />);

    expect(screen.getByText('Drill archive')).toBeInTheDocument();
  });
});
