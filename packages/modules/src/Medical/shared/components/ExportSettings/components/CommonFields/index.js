// @flow
import MuiCommonFields from '@kitman/modules/src/Medical/shared/components/ExportSettings/components/CommonFields/MUI';
import { SquadFieldTranslated as Squads } from './Squads';
import { CIPathologiesFieldTranslated as CIPathologies } from './CIPathologies';
import { CIBodyPartsFieldTranslated as CIBodyParts } from './CIBodyParts';
import CheckboxList from './CheckboxList';

const CommonFields = {
  Squads,
  CheckboxList,
  CIPathologies,
  CIBodyParts,
  ...MuiCommonFields,
};

export default CommonFields;
