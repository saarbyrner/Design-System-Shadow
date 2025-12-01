// @flow
import { Printable } from '@kitman/printing/src/renderers';
import { DocumentEntity } from '@kitman/printing/src/templates';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { MedicalFile } from '@kitman/modules/src/Medical/shared/types/medical/MedicalFile';
import type { EntityAttachment } from '@kitman/modules/src/Medical/shared/types/medical/EntityAttachment';

const PrintView = ({
  document,
  athleteData,
}: {
  document: MedicalFile | EntityAttachment,
  athleteData: AthleteData,
}) => {
  return (
    <Printable>
      <DocumentEntity document={document} athleteData={athleteData} />
    </Printable>
  );
};

export default PrintView;
