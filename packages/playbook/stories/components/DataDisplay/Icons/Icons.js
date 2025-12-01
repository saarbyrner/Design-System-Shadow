// @flow
import { IconGallery, IconItem } from '@storybook/blocks';
import {
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  ListItemText,
  Typography,
} from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import type { KitmanIconName } from '@kitman/playbook/icons';
import customIconData from '@kitman/playbook/icons/kitmanIconData';
import { useState } from 'react';

const compare = (name, search) => {
  return name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1;
};
export default () => {
  const [searchText, setSearchText] = useState('');
  const [color, setColor] = useState('primary');

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <TextField
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <KitmanIcon name={KITMAN_ICON_NAMES.Search} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ maxWidth: 250 }}>
          <InputLabel id="color-field-label">Color</InputLabel>
          <Select
            labelId="color-field-label"
            id="color-field"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            renderValue={(selected) => selected}
          >
            {[
              'primary',
              'secondary',
              'error',
              'warning',
              'info',
              'success',
              'inherit',
            ].map((colorValue) => (
              <MenuItem key={colorValue} value={colorValue}>
                <ListItemText primary={colorValue} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Typography variant="h6" component="h4" gutterBottom>
        Custom Icons
      </Typography>
      <IconGallery>
        {customIconData.map(({ name }) => {
          if (compare(name, searchText)) {
            return null;
          }

          return (
            <IconItem name={name}>
              <KitmanIcon customIconName={name} color={color} />
            </IconItem>
          );
        })}
      </IconGallery>
      <Typography variant="h6" component="h4" gutterBottom>
        Material Icons
      </Typography>
      <IconGallery>
        {Object.keys(KITMAN_ICON_NAMES).map((name: KitmanIconName) => {
          // removing the variants for now as they are not available in our internal figma
          if (
            ['Outlined', 'Rounded', 'Sharp', 'TwoTone'].some(
              (variant) => name.indexOf(variant) > -1
            )
          ) {
            return null;
          }

          if (compare(name, searchText)) {
            return null;
          }

          return (
            <IconItem key={name} name={name}>
              <KitmanIcon name={name} color={color} />
            </IconItem>
          );
        })}
      </IconGallery>
    </div>
  );
};
