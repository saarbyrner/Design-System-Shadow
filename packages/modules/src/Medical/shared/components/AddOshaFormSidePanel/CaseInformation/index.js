// @flow
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  Checkbox,
  DatePicker,
  InputTextField,
  Textarea,
  TimePicker,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { updateCaseInformationField } from '../../../redux/actions';
import styles from './styles';

type Props = {};

const CaseInformation = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const caseInformation = useSelector(
    (state) => state.addOshaFormSidePanel.caseInformation
  );
  const [noTimeEvent, setNoTimeEvent] = useState(caseInformation?.noTimeEvent);

  return (
    <div data-testid="CaseInformation" css={styles.content}>
      <div css={styles.initialForm}>
        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|CaseNumber"
        >
          <InputTextField
            value={caseInformation.caseNumber}
            label={props.t('Case number from the Log')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateCaseInformationField('caseNumber', event.target.value)
              );
            }}
          />
          <p>
            (Transfer the case number from the Log after you record the case.)
          </p>
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|DateInjured"
        >
          <DatePicker
            value={caseInformation.dateInjured}
            label={props.t('Date of injury or illness')}
            name="date_injured"
            kitmanDesignSystem
            onDateChange={(value) => {
              dispatch(
                updateCaseInformationField(
                  'dateInjured',
                  moment(value).format(DateFormatter.dateTransferFormat)
                )
              );
            }}
          />
        </div>
        <div
          css={styles.rightColumnContainer}
          data-testid="AddOshaSidePanel|TimeBeganWork"
        >
          <TimePicker
            label={props.t('Time employee began work')}
            name="time_began_work"
            value={
              caseInformation.timeBeganWork &&
              moment(caseInformation.timeBeganWork)
            }
            onChange={(time) => {
              dispatch(
                updateCaseInformationField(
                  'timeBeganWork',
                  moment(time).format(DateFormatter.dateTransferFormat)
                )
              );
            }}
            kitmanDesignSystem
          />
        </div>
        {!noTimeEvent && (
          <div
            css={styles.leftColumnContainer}
            data-testid="AddOshaSidePanel|TimeEvent"
          >
            <TimePicker
              label={props.t('Time of event')}
              name="time_of_event"
              value={
                caseInformation.timeEvent && moment(caseInformation.timeEvent)
              }
              onChange={(time) => {
                dispatch(
                  updateCaseInformationField(
                    'timeEvent',
                    moment(time).format(DateFormatter.dateTransferFormat)
                  )
                );
              }}
              kitmanDesignSystem
            />
          </div>
        )}
        <div
          css={styles.noTimeEventContainer}
          data-testid="AddOshaSidePanel|TimeEventCheckBox"
        >
          <Checkbox
            label={props.t('Check if time of event cannot be determined')}
            id="noTimeEvent"
            name="no_time_event"
            isChecked={noTimeEvent}
            toggle={() => {
              setNoTimeEvent(!noTimeEvent);
              dispatch(
                updateCaseInformationField(
                  'noTimeEvent',
                  !caseInformation.noTimeEvent
                )
              );
            }}
          />
        </div>
        <div
          css={styles.textAreaContainer}
          data-testid="AddOshaSidePanel|AthleteActivity"
        >
          <Textarea
            label={props.t(
              'What was the employee doing just before the incident occurred?'
            )}
            optionalText={props.t(
              'Describe the activity, as well as the tools, equipment, or material the employee was using. Be specific. Examples: “climbing a ladder while carrying roofing materials”; “spraying chlorine from hand sprayer”; “daily computer key-entry.”'
            )}
            value={caseInformation.athleteActivity}
            onChange={(activity) =>
              dispatch(updateCaseInformationField('athleteActivity', activity))
            }
            maxLimit={65535}
            kitmanDesignSystem
            t={props.t}
          />
        </div>
        <div
          css={styles.textAreaContainer}
          data-testid="AddOshaSidePanel|WhatHappened"
        >
          <Textarea
            label={props.t('What happened?')}
            optionalText={props.t(
              'Tell us how the injury occured. Examples: “When the ladder slipped on wet flood, worker fell 20 feet”; “Worker was sprayed with chlorine when gasket broke during replacement”; “Worker developed soreness in wrist over time.”'
            )}
            value={caseInformation.whatHappened}
            onChange={(description) =>
              dispatch(updateCaseInformationField('whatHappened', description))
            }
            maxLimit={65535}
            kitmanDesignSystem
            t={props.t}
          />
        </div>
        <div
          css={styles.textAreaContainer}
          data-testid="AddOshaSidePanel|IssueDescription"
        >
          <Textarea
            label={props.t('What was the injury or illness?')}
            optionalText={props.t(
              'Tell us the part of the body that was affected and how it was affected; be more specific than “hurt”; “pain” or “sore”. Examples: “strained back”; “chemical burn, hand”; “carpal tunnel syndrome.”'
            )}
            value={caseInformation.issueDescription}
            onChange={(description) =>
              dispatch(
                updateCaseInformationField('issueDescription', description)
              )
            }
            maxLimit={65535}
            kitmanDesignSystem
            t={props.t}
          />
        </div>
        <div
          css={styles.textAreaContainer}
          data-testid="AddOshaSidePanel|ObjectSubstance"
        >
          <Textarea
            label={props.t(
              'What object or substance directly harmed the employee? '
            )}
            optionalText={props.t(
              'Examples: “concrete floor”; “chlorine”; “radial arm saw”. If this question does not apply to the incident, leave it blank. '
            )}
            value={caseInformation.objectSubstance}
            onChange={(substance) =>
              dispatch(updateCaseInformationField('objectSubstance', substance))
            }
            maxLimit={65535}
            kitmanDesignSystem
            t={props.t}
          />
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|DateOfDeath"
        >
          <DatePicker
            value={caseInformation.dateOfDeath || null}
            label={props.t('If the employee died, when did death occur?')}
            name="date_of_death"
            kitmanDesignSystem
            onDateChange={(value) => {
              dispatch(
                updateCaseInformationField(
                  'dateOfDeath',
                  moment(value).format(DateFormatter.dateTransferFormat)
                )
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const CaseInformationTranslated = withNamespaces()(CaseInformation);
export default CaseInformation;
