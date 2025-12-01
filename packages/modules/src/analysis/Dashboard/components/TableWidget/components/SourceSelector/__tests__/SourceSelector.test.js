import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { TABLE_WIDGET_DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

import SourceSelector from '../index';

jest.mock('@kitman/common/src/contexts/PermissionsContext');

describe('<SourceSelector />', () => {
  const triggerTestId = 'SourceSelector|TriggerElement';
  const triggerElement = <div data-testid={triggerTestId} />;
  const props = {
    t: i18nextTranslateStub(),
    triggerElement,
    // The menuItems gets memoed in the component so can't use a const across the tests
    menuItems: [
      TABLE_WIDGET_DATA_SOURCES.metric,
      TABLE_WIDGET_DATA_SOURCES.activity,
      TABLE_WIDGET_DATA_SOURCES.availability,
      TABLE_WIDGET_DATA_SOURCES.participation,
      TABLE_WIDGET_DATA_SOURCES.medical,
      TABLE_WIDGET_DATA_SOURCES.games,
      TABLE_WIDGET_DATA_SOURCES.formula,
      TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
    ],
    onClickSourceItem: jest.fn(),
  };

  describe('when one option is supplied', () => {
    it('calls the onClickSourceItem when clicking the trigger element', async () => {
      usePermissions.mockReturnValue({
        permissions: {
          analysis: { growthAndMaturationReportArea: { canView: true } },
        },
      });
      const user = userEvent.setup();

      render(<SourceSelector {...props} menuItems={['metric']} />);

      await user.click(screen.getByTestId(triggerTestId));

      // Tooltip won't be present unless more the 1 menuItem
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      expect(props.onClickSourceItem).toHaveBeenCalledWith('metric');
    });
  });

  describe('when all but table-widget-activity-source feature flags are off', () => {
    beforeEach(() => {
      window.setFlag('table-widget-activity-source', true);
      window.setFlag('table-widget-availability-data-type', false);
      window.setFlag('table-widget-participation-data-type', false);
      window.setFlag('table-widget-medical-data-type', false);
      window.setFlag('planning-game-events-field-view', false);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
      usePermissions.mockReturnValue({
        permissions: {
          analysis: { growthAndMaturationReportArea: { canView: true } },
        },
      });
    });

    afterEach(() => {
      window.setFlag('table-widget-activity-source', false);
      window.setFlag('table-widget-availability-data-type', false);
      window.setFlag('table-widget-participation-data-type', false);
      window.setFlag('table-widget-medical-data-type', false);
      window.setFlag('planning-game-events-field-view', false);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
    });

    it('does not render the related options', async () => {
      const user = userEvent.setup();

      render(
        <SourceSelector
          {...props}
          menuItems={[
            TABLE_WIDGET_DATA_SOURCES.metric,
            TABLE_WIDGET_DATA_SOURCES.activity,
            TABLE_WIDGET_DATA_SOURCES.availability,
            TABLE_WIDGET_DATA_SOURCES.participation,
            TABLE_WIDGET_DATA_SOURCES.medical,
            TABLE_WIDGET_DATA_SOURCES.games,
            TABLE_WIDGET_DATA_SOURCES.formula,
            TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
          ]}
        />
      );
      await user.click(screen.getByTestId(triggerTestId));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Metric is always present
      expect(
        screen.getByRole('button', { name: 'Metric' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Session activity' })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Availability' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Participation' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Medical' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Games' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Formula' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Growth and maturation' })
      ).not.toBeInTheDocument();
    });
  });

  describe('when the related feature flags are true', () => {
    beforeEach(() => {
      window.setFlag('table-widget-activity-source', true);
      window.setFlag('table-widget-availability-data-type', true);
      window.setFlag('table-widget-participation-data-type', true);
      window.setFlag('table-widget-medical-data-type', true);
      window.setFlag('planning-game-events-field-view', true);
      window.setFlag('rep-table-formula-columns', true);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        true
      );
      usePermissions.mockReturnValue({
        permissions: {
          analysis: { growthAndMaturationReportArea: { canView: true } },
        },
      });
    });

    afterEach(() => {
      window.setFlag('table-widget-activity-source', false);
      window.setFlag('table-widget-availability-data-type', false);
      window.setFlag('table-widget-participation-data-type', false);
      window.setFlag('table-widget-medical-data-type', false);
      window.setFlag('planning-game-events-field-view', false);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
    });

    it('renders the correct options', async () => {
      const user = userEvent.setup();

      render(
        <SourceSelector
          {...props}
          menuItems={[
            TABLE_WIDGET_DATA_SOURCES.metric,
            TABLE_WIDGET_DATA_SOURCES.activity,
            TABLE_WIDGET_DATA_SOURCES.availability,
            TABLE_WIDGET_DATA_SOURCES.participation,
            TABLE_WIDGET_DATA_SOURCES.medical,
            TABLE_WIDGET_DATA_SOURCES.games,
            TABLE_WIDGET_DATA_SOURCES.formula,
            TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
          ]}
        />
      );
      await user.click(screen.getByTestId(triggerTestId));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Metric' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Session activity' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Availability' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Participation' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Medical' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Games' })).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Formula' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Growth and maturation' })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: 'Session activity' })
      );
      expect(props.onClickSourceItem).toHaveBeenCalledWith('activity');
    });
  });

  describe('when the table-widget-activity-source feature flag is false', () => {
    beforeEach(() => {
      window.setFlag('table-widget-activity-source', false);
      window.setFlag('table-widget-availability-data-type', true);
      window.setFlag('table-widget-participation-data-type', true);
      window.setFlag('table-widget-medical-data-type', true);
      window.setFlag('planning-game-events-field-view', true);
      window.setFlag('rep-table-formula-columns', true);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        true
      );
      usePermissions.mockReturnValue({
        permissions: {
          analysis: { growthAndMaturationReportArea: { canView: true } },
        },
      });
    });

    afterEach(() => {
      window.setFlag('table-widget-activity-source', false);
      window.setFlag('table-widget-availability-data-type', false);
      window.setFlag('table-widget-participation-data-type', false);
      window.setFlag('table-widget-medical-data-type', false);
      window.setFlag('planning-game-events-field-view', false);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
    });

    it('does not render the formula option', async () => {
      const user = userEvent.setup();

      render(
        <SourceSelector
          {...props}
          menuItems={[
            TABLE_WIDGET_DATA_SOURCES.metric,
            TABLE_WIDGET_DATA_SOURCES.availability,
            TABLE_WIDGET_DATA_SOURCES.activity,
            TABLE_WIDGET_DATA_SOURCES.participation,
            TABLE_WIDGET_DATA_SOURCES.medical,
            TABLE_WIDGET_DATA_SOURCES.games,
            TABLE_WIDGET_DATA_SOURCES.formula,
            TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
          ]}
        />
      );
      await user.click(screen.getByTestId(triggerTestId));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Metric' })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Session activity' })
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Availability' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Participation' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Medical' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Games' })).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Formula' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Growth and maturation' })
      ).toBeInTheDocument();
    });
  });

  describe('when the rep-table-formula-columns feature flag is false', () => {
    beforeEach(() => {
      window.setFlag('table-widget-activity-source', true);
      window.setFlag('table-widget-availability-data-type', true);
      window.setFlag('table-widget-participation-data-type', true);
      window.setFlag('table-widget-medical-data-type', true);
      window.setFlag('planning-game-events-field-view', true);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        true
      );
      usePermissions.mockReturnValue({
        permissions: {
          analysis: { growthAndMaturationReportArea: { canView: true } },
        },
      });
    });

    afterEach(() => {
      window.setFlag('table-widget-activity-source', false);
      window.setFlag('table-widget-availability-data-type', false);
      window.setFlag('table-widget-participation-data-type', false);
      window.setFlag('table-widget-medical-data-type', false);
      window.setFlag('planning-game-events-field-view', false);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
    });

    it('does not render the formula option', async () => {
      const user = userEvent.setup();

      render(
        <SourceSelector
          {...props}
          menuItems={[
            TABLE_WIDGET_DATA_SOURCES.metric,
            TABLE_WIDGET_DATA_SOURCES.activity,
            TABLE_WIDGET_DATA_SOURCES.availability,
            TABLE_WIDGET_DATA_SOURCES.participation,
            TABLE_WIDGET_DATA_SOURCES.medical,
            TABLE_WIDGET_DATA_SOURCES.games,
            TABLE_WIDGET_DATA_SOURCES.formula,
            TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
          ]}
        />
      );
      await user.click(screen.getByTestId(triggerTestId));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Formula' })
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Metric' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Session activity' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Availability' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Participation' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Medical' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Games' })).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Growth and maturation' })
      ).toBeInTheDocument();
    });
  });

  describe('when ‘rep-pac-analysis-show-g-and-m-data-source-under-add-data’ feature flag is false', () => {
    beforeEach(() => {
      window.setFlag('table-widget-activity-source', true);
      window.setFlag('table-widget-availability-data-type', true);
      window.setFlag('table-widget-participation-data-type', true);
      window.setFlag('table-widget-medical-data-type', true);
      window.setFlag('planning-game-events-field-view', true);
      window.setFlag('rep-table-formula-columns', true);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
      usePermissions.mockReturnValue({
        permissions: {
          analysis: { growthAndMaturationReportArea: { canView: false } },
        },
      });
    });

    afterEach(() => {
      window.setFlag('table-widget-activity-source', false);
      window.setFlag('table-widget-availability-data-type', false);
      window.setFlag('table-widget-participation-data-type', false);
      window.setFlag('table-widget-medical-data-type', false);
      window.setFlag('planning-game-events-field-view', false);
      window.setFlag('rep-table-formula-columns', false);
      window.setFlag(
        'rep-pac-analysis-show-g-and-m-data-source-under-add-data',
        false
      );
    });

    it('does not render ‘Growth and maturation’ option when', async () => {
      const user = userEvent.setup();

      render(
        <SourceSelector
          {...props}
          menuItems={[
            TABLE_WIDGET_DATA_SOURCES.metric,
            TABLE_WIDGET_DATA_SOURCES.activity,
            TABLE_WIDGET_DATA_SOURCES.availability,
            TABLE_WIDGET_DATA_SOURCES.participation,
            TABLE_WIDGET_DATA_SOURCES.medical,
            TABLE_WIDGET_DATA_SOURCES.games,
            TABLE_WIDGET_DATA_SOURCES.formula,
            TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
          ]}
        />
      );
      await user.click(screen.getByTestId(triggerTestId));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Formula' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Metric' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Session activity' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Availability' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Participation' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Medical' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Games' })).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Growth and maturation' })
      ).not.toBeInTheDocument();
    });
  });
});
