import { screen, render, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockOrganisations } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';

import {
  AvatarCell,
  TextCell,
  PlayerTypeCell,
  IconCell,
  ActiveCell,
} from '../index';

describe('Cells', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('<TextCell>', () => {
    it('renders', () => {
      render(<TextCell text="My TextCell" />);
      expect(screen.getByText(/My TextCell/i)).toBeInTheDocument();
    });
  });

  describe('<IconCell>', () => {
    it('renders', () => {
      render(<IconCell icon="document" />);
      expect(screen.getByTestId('IconCell')).toHaveClass('icon-document');
    });
  });
  describe('<ActiveCell>', () => {
    it('renders Active when true', () => {
      render(<ActiveCell value="active" />);
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });
    it('renders Inactive when true', () => {
      render(<ActiveCell value="inactive" />);
      expect(screen.getByText(/Inactive/i)).toBeInTheDocument();
    });
  });

  describe('<AvatarCell>', () => {
    it('renders', async () => {
      render(
        <AvatarCell
          avatar_url={mockOrganisations[0].avatar_url}
          text={mockOrganisations[0].name}
          id={1}
        />
      );
      await waitFor(() => {
        expect(screen.getByText(/KL Galaxy/i)).toBeInTheDocument();
      });
    });
  });

  describe('<PlayerTypeCell>', () => {
    it('renders a primary player', async () => {
      render(<PlayerTypeCell value="P" />);
      await waitFor(() => {
        expect(screen.getByText(/P/i)).toBeInTheDocument();
      });
    });
    it('renders a future player', async () => {
      render(<PlayerTypeCell value="FR" />);
      await waitFor(() => {
        expect(screen.getByText(/FR/i)).toBeInTheDocument();
      });
    });
    it('renders a guest player', async () => {
      render(<PlayerTypeCell value="G" />);
      await waitFor(() => {
        expect(screen.getByText(/G/i)).toBeInTheDocument();
      });
    });
    it('renders a late developer player', async () => {
      render(<PlayerTypeCell value="L" />);
      await waitFor(() => {
        expect(screen.getByText(/L/i)).toBeInTheDocument();
      });
    });
  });
});
