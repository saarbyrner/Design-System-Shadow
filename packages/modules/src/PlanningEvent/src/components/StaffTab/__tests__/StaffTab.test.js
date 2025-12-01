import { render, screen } from '@testing-library/react';

import { data as staffData } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import StaffTab from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('StaffTab', () => {
  const props = {
    event: {
      id: 2,
      type: 'custom_event',
      event_users: staffData.map((user) => ({ user })),
    },
    canEditEvent: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  describe('staff tab', () => {
    it('shows the correct headers', async () => {
      await render(<StaffTab {...props} />);
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('shows the correct names', async () => {
      await render(<StaffTab {...props} />);
      expect(screen.getByText(staffData[0].fullname)).toBeInTheDocument();
      expect(screen.getByText(staffData[1].fullname)).toBeInTheDocument();
      expect(screen.getByText(staffData[2].fullname)).toBeInTheDocument();
    });

    it('shows the correct emails', async () => {
      await render(<StaffTab {...props} />);
      expect(screen.getByText(staffData[0].email)).toBeInTheDocument();
      expect(screen.getByText(staffData[1].email)).toBeInTheDocument();
      expect(screen.getByText(staffData[2].email)).toBeInTheDocument();
    });

    it('shows the add staff button when canEditEvent is true', async () => {
      await render(<StaffTab {...props} />);
      expect(
        screen.getByRole('button', { name: 'Add staff' })
      ).toBeInTheDocument();
    });

    it('does not show the add staff button when canEditEvent is false', async () => {
      await render(<StaffTab {...props} canEditEvent={false} />);
      expect(
        screen.queryByRole('button', { name: 'Add staff' })
      ).not.toBeInTheDocument();
    });
  });
});
