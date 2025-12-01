// @flow
import {
  type Props as LegacyProps,
  PrintBuilderTranslated as LegacyPrintBuilder,
} from './legacy';
import {
  type Props as BuilderProps,
  BuilderTranslated as PrintBuilder,
} from './components/Builder';
import { SettingsContextProvider } from './components/SettingsContext';

type Props = LegacyProps & BuilderProps;

function Root(props: Props) {
  if (!window.getFlag('rep-print-builder-new-layout')) {
    return <LegacyPrintBuilder {...props} />;
  }

  return (
    <SettingsContextProvider>
      <PrintBuilder
        dashboardName={props.dashboardName}
        close={props.close}
        widgets={props.widgets}
        dashboardPrintLayout={props.dashboardPrintLayout}
        printPaperSize={props.printPaperSize}
        squadAthletes={props.squadAthletes}
        squads={props.squads}
        annotationTypes={props.annotationTypes}
        currentUser={props.currentUser}
        appliedSquadAthletes={props.appliedSquadAthletes}
        pivotedDateRange={props.pivotedDateRange}
        pivotedTimePeriod={props.pivotedTimePeriod}
        pivotedTimePeriodLength={props.pivotedTimePeriodLength}
        onUpdateDashboardPrintLayout={props.onUpdateDashboardPrintLayout}
      />
    </SettingsContextProvider>
  );
}

export default Root;
