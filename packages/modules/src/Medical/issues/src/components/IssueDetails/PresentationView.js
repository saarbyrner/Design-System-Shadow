// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Box } from '@kitman/playbook/components';

import { type I18nProps } from '@kitman/common/src/types/i18n';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import PresentationViewItem from '@kitman/modules/src/Medical/shared/components/PresentationViewItem';
import {
  getCodingSystemFromIssue,
  getFreetextValue,
  isV2MultiCodingSystem,
} from '@kitman/modules/src/Medical/shared/utils';
import style from './styles/presentationView';

type Props = {
  highlightEmptyFields?: boolean,
};

const PresentationView = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();
  const { issue, isChronicIssue } = useIssue();
  const codingSystemIsOSICS10 =
    organisation.coding_system_key === codingSystemKeys.OSICS_10;
  const isV2CodingSystem = isV2MultiCodingSystem(
    organisation.coding_system_key
  );
  const codingSystemIsCI =
    organisation?.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS;
  const pathology =
    Array.isArray(issue?.coding?.pathologies) &&
    issue?.coding?.pathologies.length > 0
      ? issue.coding.pathologies[0]
      : {}; // This will be the standard data shape
  const isReadyToRenderOsiics15Info =
    isV2CodingSystem && pathology && pathology.pathology; // Osiic15

  const issueIsConcussion = useMemo(() => {
    if (!issue) {
      return false;
    }
    const coding = getCodingSystemFromIssue(issue);
    return coding?.groups?.includes('concussion');
  }, [issue]);

  const osicsInfo = window.featureFlags['emr-multiple-coding-systems']
    ? issue?.coding?.[codingSystemKeys.OSICS_10]
    : issue.osics;

  const osiics15Info =
    Array.isArray(issue?.coding?.pathologies) &&
    issue?.coding?.pathologies.length > 0
      ? issue.coding.pathologies[0]
      : {};

  const onsetName = isChronicIssue ? issue.onset_type.name : issue.onset;
  const onsetFreetext = getFreetextValue(issue, 'issue_occurrence_onsets');
  const osiics15Items = [
    {
      label: 'Classification',
      value: osiics15Info.coding_system_classification?.name,
    },
    { label: 'Body Area', value: osiics15Info.coding_system_body_area?.name },
    { label: 'Code', value: osiics15Info.code },
    { label: 'Side', value: osiics15Info.coding_system_side?.side_name },
    { label: 'Onset', value: onsetName },
  ];

  const showAdditionalDetails =
    window.featureFlags['concussion-medical-area'] && issueIsConcussion;

  const pathologyName = () => {
    if (isReadyToRenderOsiics15Info) {
      return typeof pathology.pathology === 'string' ? pathology.pathology : '';
    }
    if (
      window.featureFlags['emr-multiple-coding-systems'] &&
      issue?.coding?.[codingSystemKeys.CLINICAL_IMPRESSIONS]
    ) {
      return issue?.coding?.[codingSystemKeys.CLINICAL_IMPRESSIONS]?.pathology;
    }
    if (!window.featureFlags['emr-multiple-coding-systems']) {
      return osicsInfo?.osics_pathology;
    }
    return (
      osicsInfo?.osics_pathology ||
      issue?.coding?.[codingSystemKeys.ICD]?.diagnosis ||
      issue?.coding?.[codingSystemKeys.DATALYS]?.pathology ||
      issue?.osics?.osics_pathology ||
      ''
    );
  };

  const getSecondaryPathologies = () => {
    // Secondary pathologies only available for CLINICAL_IMPRESSIONS
    const coding = issue?.coding?.[codingSystemKeys.CLINICAL_IMPRESSIONS];

    return coding?.secondary_pathologies || [];
  };

  const renderRelatedCodingSystemInfo = (
    items: Array<{ value: ?string, label: ?string }>
  ) => {
    const allItems = items.map((v) => {
      const displayValue = v.value ?? 'N/A';
      const displayLabel = v.label ?? 'N/A';

      return (
        <PresentationViewItem
          key={displayValue + displayLabel}
          label={displayLabel}
          value={displayValue}
          highlightEmptyFields={props.highlightEmptyFields}
        />
      );
    });
    return allItems;
  };
  const shouldRenderDateOfInjuryDatePicker =
    window.featureFlags['pm-editing-examination-and-date-of-injury'] === true &&
    !codingSystemIsCI;

  const examinationDateIsBeforeOccurrence = moment(
    issue.examination_date
  ).isBefore(moment(issue.occurrence_date));
  return (
    <>
      <ul css={style.details}>
        <li>
          <PresentationViewItem
            label={props.t('Pathology')}
            value={pathologyName()}
            highlightEmptyFields={props.highlightEmptyFields}
          />
        </li>
        {issue.supplementary_pathology && (
          <li css={style.supplementalPathology}>
            <PresentationViewItem
              label={props.t('Supplemental Pathology')}
              value={issue.supplementary_pathology}
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
        )}
        {window.featureFlags['supplemental-recurrence-code'] &&
          issue.supplementary_coding &&
          issue?.occurrence_type === 'recurrence' && (
            <li>
              <PresentationViewItem
                label={props.t('Supplemental Recurrence')}
                value={issue.supplementary_coding}
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
          )}

        {shouldRenderDateOfInjuryDatePicker && (
          <li>
            <PresentationViewItem
              label={
                isChronicIssue
                  ? props.t('Onset date')
                  : props.t('Date of injury')
              }
              value={DateFormatter.formatStandard({
                date: moment(issue.occurrence_date),
              })}
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
        )}
        {window.featureFlags['examination-date'] && (
          <Box
            sx={{
              display: 'inline',
              '& li': { display: 'inline-flex', marginTop: '-0.25em' }, // Adjust for icon
              '& svg': { marginBottom: '0', paddingRight: '4px' },
            }}
          >
            <li>
              {examinationDateIsBeforeOccurrence && (
                <KitmanIcon name={KITMAN_ICON_NAMES.Warning} sx={{ mb: 1 }} />
              )}
              <PresentationViewItem
                label={props.t('Date of examination')}
                value={DateFormatter.formatStandard({
                  date: moment(issue.examination_date),
                })}
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
          </Box>
        )}
        {osicsInfo && codingSystemIsOSICS10 && (
          <>
            <li>
              <PresentationViewItem
                label={props.t('Classification')}
                value={osicsInfo.osics_classification}
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Body Area')}
                value={`${osicsInfo.osics_body_area}${
                  issue.side ? ` (${issue.side})` : ''
                }`}
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Code')}
                value={osicsInfo.osics_id}
              />
            </li>
          </>
        )}

        {isReadyToRenderOsiics15Info &&
          renderRelatedCodingSystemInfo(osiics15Items)}

        {(issue.coding?.icd_10_cm?.osics_body_area ||
          issue.coding?.icd_10_cm?.code) && (
          <>
            {issue.coding.icd_10_cm?.osics_body_area && (
              <li>
                <PresentationViewItem
                  label={props.t('Body Area')}
                  value={`${issue.coding.icd_10_cm?.osics_body_area || ''}${
                    issue.coding.icd_10_cm?.side
                      ? ` (${issue.coding.icd_10_cm?.side})`
                      : ''
                  }`}
                  highlightEmptyFields={props.highlightEmptyFields}
                />
              </li>
            )}
            {issue.coding.icd_10_cm?.code && (
              <li>
                <PresentationViewItem
                  label={props.t('Code')}
                  value={issue.coding.icd_10_cm?.code}
                  highlightEmptyFields={props.highlightEmptyFields}
                />
              </li>
            )}
          </>
        )}
        {issue?.coding?.[codingSystemKeys.DATALYS] && (
          <>
            <li>
              <PresentationViewItem
                label={props.t('Classification')}
                value={
                  issue?.coding[codingSystemKeys.DATALYS]
                    ?.datalys_classification
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Body Area')}
                value={
                  issue?.coding[codingSystemKeys.DATALYS]?.datalys_body_area
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Tissue type')}
                value={
                  issue?.coding[codingSystemKeys.DATALYS]?.datalys_tissue_type
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
          </>
        )}
        {issue?.coding?.[codingSystemKeys.CLINICAL_IMPRESSIONS] && (
          <>
            <li>
              <PresentationViewItem
                label={props.t('Classification')}
                value={
                  issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                    ?.clinical_impression_classification
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Body Area')}
                value={
                  issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                    ?.clinical_impression_body_area
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Side')}
                value={
                  issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.side
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
            <li>
              <PresentationViewItem
                label={props.t('Code')}
                value={
                  issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.code
                }
                highlightEmptyFields={props.highlightEmptyFields}
              />
            </li>
          </>
        )}
        {!isV2CodingSystem && (
          <li>
            <PresentationViewItem
              label={props.t('Onset type')}
              value={onsetName}
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
        )}
        {window.featureFlags['nfl-injury-flow-fields'] && onsetFreetext && (
          <li>
            <PresentationViewItem
              label={props.t('Other - Onset type')}
              value={onsetFreetext}
              highlightEmptyFields={props.highlightEmptyFields}
            />
          </li>
        )}
        {window.featureFlags['nfl-injury-flow-fields'] && (
          <li>
            <PresentationViewItem
              label={props.t('Description of onset')}
              value={issue.onset_description}
            />
          </li>
        )}
        {window.featureFlags['include-bamic-on-injury'] &&
          issue.bamic_grade_id && (
            <>
              <li>
                <PresentationViewItem
                  label={props.t('Grade')}
                  value={issue.bamic_grade.name}
                  highlightEmptyFields={props.highlightEmptyFields}
                />
              </li>
              <li>
                <PresentationViewItem
                  label={props.t('Site')}
                  value={issue.bamic_site.name}
                  highlightEmptyFields={props.highlightEmptyFields}
                />
              </li>
            </>
          )}
      </ul>

      {window.featureFlags['multi-part-injury-ci-code'] &&
        issue?.coding?.[codingSystemKeys.CLINICAL_IMPRESSIONS] &&
        getSecondaryPathologies().length > 0 && (
          <>
            <h2
              className="kitmanHeading--L3"
              css={style.secondaryCiCodeHeading}
            >
              {props.t('Secondary CI Code')}
            </h2>
            {getSecondaryPathologies().map((secondaryPathology) => {
              return (
                <ul key={secondaryPathology.id} css={style.details}>
                  <li>
                    <PresentationViewItem
                      label={props.t('Pathology')}
                      value={secondaryPathology.record?.pathology}
                      highlightEmptyFields={props.highlightEmptyFields}
                    />
                  </li>
                  {window.featureFlags['examination-date'] && (
                    <li>
                      <PresentationViewItem
                        label={props.t('Date of examination')}
                        value={DateFormatter.formatStandard({
                          date: moment(issue.examination_date),
                        })}
                        highlightEmptyFields={props.highlightEmptyFields}
                      />
                    </li>
                  )}
                  <li>
                    <PresentationViewItem
                      label={props.t('Classification')}
                      value={
                        secondaryPathology.record
                          ?.clinical_impression_classification?.name
                      }
                      highlightEmptyFields={props.highlightEmptyFields}
                    />
                  </li>
                  <li>
                    <PresentationViewItem
                      label={props.t('Body Area')}
                      value={
                        secondaryPathology.record?.clinical_impression_body_area
                          ?.name
                      }
                      highlightEmptyFields={props.highlightEmptyFields}
                    />
                  </li>
                  <li>
                    <PresentationViewItem
                      label={props.t('Side')}
                      value={
                        secondaryPathology.side?.name ||
                        issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                          ?.side
                      }
                      highlightEmptyFields={props.highlightEmptyFields}
                    />
                  </li>
                  <li>
                    <PresentationViewItem
                      label={props.t('Code')}
                      value={secondaryPathology.record?.code}
                      highlightEmptyFields={props.highlightEmptyFields}
                    />
                  </li>
                </ul>
              );
            })}
          </>
        )}

      {showAdditionalDetails && (
        <div css={style.additionalQuestions}>
          <h2 className="kitmanHeading--L3">
            {props.t('Additional questions')}
          </h2>
          <ul css={style.additionalDetails}>
            <li>
              <PresentationViewItem
                label={props.t(
                  'Was a concussion assessment performed at the scene?'
                )}
                value={
                  issue.concussion_assessments &&
                  issue.concussion_assessments.length > 0
                    ? props.t('Yes')
                    : props.t('No')
                }
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export const PresentationViewTranslated = withNamespaces()(PresentationView);
export default PresentationView;
