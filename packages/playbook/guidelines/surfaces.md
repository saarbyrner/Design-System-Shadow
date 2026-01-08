# Surface Components

Import from: `@saarbyrne/playbook`

## Paper

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

## Card

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

## Accordion

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

## AppBar

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
