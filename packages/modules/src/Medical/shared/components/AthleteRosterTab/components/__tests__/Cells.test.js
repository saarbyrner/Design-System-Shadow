import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { data as mockRosterAthletes } from '@kitman/services/src/mocks/handlers/medical/getAthleteRoster';

import {
  DefaultHeaderCell,
  AthleteCell,
  AvailabilityStatusCell,
  LatestNoteCell,
  OpenIssuesCell,
  SquadCell,
  AlergiesCell,
} from '../Cells';

describe('Cells', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('<DefaultHeaderCell>', () => {
    it('renders', () => {
      renderWithProviders(<DefaultHeaderCell title="My header title" />);
      expect(screen.getByText(/My header title/i)).toBeInTheDocument();
    });
  });

  describe('<AthleteCell>', () => {
    it('renders', async () => {
      renderWithProviders(<AthleteCell athlete={mockRosterAthletes.rows[0]} />);
      await waitFor(() => {
        expect(
          screen.getByText(/Stone Cold Steve Austin/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('<AvailabilityStatusCell>', () => {
    it('renders when unavailable', async () => {
      renderWithProviders(
        <AvailabilityStatusCell athlete={mockRosterAthletes.rows[0]} />
      );
      await waitFor(() => {
        expect(screen.getByText(/unavailable/i)).toBeInTheDocument();
        expect(screen.getByText(/164 days/i)).toBeInTheDocument();
      });
    });

    it('renders when available', async () => {
      renderWithProviders(
        <AvailabilityStatusCell athlete={mockRosterAthletes.rows[1]} />
      );
      await waitFor(() => {
        expect(screen.getByText(/available/i)).toBeInTheDocument();
      });
    });
  });

  describe('<LatestNoteCell>', () => {
    it('renders', async () => {
      renderWithProviders(
        <LatestNoteCell athlete={mockRosterAthletes.rows[2]} />
      );
      await waitFor(() => {
        expect(screen.getByText(/Note Title 001/i)).toBeInTheDocument();
        expect(screen.getByText(/I am a note/i)).toBeInTheDocument();
        expect(screen.getByText(/Oct 10, 2022/i)).toBeInTheDocument();
      });
    });
  });

  describe('<OpenIssuesCell>', () => {
    it('renders', async () => {
      renderWithProviders(
        <OpenIssuesCell athlete={mockRosterAthletes.rows[0]} />
      );
      await waitFor(() => {
        expect(screen.getByText('Dec 2, 2022 - ACL')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Oct 11, 2022 - Clavicle Musculoskeletal Stress [N/A]'
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'Oct 11, 2022 - Ankle Achilles Tendon Rupture [Left]'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('<SquadCell>', () => {
    it('renders', async () => {
      renderWithProviders(<SquadCell athlete={mockRosterAthletes.rows[0]} />);
      await waitFor(() => {
        expect(screen.getByText(/Kitman Football/i)).toBeInTheDocument();
      });
    });
  });

  describe('<AlergiesCell>', () => {
    it('renders', async () => {
      renderWithProviders(
        <AlergiesCell athlete={mockRosterAthletes.rows[1]} />
      );
      await waitFor(() => {
        expect(screen.getByText(/Hay fever/i)).toBeInTheDocument();
      });
    });
  });
});
