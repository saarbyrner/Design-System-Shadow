import 'core-js/stable/structured-clone';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data } from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventAttachmentCategories/getEventAttachmentCategories';
import { eventAttachmentCategoryUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/consts';
import { createUpdateEventAttachmentCategoryUrl } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/helpers';
import {
  EDIT_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
  CANCEL_BUTTON_TEXT,
  VIEW_ARCHIVE_BUTTON_TEXT,
  EXIT_ARCHIVE_BUTTON_TEXT,
} from '../../utils/consts';
import {
  UPLOAD_CATEGORIES_TITLE,
  ARCHIVED_CATEGORIES_TITLE,
  EMPTY_ERROR,
  DUPLICATE_ERROR,
  ADD_NEW_CATEGORY,
  ARCHIVE_BUTTON_TEXT,
  UNARCHIVE_BUTTON_TEXT,
} from '../utils/consts';
import EventAttachmentCategories from '../index';
import { skeletonTestId } from '../../EventTypes/Skeletons/SkeletonTable';

describe('<EventAttachmentCategories />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  const switchToArchiveMode = async () => {
    await userEvent.click(await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT));
  };

  const iconMoreSelector = '.icon-more';
  /**
   * @param {HTMLElement} container
   */
  const getTooltipMenuButtons = (container) => {
    return container.querySelectorAll(iconMoreSelector); // this button doesn't have text
  };

  /**
   * @param {HTMLElement} container
   * @param {number} rowIdx
   */
  const archiveRow = async (container, rowIdx) => {
    await userEvent.click(getTooltipMenuButtons(container)[rowIdx]);
    await userEvent.click(await screen.findByText(ARCHIVE_BUTTON_TEXT));
  };

  /**
   * @param {HTMLElement} container
   * @param {number} rowIdx
   */
  const unarchiveRow = async (container, rowIdx) => {
    await userEvent.click(getTooltipMenuButtons(container)[rowIdx]);
    await userEvent.click(await screen.findByText(UNARCHIVE_BUTTON_TEXT));
  };

  it('should render the page properly', async () => {
    render(<EventAttachmentCategories {...props} />);
    expect(
      await screen.findByText(UPLOAD_CATEGORIES_TITLE)
    ).toBeInTheDocument();
  });

  describe('header', () => {
    it('should render the "view mode" buttons - edit and archive', async () => {
      render(<EventAttachmentCategories {...props} />);
      expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });

    it('should move between "view mode" and "edit mode"', async () => {
      render(<EventAttachmentCategories {...props} />);
      // to edit mode
      await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));

      expect(
        screen.queryByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(EDIT_BUTTON_TEXT)).not.toBeInTheDocument();
      expect(await screen.findByText(SAVE_BUTTON_TEXT)).toBeInTheDocument();
      expect(await screen.findByText(CANCEL_BUTTON_TEXT)).toBeInTheDocument();

      // back to view mode
      await userEvent.click(await screen.findByText(CANCEL_BUTTON_TEXT));

      expect(screen.queryByText(SAVE_BUTTON_TEXT)).not.toBeInTheDocument();
      expect(screen.queryByText(CANCEL_BUTTON_TEXT)).not.toBeInTheDocument();
      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
      expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('shows exit archive when clicking view archive', async () => {
      render(<EventAttachmentCategories {...props} />);

      // to archive mode
      await switchToArchiveMode();

      expect(
        screen.queryByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(EDIT_BUTTON_TEXT)).not.toBeInTheDocument();
      expect(
        await screen.findByText(EXIT_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });
  });

  it('shows the correct archive title', async () => {
    render(<EventAttachmentCategories {...props} />);
    await switchToArchiveMode();

    expect(
      await screen.findByText(ARCHIVED_CATEGORIES_TITLE)
    ).toBeInTheDocument();
  });

  it('should render the data in the table properly', async () => {
    render(<EventAttachmentCategories {...props} />);

    data.forEach(async (eventAttachmentCategory) => {
      expect(
        await screen.findByText(eventAttachmentCategory.name)
      ).toBeInTheDocument();
    });
  });

  it('should show an error if you delete a name or type a duplicate', async () => {
    render(<EventAttachmentCategories {...props} />);
    await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));
    const categoryInputs = screen.getAllByRole('textbox');

    // delete entire name
    await userEvent.clear(categoryInputs[0]);
    await userEvent.click(categoryInputs[1]);
    expect(await screen.findByText(EMPTY_ERROR)).toBeInTheDocument();

    // type a duplicate name
    await userEvent.type(categoryInputs[0], data[1].name);
    await userEvent.click(categoryInputs[1]);
    expect(await screen.findByText(DUPLICATE_ERROR)).toBeInTheDocument();
  });

  it('should show an error if type a duplicate (archived category name)', async () => {
    const { container } = render(<EventAttachmentCategories {...props} />);
    // wait for the page to finish loading
    await waitFor(async () => {
      await screen.findByText(EDIT_BUTTON_TEXT);
    });

    await archiveRow(container, 0);

    await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));
    const categoryInputs = screen.getAllByRole('textbox');

    // type a duplicate name
    await userEvent.clear(categoryInputs[0]);
    await userEvent.type(categoryInputs[0], data[1].name);
    await userEvent.click(screen.getByText(SAVE_BUTTON_TEXT));
    expect(await screen.findByText(DUPLICATE_ERROR)).toBeInTheDocument();
  });

  describe('skeletons', () => {
    const sleepTime = 100;

    it('should display skeleton while loading the table for the first time', async () => {
      server.use(
        rest.get(eventAttachmentCategoryUrlBase, (req, res, ctx) => {
          return res(ctx.delay(sleepTime), ctx.json([]));
        })
      );
      render(<EventAttachmentCategories {...props} />);

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('should display skeleton after editing - creating a new category', async () => {
      server.use(
        rest.post(eventAttachmentCategoryUrlBase, (req, res, ctx) => {
          return res(ctx.delay(sleepTime), ctx.json({}));
        })
      );
      render(<EventAttachmentCategories {...props} />);

      await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));
      await userEvent.click(screen.getByText(ADD_NEW_CATEGORY));
      const categoryInputs = screen.getAllByRole('textbox');
      await userEvent.type(categoryInputs[categoryInputs.length - 1], 'New');
      await userEvent.click(screen.getByText(SAVE_BUTTON_TEXT));

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
    });

    describe('archiving/unarchiving', () => {
      beforeEach(() => {
        server.use(
          rest.put(
            new RegExp(eventAttachmentCategoryUrlBase),
            (req, res, ctx) => {
              return res(ctx.delay(sleepTime), ctx.json({}));
            }
          )
        );
      });
      it('should display skeleton after archiving a single row with row action', async () => {
        const { container } = render(<EventAttachmentCategories {...props} />);

        // wait for the page to finish loading
        await waitFor(async () => {
          await screen.findByText(EDIT_BUTTON_TEXT);
        });

        await archiveRow(container, 0); // first row

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
      });

      it('should display skeleton after unarchiving a single row with row action', async () => {
        server.use(
          rest.get(eventAttachmentCategoryUrlBase, (req, res, ctx) => {
            return res(ctx.json([{ ...data[0], archived: true }]));
          })
        );
        const { container } = render(<EventAttachmentCategories {...props} />);

        // wait for the page to finish loading
        await waitFor(async () => {
          await screen.findByText(EDIT_BUTTON_TEXT);
        });

        // to archive mode
        await switchToArchiveMode();

        await unarchiveRow(container, 0); // first row

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(
          await screen.findByText(EXIT_ARCHIVE_BUTTON_TEXT)
        ).toBeInTheDocument();
      });
    });
  });

  describe('API usage', () => {
    const requestSpy = jest.fn();
    beforeEach(() => {
      server.events.on('request:start', requestSpy);
    });

    afterEach(() => {
      requestSpy.mockClear();
    });
    it('should send the correct payload after adding a new category', async () => {
      render(<EventAttachmentCategories {...props} />);

      const newName = 'New';

      await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));
      await userEvent.click(screen.getByText(ADD_NEW_CATEGORY));
      const categoryInputs = screen.getAllByRole('textbox');
      await userEvent.type(categoryInputs[categoryInputs.length - 1], newName);
      await userEvent.click(screen.getByText(SAVE_BUTTON_TEXT));

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: new URL(`http://localhost${eventAttachmentCategoryUrlBase}`),
          body: {
            name: newName,
          },
        })
      );
    });

    it('should send the correct payload after editing a category', async () => {
      render(<EventAttachmentCategories {...props} />);

      const newName = 'New';

      await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));
      const categoryInputs = screen.getAllByRole('textbox');
      const firstInput = categoryInputs[0];
      await userEvent.clear(firstInput);
      await userEvent.type(firstInput, newName);
      await userEvent.click(screen.getByText(SAVE_BUTTON_TEXT));

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: new URL(
            `http://localhost${createUpdateEventAttachmentCategoryUrl(
              data[0].id
            )}`
          ),
          body: {
            ...data[0],
            name: newName,
          },
        })
      );
    });

    it('should send the correct payload after archiving a category', async () => {
      const { container } = render(<EventAttachmentCategories {...props} />);

      // wait for the page to finish loading
      await waitFor(async () => {
        await screen.findByText(EDIT_BUTTON_TEXT);
      });

      await archiveRow(container, 0); // first row

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: new URL(
            `http://localhost${createUpdateEventAttachmentCategoryUrl(
              data[0].id
            )}`
          ),
          body: {
            ...data[0],
            archived: true,
          },
        })
      );
    });

    it('should send the correct payload after unarchiving a category', async () => {
      server.use(
        rest.get(eventAttachmentCategoryUrlBase, (req, res, ctx) => {
          return res(ctx.json([{ ...data[0], archived: true }]));
        })
      );
      const { container } = render(<EventAttachmentCategories {...props} />);

      // wait for the page to finish loading
      await waitFor(async () => {
        await screen.findByText(EDIT_BUTTON_TEXT);
      });

      // to archive mode
      await switchToArchiveMode();

      await unarchiveRow(container, 0); // first row

      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: new URL(
            `http://localhost${createUpdateEventAttachmentCategoryUrl(
              data[0].id
            )}`
          ),
          body: {
            ...data[0],
            archived: false,
          },
        })
      );
    });
  });
});
