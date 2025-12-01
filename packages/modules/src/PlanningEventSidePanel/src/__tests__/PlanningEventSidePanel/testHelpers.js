// @flow

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import type { Event as PlanningEvent } from '@kitman/common/src/types/Event';
import PlanningEventSidePanel from '../../../index';
import type { PanelType, EditEventPanelMode } from '../../types';
import {
  commonProps,
  periodMock,
} from '../../__mocks__/PlanningEventSidePanel';

export const saveEvent = async () => userEvent.click(screen.getByText('Save'));

const defaultPlanningEventStoreInfo = {
  planningEvent: {
    gameActivities: {
      localGameActivities: [
        { absolute_minute: 0, kind: 'formation_change', relation: { id: 1 } },
      ],
      apiGameActivities: [],
    },
    eventPeriods: {
      localEventPeriods: periodMock,
      apiEventPeriods: periodMock,
    },
  },
};

export const componentRender = async (
  panelType: PanelType,
  planningEvent: PlanningEvent,
  panelMode: EditEventPanelMode = 'CREATE',
  /** @type {Partial<PlanningEvent>} */
  extraProps: any = {} // Partial doesn't work in our flow version
) => {
  const renderedComponent = await renderWithProviders(
    (((
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 500, itemHeight: 500 }}
      >
        <PlanningEventSidePanel
          {...commonProps}
          panelType={panelType}
          panelMode={panelMode}
          planningEvent={planningEvent}
          eventConditions={{
            surface_qualities: {
              id: 1,
              title: '',
            },
            weather_conditions: { id: 2, name: '' },
            surface_types: {
              id: 3,
              title: '',
            },
            temperature_units: 'C',
          }}
          {...extraProps}
        />
      </VirtuosoMockContext.Provider>
    ): any): Node),
    { preloadedState: defaultPlanningEventStoreInfo }
  );
  return { ...renderedComponent, user: userEvent.setup() };
};
