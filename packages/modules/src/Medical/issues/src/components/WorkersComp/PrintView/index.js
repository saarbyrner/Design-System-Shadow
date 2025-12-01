// @flow
import { Printable } from '@kitman/printing/src/renderers';
import { WorkersComp } from '@kitman/printing/src/templates';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';

type Props = {
  issue: IssueOccurrenceRequested,
  side: ?string,
  bodyArea: ?string,
};

const PrintView = (props: Props) => {
  return (
    <Printable>
      <WorkersComp {...props} />
    </Printable>
  );
};

export default PrintView;
