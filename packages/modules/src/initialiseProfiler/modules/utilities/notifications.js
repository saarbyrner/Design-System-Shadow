/*
  Kitman Notifications
  Simple notification system

  @string - message text
  @type - info / alert / success / info
*/

const notify = (string, type, duration) => {
  const speed = 300;
  const offset = 400;
  const $notification = $('#km_notification');
  let newDuration = duration;

  if (!newDuration) {
    newDuration = 1700;
  }

  $notification.find('span').text(string);
  $notification
    .delay(offset)
    .addClass(type)
    // eslint-disable-next-line func-names
    .slideDown(speed, function () {
      $(this)
        .delay(newDuration)
        .slideUp(speed, () => {
          $notification.removeClass(type);
        });
    });
};

export default notify;
