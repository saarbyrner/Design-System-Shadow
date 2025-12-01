// @flow
/* eslint-disable no-console */
import { useState, useEffect, type ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import style from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/AddIssueSidePanelStyle';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { getInjuryOnset } from '@kitman/services';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import { SegmentedControl, SelectAndFreetext } from '@kitman/components';
import { Box } from '@kitman/playbook/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { type InjuryOnset } from '@kitman/services/src/services/medical/getInjuryOnset';
import { type IllnessOnset } from '@kitman/services/src/services/medical/getIllnessOnset';
import { type CodingSystemSide } from '@kitman/services/src/services/medical/getCodingSystemSides';
import { getCodingSystemSides } from '@kitman/services/src/services/medical';
import { useIsMountedCheck } from '@kitman/common/src/hooks';
import type { Details } from '@kitman/modules/src/Medical/issues/src/components/IssueDetails/index';
import IssueExaminationDatePicker from './components/IssueExaminationDatePicker';

import type {
  IssueType,
  StandardCodingSystemProps,
  CodingSystemSideProps,
  ExaminationDateProps,
  OnsetProps,
} from './types';
import { CodingSystemPathologyFieldsTranslated as CodingSystemPathologyFields } from './components/CodingSystemPathologyFields';

type Props = {
  athleteId: number | string,
  athleteData: AthleteData,
  codingSystemProps: StandardCodingSystemProps,
  examinationDateProps: ExaminationDateProps,
  invalidFields: Array<string>,
  issueType: IssueType,
  isChronicCondition: boolean,
  isEditMode: boolean,
  sideProps: CodingSystemSideProps,
  onsetProps: OnsetProps,
  getFieldLabel?: (field: string) => string,
  onSelectDetail: (
    detailType: string,
    detailValue: string | number | Object
  ) => void,
  details: Details,
};

const OSIICS15 = ({
  athleteId,
  athleteData,
  codingSystemProps,
  details,
  examinationDateProps,
  invalidFields,
  issueType,
  isChronicCondition,
  isEditMode,
  sideProps,
  onsetProps,
  onSelectDetail,
  t,
}: I18nProps<Props>) => {
  const checkIsMounted = useIsMountedCheck();

  const [codingSystemSides, setCodingSystemSides] = useState<
    Array<CodingSystemSide>
  >([]);
  const [onsets, setOnsets] = useState<Array<InjuryOnset | IllnessOnset>>([]);
  const { data: organisation } = useGetOrganisationQuery();
  const { getFieldLabel, isFieldVisible } = useIssueFields({
    issueType,
    skip: false,
  });

  useEffect(() => {
    const fetchCodingSystemSides = async () => {
      if (codingSystemSides.length === 0 && organisation?.coding_system_key) {
        try {
          const data = await getCodingSystemSides(
            organisation.coding_system_key,
            true
          );
          if (checkIsMounted()) setCodingSystemSides(data);
        } catch (error) {
          console.error('Error fetching coding system sides:', error); // Will be replaced by toast
        }
      }
    };

    fetchCodingSystemSides();
    getInjuryOnset().then((onsetData) => {
      if (checkIsMounted()) setOnsets(onsetData);
    });
  }, [codingSystemSides.length, setCodingSystemSides]);

  const renderDateOfExaminationPicker = () => {
    return (
      <IssueExaminationDatePicker
        athleteId={athleteId}
        athleteData={athleteData}
        examinationDateProps={examinationDateProps}
        isEditMode={isEditMode}
        getFieldLabel={getFieldLabel}
        onChangeExaminationDate={(date) => {
          if (isEditMode) {
            return examinationDateProps.onSelectExaminationDate(
              'examinationDate',
              moment(date).toISOString()
            );
          }
          return examinationDateProps.onSelectExaminationDate(
            moment(date).toISOString()
          );
        }}
        onChangeOccurrenceDate={(date) => {
          return onSelectDetail('occurrenceDate', date);
        }}
        type="examination"
        onSelectDetail={onSelectDetail}
        details={details}
      />
    );
  };

  const renderSideControl = () => {
    // Just an obj with pathology id and side id when passed and is a formatted obj with the other data when received
    const chronicConditionCreation = isChronicCondition && !isEditMode;
    const selectedSideId =
      sideProps.selectedSide ??
      codingSystemProps.selectedCodingSystemPathology?.coding_system_side_id ??
      codingSystemProps.selectedCodingSystemPathology?.coding_system_side
        ?.coding_system_side_id;

    return (
      <Box css={[style.sideSegmentedControl]}>
        <SegmentedControl
          buttons={codingSystemSides.map((side) => {
            // NOTE: Currently it is required on BE that when creating a chronic condition the side must be the generic side_id
            return {
              name: side.side_name,
              value: chronicConditionCreation
                ? side.side_id
                : side.coding_system_side_id,
            };
          })}
          invalid={invalidFields.includes('coding_system_side_id')}
          label={t('Side')}
          maxWidth={400}
          onClickButton={(buttonId) => {
            sideProps.onSelectSide(buttonId);
          }}
          selectedButton={selectedSideId}
          isDisabled={
            !!codingSystemProps.isPathologyFieldDisabled && !isEditMode
          }
        />
      </Box>
    );
  };

  const renderOnsetSelection = () => {
    let onsetOptions;
    // Check if arrays' objects are already in the needed shape
    if (onsets && typeof onsets[1] === 'object' && 'label' in onsets[1]) {
      onsetOptions = onsets;
    } else {
      onsetOptions = getSelectOptions(onsets);
    }
    return (
      <Box css={[style.flexCol, style.emrInjuryType]}>
        <SelectAndFreetext
          selectLabel={t('Onset Type')}
          selectedField={onsetProps.selectedOnset}
          onSelectedField={onsetProps.onSelectOnset || (() => {})}
          currentFreeText={onsetProps.onsetFreeText}
          onUpdateFreeText={onsetProps.onUpdateOnsetFreeText || (() => {})}
          invalidFields={
            invalidFields.includes('issue_occurrence_onset_id') ||
            invalidFields.includes('illness_onset_id')
          }
          // $FlowIgnore - types in this component need revisit
          options={onsetOptions}
          featureFlag={false}
        />
      </Box>
    );
  };

  return (
    <Box sx={style.flexCol}>
      <Box sx={[style.flexRow]}>
        {isEditMode && renderDateOfExaminationPicker()}
      </Box>
      <Box sx={[style.flexRow, style.codingSystemItems]}>
        {isFieldVisible('primary_pathology_id') && (
          <CodingSystemPathologyFields
            codingSystemProps={codingSystemProps}
            invalidFields={invalidFields}
            renderPathologyRelatedFields
            isEditMode={isEditMode}
          />
        )}
      </Box>
      <Box sx={[style.flexRow]}>
        {isFieldVisible('coding_system_side_id') && renderSideControl()}
      </Box>
      <Box sx={[style.flexRow]}>{renderOnsetSelection()}</Box>
    </Box>
  );
};

export const OSIICS15Translated: ComponentType<Props> =
  withNamespaces()(OSIICS15);
export default OSIICS15;
