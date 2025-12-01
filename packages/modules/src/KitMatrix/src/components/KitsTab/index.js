// @flow
import { compact, isEmpty, omit } from 'lodash';
import { useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import TabLayout from '@kitman/components/src/TabLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer, Stack, Typography } from '@kitman/playbook/components';
import { useKitMatrixDataGrid } from '@kitman/modules/src/KitMatrix/shared/hooks';
import {
  commonColDef,
  columnHeaders,
} from '@kitman/modules/src/KitMatrix/src/grid/config';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import { useTheme } from '@kitman/playbook/hooks';
import { css } from '@emotion/react';
import type { EquipmentName } from '@kitman/modules/src/KitMatrix/shared/types';
import structuredClone from 'core-js/stable/structured-clone';

const defaultKitPreview = {
  name: '',
  jersey: '',
  shorts: '',
  socks: '',
};

type Props = {};

const KitsTab = (props: I18nProps<Props>) => {
  const theme = useTheme();
  const [kitPreview, setKitPreview] = useState(
    structuredClone(defaultKitPreview)
  );

  const columns = useMemo(() => {
    // insert "Kit Preview" column at the end before last position
    const hideColumns = ['club', 'status', 'actions'];
    const tmpColumns = Object.values(omit(columnHeaders, hideColumns));
    tmpColumns.splice(tmpColumns.length - 1, 0, {
      ...commonColDef,
      field: 'kit-preview',
      headerName: props.t('Kit Preview'),
      width: 120,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() =>
              setKitPreview({
                name: row.name,
                jersey: row.jersey.image.url,
                shorts: row.shorts.image.url,
                socks: row.socks.image.url,
              })
            }
          >
            {props.t('view')}
          </Typography>
        );
      },
    });

    return tmpColumns;
  }, [props]);

  const { renderFilter, renderDataGrid } = useKitMatrixDataGrid({
    t: props.t,
    dataGridProps: {
      columns,
    },
  });

  const renderEquipmentPreview = (name: EquipmentName) => {
    let width = 250;
    if (name === 'shorts') width = 175;
    if (name === 'socks') width = 100;

    return (
      <img
        src={kitPreview[name]}
        alt={`${name} preview`}
        css={css({ width })}
      />
    );
  };

  const isPreviewOpen = !isEmpty(compact(Object.values(kitPreview)));

  return (
    <TabLayout>
      <TabLayout.Body>
        <TabLayout.Header>
          <TabLayout.Title>{props.t('Kits')}</TabLayout.Title>
        </TabLayout.Header>
        <TabLayout.Filters>
          <Stack direction="row" gap={1}>
            {renderFilter('search')}
            {renderFilter('colors')}
            {renderFilter('types')}
          </Stack>
        </TabLayout.Filters>
        <TabLayout.Content>{renderDataGrid()}</TabLayout.Content>
      </TabLayout.Body>

      <Drawer
        open={isPreviewOpen}
        anchor="right"
        onClose={() => setKitPreview(defaultKitPreview)}
        sx={drawerMixin({
          theme,
          isOpen: isPreviewOpen,
          drawerWidth: 460,
        })}
      >
        <Stack direction="column" gap={4} sx={{ padding: '28px' }}>
          <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
            {kitPreview.name}
          </Typography>
          <Stack direction="column" gap={4} alignItems="center">
            {renderEquipmentPreview('jersey')}
            {renderEquipmentPreview('shorts')}
            {renderEquipmentPreview('socks')}
          </Stack>
        </Stack>
      </Drawer>
    </TabLayout>
  );
};

export default withNamespaces()(KitsTab);
