import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { errors } from '@kitman/common/src/variables';
import { data as getActivityTypesData } from '@kitman/services/src/mocks/handlers/planningHub/getActivityTypes';
import { data as getPrinciplesData } from '@kitman/services/src/mocks/handlers/planningHub/getPrinciples';
import { data as getDrillLabelsData } from '@kitman/services/src/mocks/handlers/planningHub/getDrillLabels';

import ActivityDrillPanel, {
  INITIAL_DRILL_ATTRIBUTES,
} from '../ActivityDrillPanel';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<ActivityDrillPanel />', () => {
  const props = {
    drill: INITIAL_DRILL_ATTRIBUTES,
    initialDrillState: INITIAL_DRILL_ATTRIBUTES,
    drillPrinciples: [
      {
        label: 'drill 1',
        value: 1,
      },
    ],
    eventActivityTypes: [
      {
        id: 1,
        name: 'Warm up',
      },
      {
        id: 2,
        name: 'Training',
      },
    ],
    isOpen: true,
    onClose: jest.fn(),
    onComposeActivityDrill: jest.fn(),
    setLibraryDrillToUpdate: jest.fn(),
    setSelectedDrill: jest.fn(),
    t: i18nextTranslateStub(),
  };

  describe('when prop `drill` isn’t passed', () => {
    it('shows the correct title', async () => {
      render(<ActivityDrillPanel {...props} />);
      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      expect(screen.getByText('Create new drill')).toBeInTheDocument();
      expect(screen.queryByText('Edit drill')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Cancel' })
      ).not.toBeInTheDocument();
    });

    it('calls prop `onComposeActivityDrill` if ‘Drill name’ and ‘Activity type’ aren’t filled', async () => {
      const user = userEvent.setup();
      render(<ActivityDrillPanel {...props} />);

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      await user.click(screen.getAllByRole('button', { name: 'Add' })[1]);

      expect(props.onComposeActivityDrill).not.toHaveBeenCalled();
    });

    it('calls prop `onComposeActivityDrill` with the correct arguments if ‘Drill name’, ‘Activity type’ and ‘Squads’ are filled', async () => {
      const name = 'Drill name';
      const eventWithMandatoryFields = {
        ...props.drill,
        name,
        event_activity_type_id: getActivityTypesData[0].id,
        event_activity_type: getActivityTypesData[0],
        squad_ids: [1],
      };

      const user = userEvent.setup();
      render(
        <ActivityDrillPanel {...props} drill={eventWithMandatoryFields} />
      );

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );

      await user.click(screen.getAllByRole('button', { name: 'Add' })[1]);

      expect(props.onComposeActivityDrill).toHaveBeenCalledTimes(1);
      expect(props.onComposeActivityDrill).toHaveBeenCalledWith({
        drill: {
          ...INITIAL_DRILL_ATTRIBUTES,
          name,
          event_activity_type_id: getActivityTypesData[0].id,
          event_activity_type: getActivityTypesData[0],
          squad_ids: [1],
        },
        diagram: null,
        attachments: [],
      });
    });
  });

  describe('when prop `drill` is passed', () => {
    const drill = {
      ...INITIAL_DRILL_ATTRIBUTES,
      id: 123,
      name: 'Existing drill name',
      event_activity_type_id: getActivityTypesData[1].id,
      event_activity_type: getActivityTypesData[1],
      squad_ids: [1],
      notes: '<p>Existing drill description.</p>',
      principle_ids: [getPrinciplesData[0].id],
      event_activity_drill_labels: getDrillLabelsData.slice(0, 1),
      intensity: 'high',
      links: [
        {
          id: 0,
          title: 'Existing link title',
          uri: 'http://existing.example.com',
        },
      ],
    };

    it('shows the correct title', async () => {
      render(<ActivityDrillPanel {...props} drill={drill} />);

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      expect(screen.getByText('Drill detail')).toBeInTheDocument();
      expect(screen.queryByText('Create new drill')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
    });

    it('doesn’t call prop `onComposeActivityDrill` if ‘Activity type’ aren’t filled', async () => {
      const eventWithoutMandatoryFields = {
        ...drill,
        name: null,
        event_activity_type_id: null,
        event_activity_type: {
          id: '',
          name: '',
        },
      };
      const user = userEvent.setup();
      render(
        <ActivityDrillPanel {...props} drill={eventWithoutMandatoryFields} />
      );

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );

      await user.click(screen.getAllByRole('button', { name: 'Add' })[1]);

      expect(props.onComposeActivityDrill).not.toHaveBeenCalled();
    });

    it('calls the correct props with the correct arguments if ‘Drill name’, ‘Activity type’ and ‘Squads’ are filled', async () => {
      const user = userEvent.setup();
      render(<ActivityDrillPanel {...props} drill={drill} />);

      // 3 calls are made initially.
      expect(props.setSelectedDrill).toHaveBeenCalledTimes(3);

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );

      await user.click(screen.getByRole('button', { name: 'Update' }));

      expect(props.onComposeActivityDrill).toHaveBeenCalledTimes(1);
      expect(props.onComposeActivityDrill).toHaveBeenCalledWith({
        drill: {
          ...drill,
          name: 'Existing drill name',
          event_activity_type_id: getActivityTypesData[1].id,
        },
        diagram: null,
        attachments: [],
      });
      // 2 calls are made initially, 1 call is made on clicking ‘Update’ button
      // and 1 call is made by the same input again.
      expect(props.setSelectedDrill).toHaveBeenCalledTimes(4);
    });

    it('calls the correct props with the correct arguments if ‘Drill name’ and ‘Activity type’ are filled and it’s an archived drill', async () => {
      const archivedDrill = { ...drill, archived: true };

      const user = userEvent.setup();
      render(
        <ActivityDrillPanel
          {...props}
          canRestoreFromArchive
          drill={archivedDrill}
          initialDrillState={archivedDrill}
        />
      );

      // 3 calls are made initially.
      expect(props.setSelectedDrill).toHaveBeenCalledTimes(3);

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );

      await user.click(screen.getByRole('button', { name: 'Restore' }));

      expect(props.onComposeActivityDrill).toHaveBeenCalledTimes(1);
      // 2 calls are made initially and 1 call is made on click.
      expect(props.setSelectedDrill).toHaveBeenCalledTimes(3);
    });

    it('calls prop `setLibraryDrillToUpdate` if ‘Drill name’ ‘Library’ and ‘Activity type’ are filled', async () => {
      const user = userEvent.setup();
      render(
        <ActivityDrillPanel
          {...props}
          initialDrillState={{ ...drill, library: true }}
          drill={{ ...drill, library: true }}
          selectedDrillIsLibraryItem
        />
      );

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      await user.click(screen.getAllByRole('button', { name: 'Update' })[0]);

      expect(props.setLibraryDrillToUpdate).toHaveBeenCalledWith({
        drill: { ...drill, library: true },
        diagram: null,
        attachments: [],
      });
    });

    it('should call trackEvent on creation of drill', async () => {
      const user = userEvent.setup();
      render(
        <ActivityDrillPanel
          {...props}
          initialDrillState={{ ...drill, library: true }}
          drill={{ ...drill, library: true }}
          selectedDrillIsLibraryItem
        />
      );

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      await user.click(screen.getAllByRole('button', { name: 'Update' })[0]);
    });
  });

  describe('prop `activityNameInputInvalidityReason`', () => {
    it('shows the correct drill name validation error if the prop equals to `NAME_HAS_BEEN_TAKEN_ERROR.message`', () => {
      render(
        <ActivityDrillPanel
          {...props}
          activityNameInputInvalidityReason={
            errors.NAME_HAS_BEEN_TAKEN_ERROR.message
          }
        />
      );

      expect(
        screen.getByText(
          'A drill with the same name already exists in the library. Please enter a different name'
        )
      ).toBeInTheDocument();
    });

    it('doesn’t show the correct drill name validation error if the prop equals to an empty string', () => {
      render(<ActivityDrillPanel {...props} />);

      expect(
        screen.queryByText(
          'A drill with the same name already exists in the library. Please enter a different name'
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('when prop `initialDrillState` has `archived: true`', () => {
    it('renders correctly', async () => {
      const drill = {
        ...INITIAL_DRILL_ATTRIBUTES,
        id: 123,
        name: 'Existing drill name',
        event_activity_type_id: getActivityTypesData[1].id,
        event_activity_type: getActivityTypesData[1],
        notes: '<p>Existing drill description.</p>',
        principle_ids: [getPrinciplesData[0].id],
        event_activity_drill_labels: getDrillLabelsData.slice(0, 1),
        intensity: 'high',
        links: [
          {
            id: 0,
            title: 'Existing link title',
            uri: 'http://existing.example.com',
          },
        ],
        archived: true,
      };

      render(
        <ActivityDrillPanel
          {...props}
          drill={drill}
          initialDrillState={drill}
        />
      );

      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );

      // The main action button.
      expect(screen.queryByText('Required')).not.toBeInTheDocument();
      expect(screen.queryByText('Update')).not.toBeInTheDocument();
      expect(screen.queryByText('Add')).not.toBeInTheDocument();

      // The label next to the title of the side panel.
      expect(screen.queryByText('In library')).not.toBeInTheDocument();
      expect(screen.queryByText('Not in library')).not.toBeInTheDocument();

      // The link form.
      expect(screen.queryByText('Title')).not.toBeInTheDocument();
      expect(screen.queryByText('URL')).not.toBeInTheDocument();

      expect(screen.queryByText('Attach file(s)')).not.toBeInTheDocument();
      expect(screen.getByText('File(s)')).toBeInTheDocument();

      expect(
        screen.queryByText('Save to drill library')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });
});
