// @flow
import { CIBodyPartsFieldTranslated as CIBodyParts } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/CIBodyParts';
import { PathologiesMultiCodingV2FieldTranslated as PathologiesMultiCodingV2 } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/PathologiesMultiCodingV2';

import { CIPathologiesFieldTranslated as CIPathologies } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/CIPathologies';
import DatePicker from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/DatePicker';
import DateRangePicker from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/DateRangePicker';
import CheckboxList from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/CheckboxList';
import RadioList from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/RadioList';
import { BodyPartsFieldMultiCodingV2Translated as BodyPartsFieldMultiCodingV2 } from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI/BodyPartsFieldMultiCodingV2';
import { CheckboxTranslated as Checkbox } from './Checkbox';

const MuiCommonFields = {
  Mui: {
    Checkbox,
    CheckboxList,
    RadioList,
    DatePicker,
    DateRangePicker,
    BodyPartsFieldMultiCodingV2,
    CIBodyParts,
    CIPathologies,
    PathologiesMultiCodingV2,
  },
};

export default MuiCommonFields;
