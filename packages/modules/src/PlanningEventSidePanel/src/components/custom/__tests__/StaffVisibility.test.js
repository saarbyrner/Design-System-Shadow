import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data as mockCustomEventData } from '@kitman/services/src/mocks/handlers/planning/getCustomEventTypes';
import { StaffVisibilityTranslated as StaffVisibility } from '../components/StaffVisibility';
import { StaffVisibilityOptions } from '../utils';

describe('StaffVisibility', () => {
  const testValidity = {
    event_location: { isInvalid: false },
  };
  const baseProps = {
    event: { custom_event_type: mockCustomEventData[0] },
    eventValidity: testValidity,
    onUpdateEventDetails: jest.fn(),
    onUpdateEventTitle: jest.fn(),
  };
  describe('when the staff-visibility-custom-events FF is on', () => {
    beforeEach(() => {
      window.featureFlags['staff-visibility-custom-events'] = true;
    });
    afterEach(() => {
      window.featureFlags['staff-visibility-custom-events'] = false;
    });

    describe('in CREATE panel mode', () => {
      it('renders the radio buttons and NOT the additional viewers select at first', () => {
        render(<StaffVisibility {...baseProps} panelMode="CREATE" />);
        expect(screen.getByText('Staff visibility')).toBeInTheDocument();
        expect(screen.getByText('All Staff')).toBeInTheDocument();
        expect(screen.getByText('Only Selected Staff')).toBeInTheDocument();
        expect(
          screen.getByText('Staff and Additional viewers')
        ).toBeInTheDocument();
        expect(
          screen.queryByText('Additional viewers')
        ).not.toBeInTheDocument();
      });

      it('updates staff visibility details when switching the radio buttons', async () => {
        render(<StaffVisibility {...baseProps} panelMode="CREATE" />);
        expect(screen.getByText('Staff visibility')).toBeInTheDocument();
        expect(screen.getByText('All Staff')).toBeInTheDocument();
        expect(screen.getByText('Only Selected Staff')).toBeInTheDocument();

        expect(
          screen.queryByText('Additional viewers')
        ).not.toBeInTheDocument();

        await userEvent.click(screen.getByText('Staff and Additional viewers'));

        expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
          staff_visibility: StaffVisibilityOptions.selectedStaffAndAdditional,
          visibility_ids: [],
        });

        await userEvent.click(screen.getByText('All Staff'));

        expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
          staff_visibility: StaffVisibilityOptions.allStaff,
          visibility_ids: [],
        });
      });
    });
  });
});
