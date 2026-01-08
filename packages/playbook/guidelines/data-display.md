# Data Display Components

Import from: `@saarbyrne/playbook`

## Typography

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

## Avatar

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

## Badge

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

## Chip

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

## Divider

Use `<Divider>` to separate content sections.

**When to use:**
- Between list items
- Separating content sections
- In toolbars and menus

## List

Use `<List>` with `<ListItem>` for structured lists.

**When to use:**
- Navigation menus
- Settings lists
- Contact lists
- Any vertical list of items

## Tooltip

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

## Table / DataGrid

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
