# Layout Components

Import from: `@saarbyrne/playbook`

## Box

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

## Container

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

## Grid

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

## Stack

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
