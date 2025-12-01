// @flow
import { Fragment, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { Checkbox, Dropdown, InputText } from '@kitman/components';
import type { DropdownItem } from '@kitman/components/src/types';
import type { Grades } from '@kitman/services/src/services/medical/getGrades';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  bamicGrades: Grades,
  osicsPathologyOptions: Array<DropdownItem>,
  osicsClassificationOptions: Array<DropdownItem>,
  bodyAreaOptions: Array<DropdownItem>,
  sideOptions: Array<DropdownItem>,
  issueTypeOptions: Array<DropdownItem>,
  osicsPathology: string,
  osicsClassification: string,
  bodyArea: string,
  side: string,
  osicsCode: string,
  icdCode: string,
  injuryOsics: Array<{ id: string, bamic: ?boolean }>,
  bamicGradeId: ?number | ?string,
  bamicSiteId: ?string,
  updateBamicGradeId: Function,
  updateBamicSiteId: Function,
  typeId: string,
  populateIssueDetails: Function,
  updateOsicsClassification: Function,
  updateBodyArea: Function,
  updateSide: Function,
  updateType: Function,
  isFetchingIssueDetails: boolean,
  formType: 'INJURY' | 'ILLNESS',
  hasRecurrence: boolean,
  hasSupplementaryPathology: boolean,
  supplementaryPathology: string,
  updateHasSupplementaryPathology: Function,
  updateSupplementaryPathology: Function,
};

