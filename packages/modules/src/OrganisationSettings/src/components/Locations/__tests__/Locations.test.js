import 'core-js/stable/structured-clone';
import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  EDIT_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
  CANCEL_BUTTON_TEXT,
  EXIT_ARCHIVE_BUTTON_TEXT,
  VIEW_ARCHIVE_BUTTON_TEXT,
} from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/consts';
import { eventLocationSettingsUrl } from '@kitman/services/src/services/OrganisationSettings/LocationSettings/utils/helpers';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import Locations from '../index';
import { locationsMock, searchDebounceMs } from '../utils/consts';
import {
  getEventTypesText,
  createLocationTypeValueToLabelMap,
} from '../utils/helpers';
import { skeletonTestId } from '../../CalendarSettings/EventTypes/Skeletons/SkeletonTable';
import { ARCHIVE_BUTTON_TEXT } from '../../CalendarSettings/EventTypes/utils/consts';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('<EventTypes />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  /**
   * @returns {HTMLElement}
   */
  const renderComponent = async () => {
    let renderedComponent;
    await waitFor(async () => {
      renderedComponent = await render(<Locations {...props} />);
    });
    return renderedComponent;
  };

  const useGetPermissionsQueryMockReturnValue = {
    data: {
      eventLocationSettings: {
        canCreateEventLocations: true,
        canEditEventLocations: true,
        canArchiveEventLocations: true,
      },
    },
    isSuccess: true,
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue(
      useGetPermissionsQueryMockReturnValue
    );
  });

  it('should render the page properly', async () => {
    await renderComponent();
    expect(screen.getByText('Locations')).toBeInTheDocument();
  });

  describe('Header tests', () => {
    const viewModeButtonTexts = [VIEW_ARCHIVE_BUTTON_TEXT, EDIT_BUTTON_TEXT];
    const editModeButtonTexts = [SAVE_BUTTON_TEXT, CANCEL_BUTTON_TEXT];

    it('should render the "view mode" buttons - edit and archive', async () => {
      await renderComponent();
      viewModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
    });

    it('should not render the edit button when the permission is false', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eventLocationSettings: {
            canCreateEventLocations: true,
            canEditEventLocations: false,
            canArchiveEventLocations: true,
          },
        },
        isSuccess: true,
      });

      await renderComponent();
      expect(screen.queryByText(EDIT_BUTTON_TEXT)).not.toBeInTheDocument();
    });

    it('should switch between "view mode" and "edit mode"', async () => {
      await renderComponent();
      // to edit mode
      await userEvent.click(screen.getByText(EDIT_BUTTON_TEXT));

      viewModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
      expect(
        screen.queryByText(EXIT_ARCHIVE_BUTTON_TEXT)
      ).not.toBeInTheDocument();
      editModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );

      // back to view mode
      await userEvent.click(screen.getByText(CANCEL_BUTTON_TEXT));
      viewModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
      expect(
        screen.queryByText(EXIT_ARCHIVE_BUTTON_TEXT)
      ).not.toBeInTheDocument();
      editModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
    });

    it('should switch between "view mode" and "archive mode"', async () => {
      await renderComponent();
      // to archive mode
      await userEvent.click(screen.getByText(VIEW_ARCHIVE_BUTTON_TEXT));

      viewModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );

      expect(screen.getByText(EXIT_ARCHIVE_BUTTON_TEXT)).toBeInTheDocument();

      editModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );

      // back to view mode
      await userEvent.click(screen.getByText(EXIT_ARCHIVE_BUTTON_TEXT));

      viewModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
      expect(
        screen.queryByText(EXIT_ARCHIVE_BUTTON_TEXT)
      ).not.toBeInTheDocument();
      editModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
    });
  });

  it('should render the data in the table properly', async () => {
    const locationTypeValueToLabelMap = createLocationTypeValueToLabelMap();
    await renderComponent();
    // make sure data loads first
    expect(await screen.findByText(locationsMock[0].name)).toBeInTheDocument();

    const allDataRows = screen.getAllByRole('row').slice(1); // ignore the header
    locationsMock.forEach(
      (
        { name, event_types: eventTypes, location_type: locationType },
        index
      ) => {
        const row = allDataRows[index];
        expect(row).toHaveTextContent(
          name +
            locationTypeValueToLabelMap[locationType] +
            getEventTypesText(eventTypes)
        );
      }
    );
  });

  it('should have row actions column when archive permission is true', async () => {
    const { container } = await renderComponent();
    // make sure data loads first
    expect(await screen.findByText(locationsMock[0].name)).toBeInTheDocument();

    expect(
      container.getElementsByClassName('dataGrid__rowActionsCell').length
    ).toBe(locationsMock.length);
  });

  it('should not show the meatball menu when the archive permission is false', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        eventLocationSettings: {
          canArchiveEventLocations: false,
        },
      },
      isSuccess: true,
    });

    const { container } = await renderComponent();
    // make sure data loads first
    expect(await screen.findByText(locationsMock[0].name)).toBeInTheDocument();

    expect(
      container.getElementsByClassName('dataGrid__rowActionsCell').length
    ).toBe(0);
  });

  describe('skeletons', () => {
    const sleepTime = 100;
    beforeEach(() => {
      server.use(
        rest.get(eventLocationSettingsUrl, (req, res, ctx) => {
          return res(ctx.delay(sleepTime), ctx.json(locationsMock));
        })
      );
    });

    /**
     * @param {number} timeInMs
     */
    const sleep = (timeInMs) =>
      new Promise((r) => {
        setTimeout(r, timeInMs);
      });

    const addLocation = async () => {
      await userEvent.click(screen.getByText('Add New Location'));
    };

    const startEditMode = async () => {
      await userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));
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
      await userEvent.click(
        getTooltipMenuButtons(container)[rowIdx].parentElement
      );
      await userEvent.click(await screen.findByText(ARCHIVE_BUTTON_TEXT)); // the first button is in the header
    };

    const numberOfElementsInEachRow = 3;

    it('should display skeleton while loading the table for the first time', async () => {
      await renderComponent();

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });

    it('should display skeleton after editing the locations', async () => {
      await renderComponent();

      await startEditMode();

      await addLocation();
      const newLocationInput = screen
        .getAllByRole('textbox')
        .at(-numberOfElementsInEachRow);
      const locationName = 'Some location';
      await userEvent.type(newLocationInput, locationName);
      expect(newLocationInput).toHaveValue(locationName);

      const saveButton = screen.getByText(SAVE_BUTTON_TEXT);

      await userEvent.click(saveButton);

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });

    it('should display skeleton while after changing the filters - search', async () => {
      await renderComponent();

      const locationName = 'Some location';

      await act(async () => {
        await userEvent.type(
          screen.getByPlaceholderText('Search'),
          locationName
        );
        await sleep(searchDebounceMs);
      });

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });

    it("should display skeleton while when changing between 'View' and 'Archive' modes", async () => {
      await renderComponent();

      // To Archive mode
      await userEvent.click(await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT));

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(
        await screen.findByText(EXIT_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();

      // To View mode

      await userEvent.click(await screen.findByText(EXIT_ARCHIVE_BUTTON_TEXT));

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });

    it('should display skeleton after archiving a single row with row action', async () => {
      const { container } = await renderComponent();

      // wait for the initial loading to finish
      await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT);

      await archiveRow(container, 0); // first row

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(
        await screen.findByText(VIEW_ARCHIVE_BUTTON_TEXT)
      ).toBeInTheDocument();
    });
  });
});
