# Navigation Components

Import from: `@saarbyrne/playbook`

## AppBar

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

## Drawer

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

## Tabs

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

## Breadcrumbs

Use `<Breadcrumbs>` to show navigation hierarchy.

**When to use:**
- Deep navigation hierarchies
- Show current location in app
- Easy navigation back up levels

## Menu

Use `<Menu>` for dropdown action menus.

**When to use:**
- Context menus
- Dropdown actions
- More options (...) menus

## Link

Use `<Link>` for navigation links.

**When to use:**
- Text links
- Navigation between pages
- External links

## Pagination

Use `<Pagination>` for multi-page navigation.

**When to use:**
- Large lists of items
- Search results
- Table pagination

## Stepper

Use `<Stepper>` for multi-step processes.

**When to use:**
- Forms spanning multiple steps
- Onboarding flows
- Progress tracking through a process
