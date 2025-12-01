import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import TerminologySettings from '../index';

const mockedTerminologies = [
  {
    key: 'development_goal',
    originalName: 'Development goal',
    customName: 'Custom Name',
  },
];

describe('Organisation Settings <TerminologySettings /> component', () => {
  let user;
  let props;

  beforeEach(() => {
    user = userEvent.setup();
    props = {
      t: i18nextTranslateStub(),
    };
  });

  describe('when the initial request is successful', () => {
    beforeEach(() => {
      server.use(
        rest.get('/ui/terminologies', (req, res, ctx) => {
          return res(ctx.json(mockedTerminologies));
        })
      );
    });

    it('populates the table with the correct data', async () => {
      render(<TerminologySettings {...props} />);

      // Wait for the table to populate
      expect(await screen.findByText('Development goal')).toBeInTheDocument();
      expect(screen.getByText('Custom name')).toBeInTheDocument();
    });

    it('saves the terminology after editing and submitting', async () => {
      const newName = 'Saved Name';

      server.use(
        rest.post(
          '/ui/terminologies/development_goal/save',
          (req, res, ctx) => {
            return res(ctx.json({ key: 'development_goal', value: newName }));
          }
        )
      );

      render(<TerminologySettings {...props} />);

      const input = await screen.findByText('Custom name');
      expect(input).toBeInTheDocument();

      const editButton = screen.getByRole('button');
      await user.click(editButton);

      const inputElement = await screen.findByRole('textbox');

      fireEvent.change(inputElement, { target: { value: newName } });

      // Click the save/submit button for that input
      const saveButton = screen.getAllByRole('button')[0];
      await user.click(saveButton);

      // The component should optimistically update or re-render with the new value
      await waitFor(() => {
        expect(screen.getByText(newName)).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/ui/terminologies', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );
    });

    it('shows an error message', async () => {
      render(<TerminologySettings {...props} />);
      // The component should render the AppStatus component with an error state
      expect(
        await screen.findByText('Something went wrong!')
      ).toBeInTheDocument();
    });
  });
});
