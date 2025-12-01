import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import render from '@kitman/common/src/utils/renderWithRedux';

import SessionEvaluation from '../SessionEvaluation';

describe('SessionEvaluation', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    event: { id: 123, type: 'session_event' },
    toastAction: jest.fn(),
    t: i18nT,
  };

  it('renders the correct content', async () => {
    render(<SessionEvaluation {...props} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Session evaluation');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    const editors = await screen.findAllByRole('textbox');
    expect(editors.at(0)).toHaveTextContent('Nothing, it went great!');
    expect(editors.at(1)).toHaveTextContent('use weak foot next time!');
  });

  it('allows user to save rich text display values', async () => {
    server.use(
      rest.get('/planning_hub/events/123/freetext_values', (req, res, ctx) =>
        res(
          ctx.json({
            event_evaluation_went_well: 'Great',
            event_evaluation_went_wrong: 'Bad',
          })
        )
      )
    );
    render(<SessionEvaluation {...props} />);
    const editors = await screen.findAllByRole('textbox');

    await userEvent.type(
      editors.at(0),
      'Actually on second thoughts, nothing went great'
    );

    // TODO: known bug with rich text editor need to re-eval
    // https://github.com/KitmanLabs/kitman-frontend/blob/482e8645ea3627785040baa7a70fbab9c068a649/packages/components/src/richTextEditor/index.js#L45C1-L62C6
    expect(editors.at(0)).toHaveTextContent(
      'Gctually on second thoughts, nothing went greatreatA'
    );

    await userEvent.type(
      editors.at(1),
      'Actually on second thoughts, nothing Huge improvement'
    );

    // TODO: known bug with rich text editor need to re-eval
    // https://github.com/KitmanLabs/kitman-frontend/blob/482e8645ea3627785040baa7a70fbab9c068a649/packages/components/src/richTextEditor/index.js#L45C1-L62C6
    expect(editors.at(1)).toHaveTextContent(
      'Bctually on second thoughts, nothing Huge improvementadA'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(props.toastAction).toHaveBeenCalled();
    expect(props.toastAction).toHaveBeenCalledWith({
      toast: {
        id: 1,
        status: 'SUCCESS',
        title: 'Successfully updated session evaluation',
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

    render(<SessionEvaluation {...props} />);

    await userEvent.type(
      (await screen.findAllByRole('textbox')).at(0),
      'Actually on second thoughts, nothing went great'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(props.toastAction).toHaveBeenCalled();
    expect(props.toastAction).toHaveBeenCalledWith({
      toast: {
        id: 1,
        status: 'ERROR',
        title: 'Error updating session evaluation',
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
    render(<SessionEvaluation {...gameProps} />);
    expect(await screen.findByRole('heading')).toHaveTextContent(
      'Game evaluation'
    );
    expect(
      screen.getByText('What did you do well in this game?')
    ).toBeInTheDocument();
  });
});
