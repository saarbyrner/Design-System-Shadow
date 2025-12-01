// @flow
import { Printable } from '@kitman/printing/src/renderers';
import { OshaForm } from '@kitman/printing/src/templates';
import type { IssueOccurrenceRequested } from '../../../../../../../../common/src/types/Issues';

const PrintView = ({ issue }: { issue: IssueOccurrenceRequested }) => {
  return (
    <Printable isLandscape>
      <OshaForm issue={issue} />
    </Printable>
  );
};

export default PrintView;
