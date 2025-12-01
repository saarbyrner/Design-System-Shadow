// @flow
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useEffect, useState } from 'react';

import { AppStatus } from '@kitman/components';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import getPowerBiEmbedConfig, {
  type EmbedConfig,
} from '@kitman/services/src/services/getPowerBiEmbedConfig';
import i18n from '@kitman/common/src/utils/i18n';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import colors from '@kitman/common/src/variables/colors';

const constructEmbedConfig = ({
  embed_token: embedToken,
  embed_url: embedUrl,
  ms_report_id: msReportId,
}: EmbedConfig) => ({
  type: 'report',
  id: msReportId,
  embedUrl,
  accessToken: embedToken,
  tokenType: models.TokenType.Embed,
  settings: {
    background: models.BackgroundType.Transparent,
    panes: {
      filters: {
        expanded: false,
        visible: false,
      },
      pageNavigation: {
        visible: false,
      },
    },
  },
});

const getEmbeddedComponent = (embeddedReport) => {
  window.report = embeddedReport;
};

const PowerBiEmbeddedReports = () => {
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);
  const [hasErrored, setHasErrored] = useState<boolean>(false);
  const [hasReportRendered, setHasReportRendered] = useState<boolean>(false);

  const { data: permissions, isSuccess: hasPermissionsDataLoaded } =
    useGetPermissionsQuery(true);
  const locationAssign = useLocationAssign();
  const headerHeight = useAppHeaderHeight();

  const reportId = window.location.pathname.split('/')[2];

  const eventHandlers = new Map([
    ['rendered', () => setHasReportRendered(true)],
    ['error', () => setHasErrored(true)],
  ]);

  const renderAppStatus = () => {
    if (hasErrored) {
      return <AppStatus status="error" />;
    }

    if (!embedConfig) {
      return (
        <AppStatus status="loading" message={i18n.t('Generating report...')} />
      );
    }

    if (!hasReportRendered) {
      return <AppStatus status="loading" message={i18n.t('Loading data...')} />;
    }

    return null;
  };

  useEffect(() => {
    const getReportConfig = async () => {
      try {
        const config = await getPowerBiEmbedConfig(reportId);
        setEmbedConfig(config);
      } catch (err) {
        setHasErrored(true);
      }
    };
    getReportConfig();
  }, [reportId]);

  useEffect(() => {
    if (hasPermissionsDataLoaded) {
      if (!permissions.analysis.powerBiReports.canView) {
        locationAssign('/');
      }
    }
  }, [permissions, hasPermissionsDataLoaded, locationAssign]);

  return (
    <>
      {renderAppStatus()}
      {embedConfig && !hasErrored && (
        <div
          css={{
            '.report-style-class': {
              height: `calc(100vh - ${headerHeight}px)`,
              display: !hasReportRendered && 'none',
              background: colors.background,

              '& iframe': {
                border: 'none',
              },
            },
          }}
        >
          <PowerBIEmbed
            embedConfig={constructEmbedConfig(embedConfig)}
            eventHandlers={eventHandlers}
            cssClassName="report-style-class"
            getEmbeddedComponent={getEmbeddedComponent}
          />
        </div>
      )}
    </>
  );
};

export default PowerBiEmbeddedReports;
