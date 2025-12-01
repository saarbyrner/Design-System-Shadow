import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import render from '@kitman/common/src/utils/renderWithRedux';

import SessionObjectives from '../SessionObjectives';

describe('SessionObjectives', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    event: { id: 123, type: 'session_event' },
    toastAction: jest.fn(),
    t: i18nT,
  };

  it('renders the correct content', async () => {
    render(<SessionObjectives {...props} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Session objectives');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(await screen.findByRole('textbox')).toHaveTextContent(
      'Stronger. Every. Day.'
    );
  });

  it('allows user to save rich text display values', async () => {
    server.use(
      rest.get('/planning_hub/events/123/freetext_values', (req, res, ctx) =>
        res(
          ctx.json({
            event_objectives: 'Stronger.',
          })
        )
      )
    );
    render(<SessionObjectives {...props} />);
    const editor = await screen.findByRole('textbox');

    await userEvent.type(editor, 'Every. Day.');

    // TODO: known bug with rich text editor need to re-eval
    // https://github.com/KitmanLabs/kitman-frontend/blob/482e8645ea3627785040baa7a70fbab9c068a649/packages/components/src/richTextEditor/index.js#L45C1-L62C6
    expect(editor).toHaveTextContent('Svery. Day.tronger.E');

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(props.toastAction).toHaveBeenCalled();
    expect(props.toastAction).toHaveBeenCalledWith({
      toast: {
        id: 1,
        status: 'SUCCESS',
        title: 'Successfully updated session objectives',
      },
      type: 'UPDATE_TOAST',
    });
  });

  it('correctly handles a failed api call saving rich text displays', async () => {
    server.use(
      rest.post('/planning_hub/events/123/freetext_values', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    render(<SessionObjectives {...props} />);

    await userEvent.type(
      await screen.findByRole('textbox'),
      'Won’t be saved anyways'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(props.toastAction).toHaveBeenCalled();
    expect(props.toastAction).toHaveBeenCalledWith({
      toast: {
        id: 1,
        status: 'ERROR',
        title: 'Error updating session objectives',
      },
      type: 'UPDATE_TOAST',
    });
  });

  it('renders the correct content when it is a game event', async () => {
    const gameProps = {
      event: { id: 123, type: 'game_event' },
      toastAction: jest.fn(),
      t: i18nT,
    };

    render(<SessionObjectives {...gameProps} />);
    expect(await screen.findByRole('heading')).toHaveTextContent(
      'Game objectives'
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(await screen.findByRole('textbox')).toHaveTextContent(
      'Stronger. Every. Day.'
    );
  });
});
