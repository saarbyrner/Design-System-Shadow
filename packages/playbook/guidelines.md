# Figma Make Component Guidelines

This guide helps Figma Make's AI understand when and how to use components from `@saarbyrne/playbook`.

Import all components from: `@saarbyrne/playbook`

---

## Input Components

### Button

Use `<Button>` for primary and secondary actions.

**When to use:**
- Primary actions (submit forms, confirm dialogs)
- Secondary actions (cancel, go back)
- Call-to-action buttons

**Default props:**
- `variant="contained"` for primary buttons
- `variant="outlined"` for secondary buttons
- `variant="text"` for tertiary/low-emphasis actions

**Example:**
```jsx
<Button variant="contained" color="primary">Submit</Button>
<Button variant="outlined">Cancel</Button>
```

### IconButton

Use `<IconButton>` for toolbar actions and compact interfaces.

**When to use:**
- Toolbar actions
- Icon-only interactions (delete, edit, close)
- Space-constrained layouts

**Example:**
```jsx
<IconButton><DeleteIcon /></IconButton>
```

### FloatingActionButton

Use `<Fab>` for primary floating actions.

**When to use:**
- Primary screen action that floats above content
- Adding new items
- Common actions on mobile

### TextField

Use `<TextField>` for single-line text input.

**When to use:**
- Form inputs (name, email, search)
- Single-line text entry
- Number inputs with validation

**Props:**
- `variant="outlined"` (default)
- `fullWidth` for form layouts
- `required` for required fields
- `type` for specific inputs (email, password, number)

**Example:**
```jsx
<TextField 
  label="Email" 
  type="email" 
  required 
  fullWidth 
/>
```

### Autocomplete

Use `<Autocomplete>` for searchable dropdowns and multi-select.

**When to use:**
- Large lists of options that need search
- Multi-select scenarios
- Async data loading

**Example:**
```jsx
<Autocomplete
  options={options}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => <TextField {...params} label="Select option" />}
/>
```

### Select

Use `<Select>` for simple dropdown selections.

**When to use:**
- Small, fixed list of options (< 10 items)
- Single selection from predefined options
- Simpler than Autocomplete when search isn't needed

### Checkbox

Use `<Checkbox>` for boolean selections and multi-select lists.

**When to use:**
- Yes/No options
- Multiple selections from a list
- Toggle features on/off

### RadioGroup

Use `<RadioGroup>` with `<Radio>` for mutually exclusive options.

**When to use:**
- Single selection from 2-5 visible options
- When all options should be visible
- Mutually exclusive choices

### Switch

Use `<Switch>` for on/off toggles.

