import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDiagramPlaceholder } from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabActivity/utils';
import { data } from '@kitman/services/src/mocks/handlers/planning/getEventActivities';
import { tests } from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabActivity/__tests__/utilsTests';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import ActivitiesV2 from '../ActivitiesV2';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const getPlaceholder = (sport) =>
  `http://localhost${getDiagramPlaceholder(sport)}`;

describe('<ActivitiesV2 />', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  describe('shows sports-specific diagram placeholder based on organisation’s sport name', () => {
    it.each(tests.getDiagramPlaceholder)(
      'when the sport name is %s, it returns %s',
      (sport) => {
        render(
          <ActivitiesV2
            activities={data}
            templateType="default"
            organisationSport={sport}
            t={i18nextTranslateStub()}
          />
        );

        const diagrams = screen.getAllByRole('img');
        const firstDiagram = diagrams[0];
        expect(firstDiagram.src).toBe(getPlaceholder(sport));
      }
    );
  });
});
