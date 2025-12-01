// @flow
import { useMemo, useRef, useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import uuid from 'uuid';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withNamespaces } from 'react-i18next';
import { TextLink, TextTag, TooltipMenu, TextButton } from '@kitman/components';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';
import { useFlexLayout } from 'react-table';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import DataTable from '../../../DataTable';
import getStyles from './styles';
import { TextHeader, TextCell } from '../AllergyTableCells';
import type {
  AllergyDataResponse,
  AthleteMedicalAlertDataResponse,
} from '../../../../types/medical';
import ArchiveMedicalFlagContainer from '../ArchiveMedicalFlagModal/index';

type Props = {
  onReachingEnd: Function,
  showAvatar?: boolean,
  allergies: Array<AllergyDataResponse>,
  athleteMedicalAlerts: Array<AthleteMedicalAlertDataResponse>,
  isFullyLoaded: boolean,
  isLoading: boolean,
  setRequestStatus: () => void,
  enableReloadData?: (enabled: boolean) => void,
  openAddMedicalAlertSidePanel: Function,
  openAddAllergySidePanel: Function,
};

type MedicalFlag = AllergyDataResponse | AthleteMedicalAlertDataResponse;

const AllergiesCardList = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const allergiesCardListRef = useRef();
  const [combinedMedicalFlags, setCombinedMedicalFlags] = useState<
    Array<MedicalFlag>
  >([]);
  const severities = ['severe', 'moderate', 'mild', 'none'];
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);
  const [selectedMedicalFlag, setSelectedMedicalFlag] = useState<MedicalFlag>(
    {}
  );

  const loadingStyle = {
    loadingText: css`
      color: ${colors.neutral_300};
      font-size: 14px;
      font-weight: normal;
      line-height: 20px;
      margin-top: 24px;
      text-align: center;
    `,
    AllergyCardList: css`
      height: calc(
        100vh - ${allergiesCardListRef.current?.getBoundingClientRect().y}px -
          20px
      );
      overflow-y: scroll;
    `,
    AllergyCardListEmpty: css`
      height: auto;
    `,
  };
  const style = getStyles();

  useEffect(() => {
    setCombinedMedicalFlags([
      ...props.allergies,
      ...props.athleteMedicalAlerts,
    ]);
  }, [props.allergies, props.athleteMedicalAlerts]);

  const getMedicalFlagTitle = (medicalFlag) => {
    if (medicalFlag.display_name) {
      return medicalFlag.display_name;
    }
    if (medicalFlag.alert_title) {
      return medicalFlag.alert_title;
    }
    return '';
  };

  const getMedicalFlagDetails = (medicalFlag) => {
    if (medicalFlag.allergen && medicalFlag.allergen.name) {
      return medicalFlag.allergen.name;
    }
    if (medicalFlag.medical_alert && medicalFlag.medical_alert.name) {
      return medicalFlag.medical_alert.name;
    }
    return '';
  };

  const returnActions = (medicalFlag) => {
    const actions: Array<TooltipItem> = [];

    if (
      (medicalFlag.allergen && permissions.medical.allergies.canArchive) ||
      (medicalFlag.medical_alert && permissions.medical.alerts.canArchive)
    ) {
      actions.push({
        description: props.t('Archive'),
        onClick: () => {
          setSelectedMedicalFlag(medicalFlag);
          setArchiveModalOpen(true);
        },
      });
    }

    if (window.featureFlags['edit-alerts-allergies']) {
      if (
        (medicalFlag.allergen && permissions.medical.allergies.canEdit) ||
        (medicalFlag.medical_alert && permissions.medical.alerts.canEdit)
      ) {
        actions.push({
          description: props.t('Edit'),
          onClick: () => {
            setSelectedMedicalFlag(medicalFlag);
            const sidePanelArgs = {
              isAthleteSelectable: false,
              medicalFlag,
            };

            if (medicalFlag.allergen) {
              props.openAddAllergySidePanel(sidePanelArgs);
            } else {
              props.openAddMedicalAlertSidePanel(sidePanelArgs);
            }
          },
        });
      }
    }

    if (actions.length) {
      return (
        <div css={style.actions} key={uuid()}>
          <TooltipMenu
            data-testid="AllergyCardList|Actions"
            placement="bottom-end"
            menuItems={actions}
            tooltipTriggerElement={
              <TextButton
                iconAfter="icon-more"
                type="subtle"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
          />
        </div>
      );
    }
    return null;
  };

  const renderType = (medicalFlag: MedicalFlag) => {
    const linkText = medicalFlag.allergen
      ? props.t('Allergy')
      : props.t('Medical Alert');
    const renderLink = (linkUrl) => {
      if (medicalFlag.id && medicalFlag.athlete_id) {
        return (
          <LinkTooltipCell
            key={uuid()}
            data-testid="AllergyCardList|TypeLink"
            valueLimit={25}
            url={`/medical/athletes/${medicalFlag.athlete_id}/${linkUrl}/${medicalFlag.id}`}
            longText={linkText}
          />
        );
      }
      return linkText;
    };

    if (medicalFlag.medical_alert && permissions.medical.alerts.canView) {
      return renderLink('athlete_medical_alerts');
    }

    if (medicalFlag.allergen && permissions.medical.allergies.canView) {
      return renderLink('allergies');
    }

    return linkText;
  };

  const buildColumns = useMemo(() => {
    const columns = [
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Type')} />,
        accessor: 'type',
        width: 130,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="AllergyCardList|Type"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Title')} />,
        accessor: 'medicalFlagTitle',
        width: 130,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="AllergyCardList|Title"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Details')} />,
        accessor: 'details',
        width: 130,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="AllergyCardList|Details"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Symptoms')} />,
        accessor: 'symptoms',
        width: 200,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="AllergyCardList|Symptoms"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Severity')} />,
        accessor: 'severity',
        width: 100,
        Cell: ({ cell: { value } }) => {
          return (
            <div css={style.severity}>
              <TextTag
                content={value === 'none' ? 'Not Specified' : value}
                backgroundColor={severityLabelColour(value)}
                textColor={value === 'severe' ? colors.white : colors.grey_400}
                fontSize={12}
              />
            </div>
          );
        },
      },
    ];

    if (
      permissions.medical.alerts.canArchive ||
      permissions.medical.allergies.canArchive
    ) {
      columns.push({
        Header: () => <TextHeader key={uuid()} value={props.t('')} />,
        accessor: 'actions',
        width: 40,
        Cell: ({ cell: { value } }) => <TextCell key={uuid()} value={value} />,
      });
    }

    if (props.showAvatar)
      columns.unshift({
        Header: () => <TextHeader key={uuid()} value={props.t('Player')} />,
        accessor: 'avatar',
        show: true,
        width: 140,
        Cell: ({ cell: { value } }) => value,
      });

    return columns;
  });

  const buildData = () => {
    return combinedMedicalFlags
      .sort(
        (a, b) =>
          severities.indexOf(a.severity) - severities.indexOf(b.severity)
      )
      .map((medicalFlag) => {
        return {
          avatar: (
            <div
              key={uuid()}
              css={style.athleteDetails}
              data-testid="AllergyCardList|Avatar"
            >
              {medicalFlag.athlete?.avatar_url && (
                <img
                  css={style.athleteAvatar}
                  src={medicalFlag.athlete?.avatar_url}
                  alt={`${medicalFlag.athlete.fullname}'s avatar`}
                />
              )}
              {medicalFlag.athlete && (
                <div css={style.athleteInfo}>
                  <TextLink
                    text={medicalFlag.athlete.fullname}
                    href={`/medical/athletes/${medicalFlag.athlete.id}`}
                    kitmanDesignSystem
                  />
                  <p css={style.athletePosition}>
                    {medicalFlag.athlete.position}
                  </p>
                </div>
              )}
            </div>
          ),
          type: renderType(medicalFlag),
          player: medicalFlag.athlete.fullname,
          medicalFlagTitle: getMedicalFlagTitle(medicalFlag),
          details: getMedicalFlagDetails(medicalFlag),
          symptoms: medicalFlag.symptoms || '',
          severity: medicalFlag.severity,
          actions: returnActions(medicalFlag),
        };
      });
  };

  const renderTable = () => {
    return (
      <InfiniteScroll
        dataLength={combinedMedicalFlags.length}
        next={props.onReachingEnd}
        hasMore={!props.isFullyLoaded || props.isLoading}
        loader={
          <div css={loadingStyle.loadingText}>{props.t('Loading')} ...</div>
        }
        scrollableTarget="AllergyCardList"
      >
        <DataTable
          columns={buildColumns}
          data={buildData()}
          useLayout={useFlexLayout}
        />
      </InfiniteScroll>
    );
  };

  return (
    <div
      id="AllergyCardList"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={allergiesCardListRef}
      css={
        combinedMedicalFlags.length
          ? loadingStyle.AllergyCardList
          : loadingStyle.AllergyCardListEmpty
      }
    >
      <div css={style.content}>
        {(permissions.medical.alerts.canArchive ||
          permissions.medical.allergies.canArchive) && (
          <ArchiveMedicalFlagContainer
            {...props}
            isOpen={archiveModalOpen}
            selectedMedicalFlag={selectedMedicalFlag}
            onClose={() => setArchiveModalOpen(false)}
            onPressEscape={() => setArchiveModalOpen(false)}
            setRequestStatus={props.setRequestStatus}
            enableReloadData={props.enableReloadData}
          />
        )}
        <div css={style.allergiesTable}>{renderTable()}</div>
      </div>
    </div>
  );
};

export const AllergiesCardListTranslated: ComponentType<Props> =
  withNamespaces()(AllergiesCardList);
export default AllergiesCardList;
