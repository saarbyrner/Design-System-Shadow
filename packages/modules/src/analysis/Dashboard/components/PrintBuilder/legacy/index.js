// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown, RadioList, TextButton } from '@kitman/components';
import { SizeMe, withSize } from 'react-sizeme';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type {
  PrintOrientation,
  PrintPaperSize,
} from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { WidgetData, User } from '../../../types';
import GridLayoutComp from './GridLayoutComp';
import type { PrintLayout } from '../types';

export type Props = {
  close: Function,
  widgets: Array<WidgetData>,
  dashboardPrintLayout: PrintLayout,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  annotationTypes: Array<Object>,
  appliedSquadAthletes?: SquadAthletesSelection,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  printPaperSize: PrintPaperSize,
  printOrientation: PrintOrientation,
  currentUser: User,
  onUpdateDashboardPrintLayout: Function,
  onUpdatePrintOrientation: Function,
  onUpdatePrintPaperSize: Function,
};

const withSizeHOC = withSize({ monitorWidth: true, monitorHeight: true });
const DashboardGridLayout = withSizeHOC(GridLayoutComp);

const PrintBuilder = (props: I18nProps<Props>) => {
  const pageShortSide = () => {
    if (props.printPaperSize === 'us_letter') {
      return props.printOrientation === 'portrait' ? 286 : 279;
    }
    // A4
    return props.printOrientation === 'portrait' ? 280 : 210;
  };
  const printMargin = 10;
  const aspectRatioMultiplier =
    props.printPaperSize === 'us_letter' ? 1.2941 : 1.414;

  const [pageWidth, setPageWidth] = useState(pageShortSide());
  const [docHeight, setDocHeight] = useState(0);
  const [pageHeight, setPageHeight] = useState(
    aspectRatioMultiplier * pageShortSide()
  );

  useEffect(() => {
    if (props.printOrientation === 'portrait') {
      setPageHeight(aspectRatioMultiplier * pageShortSide());
      setPageWidth(pageShortSide());
    } else {
      setPageHeight(pageShortSide());
      setPageWidth(aspectRatioMultiplier * pageShortSide());
    }
    props.onUpdateDashboardPrintLayout(props.dashboardPrintLayout);
  }, [props.printPaperSize, props.printOrientation]);

  const getNumberOfPages = () => {
    const docHeightInMm = docHeight * 0.26;
    return !docHeight || !pageHeight ? 0 : docHeightInMm / pageHeight;
  };

  const getDisplayNumberofPages = (numOfPages: number) => {
    return numOfPages === 0 ? '-' : Math.ceil(numOfPages);
  };

  const renderPageDividers = (width: number) => {
    const rawNumOfPages = Math.floor(getNumberOfPages());
    const numOfPages = rawNumOfPages < 1 ? 1 : rawNumOfPages;
    const printMarginInPx = printMargin / 0.26;
    const pageDividerData = [];
    for (let i = 0; i < numOfPages; i++) {
      pageDividerData.push({
        key: i,
        top: (i === 0 ? pageHeight : pageHeight * (i + 1)) + printMargin,
      });
    }
    return pageDividerData.map((divider) => (
      <div
        key={divider.key}
        className="printBuilder__pageDivider"
        style={{
          top: `${divider.top}mm`,
          left: `-${printMarginInPx}px`,
          width: `${width + printMarginInPx * 2}px`,
        }}
      >
        <span>{props.t('Page Break')}</span>
      </div>
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="printBuilder">
        <div className="printBuilder__header">
          <TextButton
            text={props.t('Back')}
            iconBefore="icon-next-left"
            onClick={() => props.close()}
          />
          <div className="printBuilder__titleContainer">
            <h2>{props.t('Print Layout')}</h2>
            <span className="pagesTotal">
              {props.t('Total {{numOfPages}} page(s)', {
                numOfPages: getDisplayNumberofPages(getNumberOfPages()),
              })}
            </span>
          </div>
          <TextButton
            type="primary"
            iconBefore="icon-print"
            text={props.t('Print')}
            onClick={() => handlePrint()}
          />
        </div>
        <div className="printBuilder__settingContainer">
          <div className="printBuilder__typeSelector">
            <Dropdown
              onChange={(printPaperSize) =>
                props.onUpdatePrintPaperSize(printPaperSize)
              }
              items={[
                {
                  id: 'a_4',
                  title: 'A4',
                },
                {
                  id: 'us_letter',
                  title: 'US Letter',
                },
              ]}
              label={props.t('Paper Type')}
              value={props.printPaperSize || ''}
            />
          </div>
          <div className="printBuilder__radioList">
            <RadioList
              radioName="settings_layout"
              label={props.t('Layout')}
              options={[
                {
                  name: props.t('Portrait'),
                  value: 'portrait',
                },
                {
                  name: props.t('Landscape'),
                  value: 'landscape',
                },
              ]}
              change={props.onUpdatePrintOrientation}
              value={props.printOrientation}
            />
          </div>
        </div>
        <div className="printBuilder__content">
          <div
            className="printBuilder__pageWrapper"
            style={{
              padding: `${printMargin}mm`,
              width: `${pageWidth + printMargin * 2}mm`,
            }}
          >
            <SizeMe
              monitorHeight
              render={({ size }) => {
                setDocHeight(size.height);
                return (
                  <div
                    className="printBuilder__pages"
                    style={{
                      minHeight: `${pageHeight}mm`,
                      width: `${pageWidth}mm`,
                    }}
                  >
                    {renderPageDividers(size.width)}
                    <div className="printBuilder__widgetContainer">
                      <DashboardGridLayout
                        onUpdateDashboardLayout={
                          props.onUpdateDashboardPrintLayout
                        }
                        layout={props.dashboardPrintLayout}
                        widgets={props.widgets}
                        squadAthletes={props.squadAthletes}
                        squads={props.squads}
                        annotationTypes={props.annotationTypes}
                        currentUser={props.currentUser}
                        appliedSquadAthletes={props.appliedSquadAthletes}
                        pivotedDateRange={props.pivotedDateRange}
                        pivotedTimePeriod={props.pivotedTimePeriod}
                        pivotedTimePeriodLength={props.pivotedTimePeriodLength}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintBuilder;
export const PrintBuilderTranslated = withNamespaces()(PrintBuilder);
