import { rest } from 'msw';

const data = {
  container_widget: {
    id: 169083,
    rows: 5,
    cols: 6,
    vertical_position: 0,
    horizontal_position: 0,
    print_rows: 5,
    print_cols: 6,
    print_vertical_position: 0,
    print_horizontal_position: 0,
    rows_range: [2, 7],
    cols_range: [1, 6],
    widget_type: 'graph',
    widget: {},
    widget_render: {},
  },
};

const handler = rest.post('/widgets', async (req, res, ctx) => {
  const body = await req.json();

  return res(
    ctx.json({
      container_widget: {
        ...data.container_widget,
        widget_type: body.widget.type,
        widget: body.widget,
        widget_render: body.widget,
      },
    })
  );
});

export { handler, data };
