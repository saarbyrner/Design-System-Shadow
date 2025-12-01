import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AvailabilityStatusCell from '../AvailabilityStatusCell';

const t = i18nextTranslateStub();

const baseAvailabilityStatus = {
  availability: 'unavailable',
  unavailable_since: '45 days',
};

const recordProcessing = {
  athlete_id: 1,
  availability_status: 'injured',
  days: 3,
  processing_in_progress: true,
};

describe('AvailabilityStatusCell', () => {
  beforeEach(() => {
    window.getFlag = jest.fn().mockReturnValue(true);
  });

  it('skips polling when not visible', () => {
    render(
      <AvailabilityStatusCell
        baseAvailabilityStatus={baseAvailabilityStatus}
        availabilityRecord={recordProcessing}
        t={t}
      />
    );

    expect(screen.getByLabelText(/injured/i)).toBeInTheDocument();
    expect(screen.queryByText('Status in progress')).toBeInTheDocument();
  });

  it('falls back to base status when no record provided', () => {
    render(
      <AvailabilityStatusCell
        baseAvailabilityStatus={baseAvailabilityStatus}
        availabilityRecord={undefined}
        t={t}
      />
    );

    expect(screen.getByLabelText(/unavailable/i)).toBeInTheDocument();
  });
});