const IssueDetails = (props: I18nProps<Props>) => {
  const [injuryOsicsById, setInjuryOsicsById] = useState({});

  useEffect(() => {
    const map = props.injuryOsics.reduce((osicsById, osic) => {
      // eslint-disable-next-line no-param-reassign
      osicsById[osic.id] = osic.bamic;
      return osicsById;
    }, {});
    setInjuryOsicsById(map);
  }, [props.injuryOsics]);

  const sectionTitleClass = props.hasRecurrence
    ? 'col-lg-12 athleteIssueEditor__sectionTitle athleteIssueEditor__sectionTitle--disabled'
    : 'col-lg-12 athleteIssueEditor__sectionTitle';
  const oscicsFieldClass = props.hasRecurrence
    ? 'col-lg-4 athleteIssueEditor__oscicsField athleteIssueEditor__oscicsField--disabled'
    : 'col-lg-4 athleteIssueEditor__oscicsField';

  const buildBamicGradeOptions = () => {
    return props.bamicGrades.map((bamicGrade) => ({
      id: bamicGrade.id,
      title: bamicGrade.name,
    }));
  };

  const buildBamicSiteOptions = () => {
    if (props.bamicGradeId === null || props.bamicGradeId === undefined) {
      return [];
    }

    const bamicGrade = props.bamicGrades.find(
      ({ id }) => id === props.bamicGradeId
    );
    const siteOptions = bamicGrade ? bamicGrade.sites : [];
    return siteOptions.map((site) => ({
      id: site.id,
      title: siteOptions.find(({ id }) => id === site.id)?.name,
    }));
  };

  const isInjuryBamicGrade = (osicsCode: string) => injuryOsicsById[osicsCode];

  const renderBamicFields = (
    formType: 'INJURY' | 'ILLNESS',
    osicsCode: string
  ) => {
    if (formType === 'ILLNESS' || !isInjuryBamicGrade(osicsCode)) {
      return null;
    }

    if (!window.featureFlags['include-bamic-on-injury']) {
      return null;
    }

    const bamicSiteOptions = buildBamicSiteOptions();
    return (
      <div className="row athleteIssueEditor__row">
        <div className="col-lg-3">
          <Dropdown
            label={`${props.t('Grade')} (${props.t('optional')})`}
            name="athleteIssueEditor_bamic_grade"
            items={buildBamicGradeOptions()}
            onChange={(gradeId) => props.updateBamicGradeId(gradeId)}
            value={props.bamicGradeId || ''}
          />
        </div>
        <div className="col-lg-4">
          <Dropdown
            label={`${props.t('Site')} (${props.t('optional')})`}
            name="athleteIssueEditor_bamic_site"
            items={bamicSiteOptions}
            onChange={(siteId) => props.updateBamicSiteId(siteId)}
            value={props.bamicSiteId || ''}
            disabled={bamicSiteOptions.length === 0}
          />
        </div>
      </div>
    );
  };

  const renderInjuryTypeField = () => (
    <div className="row athleteIssueEditor__row">
      <div className="col-lg-4">
        <Dropdown
          label={props.t('Onset')}
          items={props.issueTypeOptions}
          value={props.typeId}
          onChange={(typeId) => props.updateType(typeId)}
          disabled={props.hasRecurrence}
          name="athleteIssueEditor_onset_input"
        />
      </div>
    </div>
  );

  const renderSupplementaryPathologyRow = () => {
    if (props.hasSupplementaryPathology) {
      return (
        <div className="row athleteIssueEditor__row">
          <div className="col-lg-8 test-athleteIssueEditor__supplementaryPathologyFieldWrapper">
            <InputText
              className="test-athleteIssueEditor__supplementaryPathology"
              value={props.supplementaryPathology}
              label={props.t('Alternative Description')}
              maxLength={128}
              required={false}
              showRemainingChars={false}
              onValidation={(input) =>
                props.updateSupplementaryPathology(input.value)
              }
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSupplementaryPathologyCheckbox = () =>
    props.osicsPathology !== null ? (
      <div className="col-lg-4 athleteIssueEditor__showSupplementaryPathologyField">
        <Checkbox
          label={props.t('Supplementary Pathology')}
          id="showSupplementaryPathology"
          name="showSupplementaryPathology"
          isLabelPositionedOnTheLeft
          isChecked={props.hasSupplementaryPathology}
          toggle={(checkbox) =>
            props.updateHasSupplementaryPathology(checkbox.checked)
          }
        />
      </div>
    ) : null;

  const renderPathologyRow = () => {
    if (window.featureFlags['custom-pathologies'] === true) {
      return (
        <div>
          <div className="row athleteIssueEditor__row">
            <h5 className={sectionTitleClass}>
              {props.formType === 'INJURY'
                ? props.t('Nature of Injury')
                : props.t('Nature of Illness')}
            </h5>
            <div className="col-lg-8">
              <Dropdown
                label={props.t('Pathology')}
                items={props.osicsPathologyOptions}
                value={props.osicsPathology}
                onChange={(pathologyId) =>
                  props.populateIssueDetails(pathologyId)
                }
                disabled={props.hasRecurrence || props.isFetchingIssueDetails}
                searchable
              />
            </div>
            {renderSupplementaryPathologyCheckbox()}
          </div>
          {renderSupplementaryPathologyRow()}
          <div className="row athleteIssueEditor__row">
            <div className="col-lg-6">
              <Dropdown
                label={props.t('Classification')}
                items={props.osicsClassificationOptions}
                value={props.osicsClassification}
                onChange={(classificationId) =>
                  props.updateOsicsClassification(classificationId)
                }
                disabled={props.hasRecurrence || props.isFetchingIssueDetails}
                searchable
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="row athleteIssueEditor__row">
        <h5 className={sectionTitleClass}>
          {props.formType === 'INJURY'
            ? props.t('Nature of Injury')
            : props.t('Nature of Illness')}
        </h5>
        <div className="col-lg-8">
          <Dropdown
            label={props.t('Pathology')}
            items={props.osicsPathologyOptions}
            value={props.osicsPathology}
            onChange={(pathologyId) => props.populateIssueDetails(pathologyId)}
            disabled={props.hasRecurrence || props.isFetchingIssueDetails}
            searchable
          />
        </div>
        <div className="col-lg-4">
          <Dropdown
            label={props.t('Classification')}
            items={props.osicsClassificationOptions}
            value={props.osicsClassification}
            onChange={(classificationId) =>
              props.updateOsicsClassification(classificationId)
            }
            disabled={props.hasRecurrence || props.isFetchingIssueDetails}
            searchable
          />
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      {renderPathologyRow()}
      <div className="row athleteIssueEditor__row">
        <div className="col-lg-4">
          <Dropdown
            label={props.t('Body Area')}
            items={props.bodyAreaOptions}
            value={props.bodyArea}
            onChange={(bodyAreaId) => props.updateBodyArea(bodyAreaId)}
            disabled={props.hasRecurrence || props.isFetchingIssueDetails}
            searchable
          />
        </div>
        <div className="col-lg-4 athleteIssueEditor__sideField">
          <Dropdown
            label={props.t('Side')}
            items={props.sideOptions}
            value={props.side}
            onChange={(sideId) => props.updateSide(sideId)}
            disabled={props.hasRecurrence}
            searchable
          />
        </div>
        <div className={oscicsFieldClass}>
          <div>
            <strong className="athleteIssueEditor__oscicsLabel">{`${props.t(
              'OSICS'
            )}:`}</strong>
            {` ${props.osicsCode || props.t('None')}`}
          </div>
          <div>
            <strong className="athleteIssueEditor__oscicsLabel">ICD11:</strong>
            {` ${props.icdCode || props.t('None')}`}
          </div>
        </div>
      </div>
      {renderInjuryTypeField()}
      {renderBamicFields(props.formType, props.osicsCode)}
    </Fragment>
  );
};

export const IssueDetailsTranslated = withNamespaces()(IssueDetails);
export default IssueDetails;