**When to use:**
- Enable/disable features
- Settings toggles
- Immediate effect toggles (don't require save)

### Slider

Use `<Slider>` for selecting a value from a range.

**When to use:**
- Volume, brightness controls
- Numeric ranges with visual feedback
- Filter ranges (price, date)

### Rating

Use `<Rating>` for star ratings and feedback.

**When to use:**
- Product ratings
- Review systems
- Quality feedback

---

## Data Display Components

### Typography

Use MUI `<Typography>` for all text.

**Variants:**
- `h1` - `h6`: Headings
- `body1`, `body2`: Body text
- `subtitle1`, `subtitle2`: Subtitles
- `caption`: Small text
- `overline`: Labels

**Example:**
```jsx
<Typography variant="h1">Page Title</Typography>
<Typography variant="body1">Body text content</Typography>
```

### Avatar

Use `<Avatar>` for user profile pictures and icons.

**When to use:**
- User profile images
- Icon placeholders
- Letter avatars for users without photos

**Example:**
```jsx
<Avatar src={user.photoUrl} alt={user.name} />
<Avatar>{user.initials}</Avatar>
```

### Badge

Use `<Badge>` to show counts or status indicators.

**When to use:**
- Notification counts
- Status indicators
- Unread message counts

**Example:**
```jsx
<Badge badgeContent={4} color="primary">
  <NotificationsIcon />
</Badge>
```

### Chip

Use `<Chip>` for tags, filters, and compact information.

**When to use:**
- Tags and labels
- Selected filters
- Contact lists
- Deletable items

**Example:**
```jsx
<Chip label="Active" color="success" />
<Chip label="Tag" onDelete={handleDelete} />
```

### Divider

Use `<Divider>` to separate content sections.

**When to use:**
- Between list items
- Separating content sections
- In toolbars and menus

### List

Use `<List>` with `<ListItem>` for structured lists.

**When to use:**
- Navigation menus
- Settings lists
- Contact lists
- Any vertical list of items

### Tooltip

Use `<Tooltip>` for contextual help and labels.

**When to use:**
- Icon button labels
- Truncated text (show full on hover)
- Additional context on hover
- Help text

**Example:**
```jsx
<Tooltip title="Delete item">
  <IconButton><DeleteIcon /></IconButton>
</Tooltip>
```

### Table / DataGrid

Use `<DataGrid>` for tabular data with sorting and filtering.

**When to use:**
- Large datasets
- Sortable columns
- Filterable data
- Pagination needed

**Example:**
```jsx
<DataGrid
  rows={rows}
  columns={columns}
  pageSize={10}
/>
```

---

## Layout Components

### Box

Use `<Box>` as a flexible container with spacing and styling.

**When to use:**
- Wrapper for spacing (padding, margin)
- Flexbox/Grid layouts
- Quick styling without creating styled components

**Example:**
```jsx
<Box sx={{ p: 2, display: 'flex', gap: 2 }}>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</Box>
```

### Container

Use `<Container>` to center content with max-width.

**When to use:**
- Page-level content wrapper
- Centered layouts
- Responsive max-width content

**Example:**
```jsx
<Container maxWidth="lg">
  <Typography variant="h1">Page Content</Typography>
</Container>
```

### Grid

Use `<Grid>` for responsive grid layouts.

**When to use:**
- Responsive card layouts
- Form layouts
- Multi-column content
- Dashboard layouts

**Example:**
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <Card>Content 1</Card>
  </Grid>
  <Grid item xs={12} md={6}>
    <Card>Content 2</Card>
  </Grid>
</Grid>
```

### Stack

Use `<Stack>` for simple vertical or horizontal layouts with spacing.

**When to use:**
- Button groups
- Form fields
- Simple lists
- Vertical/horizontal spacing between elements

**Example:**
```jsx
<Stack spacing={2}>
  <TextField label="Name" />
  <TextField label="Email" />
  <Button>Submit</Button>
</Stack>
```

**Stack is preferred over Box when:**
- You just need simple spacing between items
- Direction and spacing are the main concerns
- You don't need complex flexbox properties

---

## Navigation Components

### AppBar

Use `<AppBar>` for top navigation bars.

**When to use:**
- Main navigation header
- Top-level app navigation
- Global actions and branding

**Example:**
```jsx
<AppBar position="static">
  <Toolbar>
    <Typography variant="h6">App Name</Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

### Drawer

Use `<Drawer>` for side navigation panels.

**When to use:**
- Mobile navigation menus
- Side panels for filters/settings
- Collapsible navigation

**Example:**
```jsx
<Drawer open={open} onClose={handleClose}>
  <List>
    <ListItem button>
      <ListItemText primary="Home" />
    </ListItem>
  </List>
</Drawer>
```

### Tabs

Use `<Tabs>` with `<Tab>` for section navigation.

**When to use:**
- Content sections within a page
- View switching (3-7 tabs)
- Horizontal navigation

**Example:**
```jsx
<Tabs value={tab} onChange={handleChange}>
  <Tab label="Overview" />
  <Tab label="Details" />
  <Tab label="Settings" />
</Tabs>
```

### Breadcrumbs

Use `<Breadcrumbs>` to show navigation hierarchy.

**When to use:**
- Deep navigation hierarchies
- Show current location in app
- Easy navigation back up levels

### Menu

Use `<Menu>` for dropdown action menus.

**When to use:**
- Context menus
- Dropdown actions
- More options (...) menus

### Link

Use `<Link>` for navigation links.

**When to use:**
- Text links
- Navigation between pages
- External links

### Pagination

Use `<Pagination>` for multi-page navigation.

**When to use:**
- Large lists of items
- Search results
- Table pagination

### Stepper

Use `<Stepper>` for multi-step processes.

**When to use:**
- Forms spanning multiple steps
- Onboarding flows
- Progress tracking through a process

---

## Feedback Components

### Alert

Use `<Alert>` for important messages and notifications.

**When to use:**
- Success messages
- Error messages
- Warnings
- Informational messages

**Severity levels:**
- `error`: Errors that need attention
- `warning`: Warnings that should be noted
- `info`: General information
- `success`: Successful actions

**Example:**
```jsx
<Alert severity="success">
  Your changes have been saved successfully.
</Alert>
<Alert severity="error">
  An error occurred. Please try again.
</Alert>
```

### Snackbar

Use `<Snackbar>` for temporary notifications.

**When to use:**
- Brief notifications (3-5 seconds)
- Action confirmations
- Undo actions
- Non-blocking messages

**Example:**
```jsx
<Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={handleClose}
  message="Item deleted"
/>
```

### Dialog

Use `<Dialog>` for modal dialogs and confirmations.

**When to use:**
- Confirmation dialogs
- Forms requiring focus
- Important decisions
- Blocking user input until dismissed

**Example:**
```jsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    Are you sure you want to delete this item?
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleDelete} color="error">Delete</Button>
  </DialogActions>
</Dialog>
```

### Progress

Use `<CircularProgress>` or `<LinearProgress>` for loading states.

**When to use:**
- Loading data
- Processing requests
- Determinate progress (known duration)
- Indeterminate progress (unknown duration)

**CircularProgress:**
```jsx
<CircularProgress />
```

**LinearProgress:**
```jsx
<LinearProgress />
<LinearProgress variant="determinate" value={progress} />
```

### Backdrop

Use `<Backdrop>` to dim background during loading or modal states.

**When to use:**
- Loading overlays
- With dialogs
- Blocking interactions

### Skeleton

Use `<Skeleton>` for loading placeholders.

**When to use:**
- Content loading states
- Better UX than spinners for known layouts
- Progressive loading

**Example:**
```jsx
<Skeleton variant="text" width={210} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={118} />
```

---

## Surface Components

### Paper

Use `<Paper>` for surfaces and elevation.

**When to use:**
- Card containers
- Panels and sections
- Elevated surfaces
- Background surfaces with shadows

**Example:**
```jsx
<Paper elevation={2} sx={{ p: 2 }}>
  <Typography variant="h6">Card Title</Typography>
  <Typography>Card content goes here</Typography>
</Paper>
```

**Elevation levels:**
- `0`: No shadow (flat)
- `1`: Subtle elevation
- `2-3`: Standard cards
- `4-8`: Floating elements
- `16-24`: Dialogs and drawers

### Card

Use `<Card>` for content containers with actions.

**When to use:**
- Content previews
- Dashboard widgets
- Product cards
- News articles

**Structure:**
- `<CardHeader>`: Title and subtitle
- `<CardMedia>`: Images/video
- `<CardContent>`: Main content
- `<CardActions>`: Buttons/actions

**Example:**
```jsx
<Card>
  <CardHeader title="Card Title" subheader="Subtitle" />
  <CardMedia
    component="img"
    height="140"
    image="/image.jpg"
  />
  <CardContent>
    <Typography>Card description text</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>
```

### Accordion

Use `<Accordion>` for expandable content sections.

**When to use:**
- FAQs
- Expandable details
- Collapsible sections
- Space-constrained content

**Example:**
```jsx
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Section Title</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>Section content goes here</Typography>
  </AccordionDetails>
</Accordion>
```

### AppBar

Use `<AppBar>` for top-level headers and navigation.

**When to use:**
- App header
- Page title with actions
- Primary navigation
- Global search and actions

**Position variants:**
- `static`: Normal flow
- `fixed`: Fixed to top
- `sticky`: Sticky on scroll
- `absolute`: Absolutely positioned
