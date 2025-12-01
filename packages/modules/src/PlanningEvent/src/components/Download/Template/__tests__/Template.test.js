import { render, screen, waitFor } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import {
  buildEvent,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';

import Template from '..';

const defaultProps = {
  event: buildEvent(),
  gameParticipationLevels: [],
  disableSaveButton: () => {},
  t: i18nextTranslateStub(),
};

describe('<Template />', () => {
  it('renders the loader', () => {
    render(<Template {...defaultProps} />);
    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  it('has class ‘template’', async () => {
    render(<Template {...defaultProps} />);

    const templates = document.getElementsByClassName('template');
    expect(templates.length).toBe(1);
  });

  it('doesn’t display ‘Please add athletes to the session’ message', async () => {
    render(<Template {...defaultProps} />);

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    expect(
      screen.queryByText('Please add athletes to the session')
    ).not.toBeInTheDocument();
  });

  describe('when there is no athletes', () => {
    beforeEach(() => {
      server.use(
        rest.post(
          '/planning_hub/events/:eventId/athlete_events/search',
          (req, res, ctx) => res(ctx.json([]))
        )
      );
    });

    it('displays ‘Please add athletes to the session’ message', async () => {
      render(<Template {...defaultProps} />);

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      expect(
        await screen.findByText('Please add athletes to the session')
      ).toBeInTheDocument();
    });
  });
});
