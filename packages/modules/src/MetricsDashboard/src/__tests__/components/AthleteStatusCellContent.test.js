import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteStatusCellContent from '../../components/AthleteStatusCellContent';

// Render tooltip content inline for easier assertions later (kept even for first test)
jest.mock('@tippyjs/react', () => ({
  __esModule: true,
  default: ({ children, content }) => (
    <div>
      {children}
      {content}
    </div>
  ),
}));

setI18n(i18n);

describe('AthleteStatusCellContent Component', () => {
  const baseStatus = {
    status_id: 'status-1',
    description: 'Status description',
    localised_unit: 'Kg',
    name: 'Weight',
  };

  const buildProps = (overrides = {}) => ({
    athleteId: '99',
    statusValue: 29,
    status: baseStatus,
    datapointsUsed: 3,
    alarms: [],
    canViewGraph: true,
    t: i18nextTranslateStub(),
    ...overrides,
  });

  it('renders with status value', () => {
    render(<AthleteStatusCellContent {...buildProps()} />);
    expect(screen.getByRole('button', { name: '29' })).toBeInTheDocument();
  });

  describe('boolean true value', () => {
    it('shows Yes text', () => {
      render(
        <AthleteStatusCellContent
          {...buildProps({
            statusValue: 'Yes',
            status: {
              ...baseStatus,
              description: 'Backpain',
              localised_unit: '',
              name: 'Backpain',
            },
          })}
        />
      );
      expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    });
  });

  describe('boolean false value', () => {
    it('shows No text', () => {
      render(
        <AthleteStatusCellContent
          {...buildProps({
            statusValue: 'No',
            status: {
              ...baseStatus,
              description: 'Backpain',
              localised_unit: '',
              name: 'Backpain',
            },
          })}
        />
      );
      expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
    });
  });

  describe('null value', () => {
    it('shows - fallback', () => {
      render(
        <AthleteStatusCellContent {...buildProps({ statusValue: null })} />
      );
      expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    });
  });

  describe('alarms styling', () => {
    it('applies alarm colour class from first alarm', () => {
      const alarms = [
        {
          alarm_id: 'a1',
          condition: 'greater_than',
          value: 90,
          colour: 'colour1',
        },
        {
          alarm_id: 'a2',
          condition: 'greater_than',
          value: 80,
          colour: 'colour2',
        },
      ];
      const { container } = render(
        <AthleteStatusCellContent
          {...buildProps({ statusValue: 90.1, datapointsUsed: 1, alarms })}
        />
      );
      const root = container.querySelector('.athleteStatusCellContent');
      expect(root.className).toMatch(/athleteStatusCellContent--alarm_colour1/);
    });
  });

  describe('tooltip content', () => {
    const openStatus = { ...baseStatus };

    it('renders core tooltip structure and contents', () => {
      render(
        <AthleteStatusCellContent {...buildProps({ status: openStatus })} />
      );
      expect(screen.getByText(openStatus.name)).toBeInTheDocument();
      expect(screen.getByText('(Kg)')).toBeInTheDocument();
      expect(
        screen.getByText(openStatus.description, { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'More details' })
      ).toHaveAttribute(
        'href',
        `/analysis/graph/builder?deeplink=status&status_id=${openStatus.status_id}&athlete_id=99#graphView`
      );
    });

    it('no alarms listed when alarms array empty', () => {
      render(<AthleteStatusCellContent {...buildProps({ alarms: [] })} />);
      expect(
        document.querySelectorAll('.sparklineTooltip__alarmsItem').length
      ).toBe(0);
    });

    it('lists alarms with correct text formatting', () => {
      const alarms = [
        { alarm_id: 'al1', condition: 'equals', value: 1.5, colour: 'colour1' },
        {
          alarm_id: 'al2',
          condition: 'greater_than',
          value: 5,
          colour: 'colour2',
        },
        {
          alarm_id: 'al3',
          condition: 'less_than',
          value: 1,
          colour: 'colour3',
        },
      ];
      render(
        <AthleteStatusCellContent
          {...buildProps({ alarms, datapointsUsed: 1, statusValue: 1.0 })}
        />
      );
      const alarmItems = Array.from(
        document.querySelectorAll('.sparklineTooltip__alarmsItem')
      ).map((n) => n.textContent);
      expect(alarmItems).toEqual(['= 1.5', '> 5', '< 1']);
    });

    describe('alarmText formatting helpers', () => {
      it('boolean equals condition converts to Yes/No', () => {
        render(
          <AthleteStatusCellContent
            {...buildProps({
              status: { ...baseStatus, type: 'boolean', localised_unit: '' },
              statusValue: 1.0,
              datapointsUsed: 1,
            })}
          />
        );
        // Recompute using same helper path by creating alarms of each value
        const alarms = [
          { alarm_id: 'b1', condition: 'equals', value: 1, colour: '' },
          { alarm_id: 'b2', condition: 'equals', value: 0, colour: '' },
        ];
        render(
          <AthleteStatusCellContent
            {...buildProps({
              status: { ...baseStatus, type: 'boolean', localised_unit: '' },
              alarms,
            })}
          />
        );
        const texts = Array.from(
          document.querySelectorAll('.sparklineTooltip__alarmsItem')
        ).map((n) => n.textContent);
        expect(texts).toContain('Yes');
        expect(texts).toContain('No');
      });

      it('sleep duration values formatted as h:mm with conditions', () => {
        const alarms = [
          { alarm_id: 's1', condition: 'less_than', value: 480, colour: '' },
          { alarm_id: 's2', condition: 'equals', value: 465, colour: '' },
          { alarm_id: 's3', condition: 'greater_than', value: 630, colour: '' },
        ];
        render(
          <AthleteStatusCellContent
            {...buildProps({
              status: {
                ...baseStatus,
                type: 'sleep_duration',
                localised_unit: '',
              },
              alarms,
            })}
          />
        );
        const texts = Array.from(
          document.querySelectorAll('.sparklineTooltip__alarmsItem')
        ).map((n) => n.textContent);
        expect(texts).toContain('< 8:00');
        expect(texts).toContain('= 7:45');
        expect(texts).toContain('> 10:30');
      });
    });

    it('omits graph link when canViewGraph is false', () => {
      render(
        <AthleteStatusCellContent {...buildProps({ canViewGraph: false })} />
      );
      expect(
        document.querySelectorAll('.sparklineTooltip__detailLink').length
      ).toBe(0);
    });
  });
});
