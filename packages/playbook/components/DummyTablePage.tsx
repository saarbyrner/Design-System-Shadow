import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Pagination,
  IconButton,
  Menu,
  Avatar,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Dummy data for the table
const createData = (id: number) => ({
  id,
  head1: 'Head',
  text1: 'Text',
  text2: 'Text',
  text3: 'Text',
  text4: 'Text',
  text5: 'Text',
});

const rows = Array.from({ length: 5 }, (_, i) => createData(i + 1));

const DummyTablePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [filter1, setFilter1] = useState('');
  const [filter2, setFilter2] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Left Navigation - Placeholder */}
      <Box
        sx={{
          width: 60,
          bgcolor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          gap: 2,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: '#4a90e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          K
        </Box>
        {/* Nav Icons */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Box
            key={item}
            sx={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              cursor: 'pointer',
              '&:hover': { color: '#fff' },
            }}
          >
            +
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <Box
          sx={{
            bgcolor: 'white',
            px: 3,
            py: 1.5,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Page title
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Primary Squad
            </Typography>
            <Avatar sx={{ width: 32, height: 32 }} src="" alt="User" />
          </Box>
        </Box>

        {/* Page Header */}
        <Box
          sx={{
            bgcolor: 'white',
            px: 3,
            py: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Page header
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Label" sx={{ bgcolor: '#1a1a1a', color: 'white', fontWeight: 500 }} />
              <Chip label="Label" variant="outlined" />
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontSize: 14,
              },
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <Tab key={i} label="Tab" />
            ))}
          </Tabs>
        </Box>

        {/* Filters and Actions */}
        <Box
          sx={{
            bgcolor: 'white',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <TextField
            size="small"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Label</InputLabel>
            <Select value={filter1} label="Label" onChange={(e) => setFilter1(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Label</InputLabel>
            <Select value={filter2} label="Label" onChange={(e) => setFilter2(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <Button variant="outlined" size="small">
            Action
          </Button>
          <Button variant="outlined" size="small">
            Action
          </Button>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'white', p: 3 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < rows.length}
                      checked={rows.length > 0 && selected.length === rows.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Head</TableCell>
                  <TableCell>Head</TableCell>
                  <TableCell>Head</TableCell>
                  <TableCell>Head</TableCell>
                  <TableCell>Head</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows[0] && (
                  <TableRow
                    hover
                    onClick={() => handleClick(rows[0].id)}
                    selected={isSelected(rows[0].id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected(rows[0].id)} />
                    </TableCell>
                    <TableCell>{rows[0].head1}</TableCell>
                    <TableCell>{rows[0].text1}</TableCell>
                    <TableCell>{rows[0].text2}</TableCell>
                    <TableCell>{rows[0].text3}</TableCell>
                    <TableCell>{rows[0].text4}</TableCell>
                  </TableRow>
                )}
                {rows.slice(1).map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(row.id)}
                      selected={isItemSelected}
                      key={row.id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>Text</TableCell>
                      <TableCell>Text</TableCell>
                      <TableCell>Text</TableCell>
                      <TableCell>Text</TableCell>
                      <TableCell>Text</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select value={25} displayEmpty>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Pagination count={7} page={page} onChange={handlePageChange} shape="rounded" />
          </Box>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Action 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Action 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Action 3</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DummyTablePage;
