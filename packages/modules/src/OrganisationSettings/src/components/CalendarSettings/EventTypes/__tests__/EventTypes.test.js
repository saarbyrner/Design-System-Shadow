/* eslint-disable camelcase */
/* eslint-disable jest/no-conditional-expect */
import 'core-js/stable/structured-clone';
import { screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server, rest } from '@kitman/services/src/mocks/server';
import { customEventTypesUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/consts';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  data,
  scopedSquadsData,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventTypes/getEventTypes';
import organisationSettings from '@kitman/services/src/services/OrganisationSettings';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import {
  ARCHIVE_BUTTON_TEXT,
  UNARCHIVE_BUTTON_TEXT,
  UNGROUPED_ID,
} from '../utils/consts';
import {
  EDIT_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
  CANCEL_BUTTON_TEXT,
  EXIT_ARCHIVE_BUTTON_TEXT,
  VIEW_ARCHIVE_BUTTON_TEXT,
} from '../../utils/consts';
import EventTypes from '../index';
import { parentAndEmptyRowBackgroundColor } from '../../utils/styles';
import {
  mapResponseEventTypeToIP,
  prepareEventsInGroups,
} from '../utils/groups-helpers';
import * as hooks from '../../utils/hooks';
import { skeletonTestId } from '../Skeletons/SkeletonTable';

jest.mock('@kitman/services/src/services/OrganisationSettings', () => {
  const originalModule = jest.requireActual(
    '@kitman/services/src/services/OrganisationSettings'
  );
  return {
    ...originalModule,
  };
});

describe('<EventTypes />', () => {
  const t = i18nextTranslateStub();
  const props = {
    t,
  };

  /**
   * @returns {HTMLElement}
   */
  const renderComponent = async () => {
    let renderedComponent;
    await act(async () => {
      renderedComponent = renderWithRedux(<EventTypes {...props} />, {
        preloadedState: { orgSettings: { graphColourPalette: [] } },
        useGlobalStore: false,
      });
    });
    return renderedComponent;
  };

  const checkboxSpanSelector = `input[type="checkbox"] ~ span`;

  /**
   * @param {HTMLElement} container
   */
  const getAllCheckboxes = (container) =>
    container.querySelectorAll(checkboxSpanSelector);

  const updateEventTypeMock = jest.spyOn(
    organisationSettings,
    'updateEventType'
  );

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
    await userEvent.click(getTooltipMenuButtons(container)[rowIdx + 1]); // 1 for header
    await userEvent.click(screen.getAllByText(ARCHIVE_BUTTON_TEXT)[1]); // the first button is in the header
  };

  it('should render the page properly', async () => {
    await renderComponent();
    expect(screen.getByText('Event Types')).toBeInTheDocument();
  });

  /**
   * @param {HTMLElement} container
   */
  const switchToArchiveMode = async (container) => {
    await userEvent.click(getTooltipMenuButtons(container)[0]); // the header should have the first one.
    await userEvent.click(screen.getByText(VIEW_ARCHIVE_BUTTON_TEXT));
  };

  const switchToViewModeFromArchive = async () =>
    userEvent.click(screen.getByText(EXIT_ARCHIVE_BUTTON_TEXT));

  const useGetCalendarSettingsPermissionsSpy = jest.spyOn(
    hooks,
    'useGetCalendarSettingsPermissions'
  );

  const noSquadsSelectedText = 'No squads selected.';

  const mappedData = data.map(mapResponseEventTypeToIP);

  const { groups } = prepareEventsInGroups(mappedData, t);

  beforeEach(() => {
    useGetCalendarSettingsPermissionsSpy.mockReturnValue({
      canArchiveCustomEvents: true,
      canCreateCustomEvents: true,
      canEditCustomEvents: true,
    });
  });

  describe('Header tests', () => {
    const archiveModeButtonTexts = [
      EXIT_ARCHIVE_BUTTON_TEXT,
      UNARCHIVE_BUTTON_TEXT,
    ];
    const viewModeButtonTexts = [ARCHIVE_BUTTON_TEXT, EDIT_BUTTON_TEXT];
    const editModeButtonTexts = [SAVE_BUTTON_TEXT, CANCEL_BUTTON_TEXT];

    it('should render the "view mode" buttons - edit and archive', async () => {
      const component = await renderComponent();
      viewModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
      expect(getTooltipMenuButtons(component.container)[0]).toBeInTheDocument();
    });

    it('should switch between "view mode" and "edit mode"', async () => {
      await renderComponent();
      // to edit mode
      await userEvent.click(screen.getByText(EDIT_BUTTON_TEXT));

      viewModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
      archiveModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
      editModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );

      // back to view mode
      await userEvent.click(screen.getByText(CANCEL_BUTTON_TEXT));
      viewModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
      archiveModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
      editModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
    });

    it('should switch between "view mode" and "archive mode"', async () => {
      const component = await renderComponent();
      // to archive mode
      await switchToArchiveMode(component.container);

      viewModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
      archiveModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
      editModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );

      // back to view mode
      await switchToViewModeFromArchive();

      viewModeButtonTexts.forEach((text) =>
        expect(screen.getByText(text)).toBeInTheDocument()
      );
      archiveModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
      editModeButtonTexts.forEach((text) =>
        expect(screen.queryByText(text)).not.toBeInTheDocument()
      );
    });

    describe('permissions', () => {
      it("should display both 'edit' and 'archive' buttons with the permissions", async () => {
        useGetCalendarSettingsPermissionsSpy.mockReturnValue({
          canArchiveCustomEvents: true,
          canCreateCustomEvents: true,
          canEditCustomEvents: true,
        });
        const component = await renderComponent();

        expect(screen.getByText(ARCHIVE_BUTTON_TEXT)).toBeInTheDocument();
        expect(screen.getByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();

        expect(
          getTooltipMenuButtons(component.container)[0]
        ).toBeInTheDocument();
      });

      it("should not display the 'edit' button without the permissions", async () => {
        useGetCalendarSettingsPermissionsSpy.mockReturnValue({
          canArchiveCustomEvents: true,
          canCreateCustomEvents: true,
          canEditCustomEvents: false,
        });
        const component = await renderComponent();

        expect(screen.getByText(ARCHIVE_BUTTON_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(EDIT_BUTTON_TEXT)).not.toBeInTheDocument();

        expect(
          getTooltipMenuButtons(component.container)[0]
        ).toBeInTheDocument();
      });
      it("should not display the 'archive' button without the permissions", async () => {
        useGetCalendarSettingsPermissionsSpy.mockReturnValue({
          canArchiveCustomEvents: false,
          canCreateCustomEvents: true,
          canEditCustomEvents: true,
        });
        const component = await renderComponent();

        expect(screen.getByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
        expect(screen.queryByText(ARCHIVE_BUTTON_TEXT)).not.toBeInTheDocument();

        expect(
          getTooltipMenuButtons(component.container)[0]
        ).toBeInTheDocument();
      });
      it("should not display the 'unarchive' button without the permissions", async () => {
        useGetCalendarSettingsPermissionsSpy.mockReturnValue({
          canArchiveCustomEvents: false,
          canCreateCustomEvents: false,
          canEditCustomEvents: false,
        });
        await renderComponent();
        await userEvent.click(screen.getByText(VIEW_ARCHIVE_BUTTON_TEXT));

        expect(
          screen.queryByText(UNARCHIVE_BUTTON_TEXT)
        ).not.toBeInTheDocument();
      });
      it("should not display both 'archive' and 'edit buttons without the permissions", async () => {
        useGetCalendarSettingsPermissionsSpy.mockReturnValue({
          canArchiveCustomEvents: false,
          canCreateCustomEvents: true,
          canEditCustomEvents: false,
        });
        await renderComponent();

        expect(screen.queryByText(ARCHIVE_BUTTON_TEXT)).not.toBeInTheDocument();
        expect(screen.queryByText(EDIT_BUTTON_TEXT)).not.toBeInTheDocument();

        expect(
          screen.queryByText(VIEW_ARCHIVE_BUTTON_TEXT)
        ).toBeInTheDocument();
      });
    });
  });

  const getAllTableBodyRows = () => screen.getAllByRole('row').slice(1); // ignore the header

  /**
   * @param {HTMLElement} row
   * @param {string} color
   */
  const expectRowCellsToHaveBackgroundColor = (row, color) => {
    Array.from(row).forEach((childCell) => {
      expect(childCell).toHaveStyle({
        'background-color': color,
      });
    });
  };

  describe('table rendering', () => {
    it('should render the data in the table properly', async () => {
      await renderComponent();
      const parentRowsTexts = new Set();

      data.forEach(({ name, is_selectable }) => {
        if (!is_selectable) parentRowsTexts.add(name);
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      const allRows = getAllTableBodyRows();
      allRows.forEach((row) => {
        const eventName = row.children[1].textContent;
        const isParent = parentRowsTexts.has(eventName);
        if (isParent) {
          expectRowCellsToHaveBackgroundColor(
            row,
            parentAndEmptyRowBackgroundColor
          );
        }
      });

      expect(screen.queryByText(noSquadsSelectedText)).not.toBeInTheDocument(); // FF is off
    });

    it('should render archived events as well', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      await archiveRow(container, 1); // first child

      // to archive mode
      await switchToArchiveMode(container);

      const numberOfRows =
        1 + // header
        1 + // parent
        1; // archived row
      const allRows = screen.getAllByRole('row');
      expect(allRows.length).toBe(numberOfRows); // 1 for header
    });

    it('should render an empty row before ungrouped archived events', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const numberOfGrouped = data.filter((event) => {
        if (!event.is_selectable) return true;
        if (event.parent_custom_event_type_id !== null) return true;
        return false;
      }).length;
      await archiveRow(container, numberOfGrouped); // ungrouped row, ungrouped group parent row doesn't have this button
      await archiveRow(container, 1); // first child
      await switchToArchiveMode(container);

      const numberOfRows =
        1 + // header
        2 + // parents
        2; // archived rows
      const allRows = screen.getAllByRole('row');
      expect(allRows.length).toBe(numberOfRows);
      const fillerRow = allRows[3]; // 0 - header, 1 - first parent, 2 - first archived row
      expect(fillerRow).toHaveTextContent('Ungrouped');
      expectRowCellsToHaveBackgroundColor(
        fillerRow,
        parentAndEmptyRowBackgroundColor
      );
    });
  });

  describe(`with the squad-scoped-custom-events FF on`, () => {
    beforeEach(() => {
      window.featureFlags['squad-scoped-custom-events'] = true;
    });
    afterEach(() => {
      window.featureFlags['squad-scoped-custom-events'] = false;
    });

    it('should render the data in the table properly', async () => {
      server.use(
        rest.get(customEventTypesUrlBase, (req, res, ctx) => {
          return res(ctx.json(scopedSquadsData));
        })
      );

      await renderComponent();
      const parentRowsTexts = new Set();
      /** @type {{ [key: string]: number }} */
      const squadNamesCount = {};

      data.forEach(({ name, is_selectable, squads }) => {
        if (!is_selectable) parentRowsTexts.add(name);
        expect(screen.getByText(name)).toBeInTheDocument();
        squads.forEach(({ name: squadName }) => {
          if (squadNamesCount[squadName]) {
            squadNamesCount[squadName] += 1;
          } else {
            squadNamesCount[squadName] = 1;
          }
        });
      });

      Object.entries(squadNamesCount).forEach(([name, count]) => {
        expect(screen.getAllByText(new RegExp(name)).length).toBe(count);
      });

      const allRows = getAllTableBodyRows();
      allRows.forEach((row) => {
        const eventName = row.children[1].textContent;
        const isParent = parentRowsTexts.has(eventName);
        if (isParent) {
          expectRowCellsToHaveBackgroundColor(
            row,
            parentAndEmptyRowBackgroundColor
          );
        }
      });

      expect(screen.queryByText(noSquadsSelectedText)).not.toBeInTheDocument(); // events have squads
    });

    it("should not render labels for group's children if there aren't any children", async () => {
      await renderComponent();

      expect(screen.getAllByText(noSquadsSelectedText).length).toBe(
        data.length
      );
    });
  });

  describe('shared-custom-events FF', () => {
    const originalGetFlag = window.getFlag;

    afterEach(() => {
      window.getFlag = originalGetFlag;
    });

    it('renders a Shared chip for each group and ungrouped event when FF is ON', async () => {
      window.getFlag = jest.fn((flag) => flag === 'shared-custom-events');

      await renderComponent();
      const sharedBadges = screen.getAllByText('Shared');

      const expectedSharedBadgesCount = data.filter((event) => {
        const isParent = !event.parent_custom_event_type_id;
        if (!isParent || !event.shared) return false;

        const hasChildren = data.some(
          (other) => other.parent_custom_event_type_id === event.id
        );

        const isSharedGroup = hasChildren;
        const isSharedUngrouped = !hasChildren;

        return isSharedGroup || isSharedUngrouped;
      }).length;

      expect(sharedBadges.length).toBe(expectedSharedBadgesCount);
    });

    it('renders a Shared checkbox for each group and ungrouped event when FF is ON', async () => {
      window.getFlag = jest.fn((flag) => flag === 'shared-custom-events');

      const user = userEvent.setup();
      await renderComponent();

      await user.click(screen.getByText(EDIT_BUTTON_TEXT));

      const nonUngroupedGroupsCount = groups.filter(
        (g) => g.id !== UNGROUPED_ID
      ).length;
      const ungroupedEventsCount = groups.find(
        (group) => group.id === UNGROUPED_ID
      ).children.length;
      const expectedCheckboxesCount =
        nonUngroupedGroupsCount + ungroupedEventsCount;

      const checkboxes = screen.getAllByRole('checkbox');

      expect(checkboxes.length).toBe(expectedCheckboxesCount);
    });

    it('allows toggling the Shared checkbox in edit mode', async () => {
      window.getFlag = jest.fn((flag) => flag === 'shared-custom-events');

      const user = userEvent.setup();
      await renderComponent();

      await user.click(screen.getByText(EDIT_BUTTON_TEXT));

      const checkedCheckbox = screen.getAllByRole('checkbox')[0];
      expect(checkedCheckbox).toBeInTheDocument();

      expect(checkedCheckbox).toBeChecked();

      await user.click(checkedCheckbox);
      expect(checkedCheckbox).not.toBeChecked();
    });

    it('does not render the Shared checkbox when FF is OFF', async () => {
      window.getFlag = jest.fn(() => false);

      const { container } = await renderComponent();
      await userEvent.click(screen.getByText(EDIT_BUTTON_TEXT));

      const sharedInputs = container.querySelectorAll(
        'input[id^="shared-event-"]'
      );
      expect(sharedInputs.length).toBe(0);
    });
  });

  describe('skeletons', () => {
    const sleepTime = 100;

    it('should display skeleton while loading the table for the first time', async () => {
      server.use(
        rest.get(customEventTypesUrlBase, (req, res, ctx) => {
          return res(ctx.delay(sleepTime), ctx.json([]));
        })
      );
      await renderComponent(<EventTypes {...props} />);

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
    });

    it('should display skeleton after editing', async () => {
      server.use(
        rest.post(new RegExp(customEventTypesUrlBase), (req, res, ctx) => {
          return res(ctx.delay(sleepTime), ctx.json({}));
        })
      );
      await renderComponent(<EventTypes {...props} />);

      await userEvent.click(screen.getByText(EDIT_BUTTON_TEXT));

      await userEvent.click(screen.getAllByText('Add event to group')[0]);
      const allInputs = screen.getAllByRole('textbox');
      const newInputIndex = groups[0].children.length + 1; //  + 1 for the parent, also an input
      fireEvent.change(allInputs[newInputIndex], {
        target: { value: 'New' },
      });

      await userEvent.click(screen.getByText(SAVE_BUTTON_TEXT));

      expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

      expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
    });

    describe('archiving/unarchiving', () => {
      beforeEach(() => {
        server.use(
          rest.put(new RegExp(customEventTypesUrlBase), (req, res, ctx) => {
            return res(ctx.delay(sleepTime), ctx.json({}));
          })
        );
      });

      it('should display skeleton after archiving a single row with row action', async () => {
        const { container } = await renderComponent(<EventTypes {...props} />);

        await archiveRow(container, 1); // first child

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
      });

      it('should display skeleton after archiving a group with group action', async () => {
        const { container } = await renderComponent(<EventTypes {...props} />);

        // archive group
        await userEvent.click(getTooltipMenuButtons(container)[1]); // first row, + 1 for header
        await userEvent.click(screen.getByText('Archive group'));

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
      });

      it('should display skeleton after archiving an event type with checkboxes', async () => {
        const { container } = await renderComponent(<EventTypes {...props} />);

        const allCheckboxes = getAllCheckboxes(container);

        // archive first row (in the first group)
        await userEvent.click(allCheckboxes[1]);
        await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();

        await switchToArchiveMode(container);

        const allCheckboxesInArchive = getAllCheckboxes(container);

        // unarchive first row (in the first group)
        await userEvent.click(allCheckboxesInArchive[1]);
        await userEvent.click(screen.getByText(UNARCHIVE_BUTTON_TEXT));

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(
          await screen.findByText(EXIT_ARCHIVE_BUTTON_TEXT)
        ).toBeInTheDocument();
      });

      it('should display skeleton after archiving a whole group with checkboxes', async () => {
        const { container } = await renderComponent(<EventTypes {...props} />);

        const allCheckboxes = getAllCheckboxes(container);

        // archive the rest of the group
        await userEvent.click(allCheckboxes[0]);
        await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

        expect(await screen.findByTestId(skeletonTestId)).toBeInTheDocument();

        expect(await screen.findByText(EDIT_BUTTON_TEXT)).toBeInTheDocument();
      });
    });
  });

  describe('permissions', () => {
    it("should not display the menu button in any of the rows because the user doesn't have permissions to archive", async () => {
      useGetCalendarSettingsPermissionsSpy.mockReturnValue({
        canArchiveCustomEvents: false,
        canCreateCustomEvents: true,
        canEditCustomEvents: true,
      });
      await renderComponent(<EventTypes {...props} />);
      const allRows = getAllTableBodyRows();
      allRows.forEach((row) => {
        expect(Array.from(row.children).at(-1)).toBeEmptyDOMElement(); // should be a filler cell, no content
      });
    });
    it('should display the menu button in all of the rows because the user has permissions to archive', async () => {
      useGetCalendarSettingsPermissionsSpy.mockReturnValue({
        canArchiveCustomEvents: true,
        canCreateCustomEvents: true,
        canEditCustomEvents: true,
      });
      await renderComponent(<EventTypes {...props} />);
      const allRows = getAllTableBodyRows();
      allRows.forEach((row) => {
        const childTds = Array.from(row.children);
        if (childTds[0].querySelector('input').id === UNGROUPED_ID) return; // ungrouped parent shouldn't have actions anyway
        expect(childTds.at(-1)).not.toBeEmptyDOMElement(); // should be a cell with content
      });
    });
  });

  describe('checkbox logic', () => {
    const checkboxSelector = `input[type="checkbox"]`;
    const checkedClass = 'icon-checked-checkmark';
    const indeterminateClass = 'icon-indeterminate-checkmark';

    const getNumberOfRows = () => screen.getAllByRole('row').length - 1; // 1 for header

    /**
     * @param {Array<HTMLElement>} checkboxes
     * @returns
     */
    const expectCheckboxesToBeEmpty = (checkboxes) =>
      checkboxes.forEach((checkbox) =>
        expect(checkbox).not.toHaveClass(checkedClass)
      );

    describe('permissions', () => {
      it("should verify that all checkboxes are not displayed because the user doesn't have permissions to archive", async () => {
        useGetCalendarSettingsPermissionsSpy.mockReturnValue({
          canArchiveCustomEvents: false,
          canCreateCustomEvents: true,
          canEditCustomEvents: true,
        });
        const { container } = await renderComponent(<EventTypes {...props} />);
        const allCheckboxes = getAllCheckboxes(container);
        allCheckboxes.forEach((checkbox) => {
          expect(checkbox.parentElement).toHaveStyle('display: none');
        });
      });
      it('should verify that all checkboxes are displayed because the user has permissions to archive', async () => {
        const { container } = await renderComponent(<EventTypes {...props} />);
        const allCheckboxes = getAllCheckboxes(container);
        allCheckboxes.forEach((checkbox) => {
          expect(checkbox.parentElement).not.toHaveStyle('display: none');
        });
      });
    });

    it('should check all of the group and only the group', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const firstParent = groups[0];
      const numberOfChildren = firstParent.children.length;
      // The span object changes classes according to being checked/unchecked,
      // I resorted to using query selectors instead of role because I couldn't
      // use role="checkbox"
      const allCheckboxes = getAllCheckboxes(container);

      await userEvent.click(allCheckboxes[0]);

      allCheckboxes.forEach((checkbox, index) => {
        const shouldBeChecked = index <= numberOfChildren;
        if (shouldBeChecked) {
          expect(checkbox).toHaveClass(checkedClass);
        } else {
          expect(checkbox).not.toHaveClass(checkedClass);
        }
      });
    });

    it('should archive all of the group and in archive mode, the whole group can be unarchived with just the parent', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const firstParent = groups[0];
      const numberOfChildren = firstParent.children.length;
      const allCheckboxes = getAllCheckboxes(container);
      const originalNumberOfRows = getNumberOfRows();

      // archive the group
      await userEvent.click(allCheckboxes[0]);
      await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

      const numberOfArchivedRows = numberOfChildren + 1; // 1 for the parent

      expect(getNumberOfRows()).toBe(
        originalNumberOfRows - numberOfArchivedRows
      );

      await switchToArchiveMode(container);

      expect(getNumberOfRows()).toBe(numberOfArchivedRows);

      // unarchive the group
      const allArchivedCheckboxes = getAllCheckboxes(container);
      await userEvent.click(allArchivedCheckboxes[0]);
      await userEvent.click(screen.getByText(UNARCHIVE_BUTTON_TEXT));

      expect(getNumberOfRows()).toBe(0);
      await switchToViewModeFromArchive();

      expect(getNumberOfRows()).toBe(originalNumberOfRows);
    });

    it('should ungroup unarchived child if parent is still archived', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const allCheckboxes = getAllCheckboxes(container);

      // archive the group
      await userEvent.click(allCheckboxes[0]);
      await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

      await switchToArchiveMode(container);

      // unarchive the child
      const allArchivedCheckboxes = getAllCheckboxes(container);
      await userEvent.click(allArchivedCheckboxes[1]);
      await userEvent.click(screen.getByText(UNARCHIVE_BUTTON_TEXT));

      const firstChild = data[1];
      const firstParent = data[0];
      expect(updateEventTypeMock).toHaveBeenCalledWith({
        ...firstChild,
        parent_custom_event_type_id: null,
      });

      await switchToViewModeFromArchive();

      // expect child name to be, parent not - child is ungrouped.
      expect(screen.getByText(firstChild.name)).toBeInTheDocument();
      expect(screen.queryByText(firstParent.name)).not.toBeInTheDocument();
    });

    it('should not ungroup unarchived child because parent is also archived', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const allCheckboxes = getAllCheckboxes(container);
      const [parent, child1, child2] = data;

      // archive the group
      await userEvent.click(allCheckboxes[0]);
      await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

      await switchToArchiveMode(container);

      // unarchive the parent
      const allArchivedCheckboxes = getAllCheckboxes(container);
      await userEvent.click(allArchivedCheckboxes[0]);
      await userEvent.click(screen.getByText(UNARCHIVE_BUTTON_TEXT));

      await switchToViewModeFromArchive();

      expect(updateEventTypeMock).toHaveBeenCalledWith(parent);
      expect(screen.getByText(parent.name)).toBeInTheDocument();
      [child1, child2].forEach((child) => {
        expect(updateEventTypeMock).toHaveBeenCalledWith(child);
        expect(screen.getByText(child.name)).toBeInTheDocument();
      });
    });

    it('should display archived group without children if parent is archived', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const allCheckboxes = getAllCheckboxes(container);
      const firstParent = groups[0];

      // archive the group
      await userEvent.click(allCheckboxes[0]);
      await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

      await switchToArchiveMode(container);

      // unarchive the parent
      const childrenToUnarchiveCheckboxes = Array.from(
        getAllCheckboxes(container)
      ).slice(0, firstParent.children.length);
      // eslint-disable-next-line no-restricted-syntax
      for (const childToUnarchiveCheckbox of childrenToUnarchiveCheckboxes) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(childToUnarchiveCheckbox);
      }

      await userEvent.click(screen.getByText(UNARCHIVE_BUTTON_TEXT));

      expect(screen.getByText(firstParent.name)).toBeInTheDocument();
    });

    it("should archive all of the group children, but not the parent and in archive mode, the parent's checkbox should be disabled", async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const firstParent = groups[0];
      const numberOfChildren = firstParent.children.length;
      const allCheckboxes = Array.from(getAllCheckboxes(container));
      const children = allCheckboxes.slice(1, numberOfChildren + 1);

      // eslint-disable-next-line no-restricted-syntax
      for (const child of children) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(child);
      }

      await userEvent.click(screen.getByText(ARCHIVE_BUTTON_TEXT));

      expect(screen.getAllByRole('row')[1]).toHaveTextContent(firstParent.name); // parent is still there

      await switchToArchiveMode(container);
      const parentCheckbox = container.querySelector(checkboxSelector);
      expect(parentCheckbox).toBeDisabled();
    });

    it('should uncheck the parent if a child is unchecked, and recheck once the child is rechecked', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const firstParent = groups[0];
      const numberOfChildren = firstParent.children.length;
      const allCheckboxes = Array.from(getAllCheckboxes(container));
      const [parent, firstChild, ...restGroup] = allCheckboxes.slice(
        0,
        numberOfChildren + 1
      ); // the parent and its children

      // select group
      await userEvent.click(parent);

      // de-select the first child
      await userEvent.click(firstChild);

      expect(firstChild).not.toHaveClass(checkedClass);
      expect(parent).toHaveClass(indeterminateClass);

      restGroup.forEach((checkbox) => {
        expect(checkbox).toHaveClass(checkedClass);
      });
    });

    it('should have parent as indeterminate if children (even all) are selected, but parent is not', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const firstParent = groups[0];
      const numberOfChildren = firstParent.children.length;
      const allCheckboxes = Array.from(getAllCheckboxes(container));
      const [parent, ...children] = allCheckboxes.slice(
        0,
        numberOfChildren + 1
      ); // the parent and its children

      // eslint-disable-next-line no-restricted-syntax
      for (const child of children) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(child);
        expect(parent).toHaveClass(indeterminateClass);
      }

      expect(parent).toHaveClass(indeterminateClass);
    });

    // expectCheckboxesToBeEmpty has expect clauses
    // eslint-disable-next-line jest/expect-expect
    it('should reset checked checkboxes when switching page modes', async () => {
      const { container } = await renderComponent(<EventTypes {...props} />);
      const allCheckboxes = getAllCheckboxes(container);

      await userEvent.click(allCheckboxes[0]);

      // to archive
      await switchToArchiveMode(container);
      const allCheckboxesInArchiveMode = getAllCheckboxes(container);
      expectCheckboxesToBeEmpty(allCheckboxesInArchiveMode);

      await userEvent.click(allCheckboxesInArchiveMode[0]);

      await switchToViewModeFromArchive();

      // back to view
      const allCheckboxesAfterReturningFromArchiveMode =
        getAllCheckboxes(container);

      expectCheckboxesToBeEmpty(allCheckboxesAfterReturningFromArchiveMode);

      await userEvent.click(allCheckboxesAfterReturningFromArchiveMode[0]);

      // to edit and back
      await userEvent.click(screen.getByText(EDIT_BUTTON_TEXT));
      await userEvent.click(screen.getByText(CANCEL_BUTTON_TEXT));

      const allCheckboxesAfterReturningFromEditMode =
        getAllCheckboxes(container);
      expectCheckboxesToBeEmpty(allCheckboxesAfterReturningFromEditMode);
    });
  });
});
