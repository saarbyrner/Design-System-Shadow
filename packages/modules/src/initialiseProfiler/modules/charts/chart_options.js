const chartOptions = (i18n) => ({
  lang: {
    noData: i18n.t('No available data for this date range'),
    months: [
      i18n.t('January'),
      i18n.t('February'),
      i18n.t('March'),
      i18n.t('April'),
      i18n.t('May'),
      i18n.t('June'),
      i18n.t('July'),
      i18n.t('August'),
      i18n.t('September'),
      i18n.t('October'),
      i18n.t('November'),
      i18n.t('December'),
    ],
    shortMonths: [
      i18n.t('Jan'),
      i18n.t('Feb'),
      i18n.t('Mar'),
      i18n.t('Apr'),
      i18n.t('May'),
      i18n.t('Jun'),
      i18n.t('Jul'),
      i18n.t('Aug'),
      i18n.t('Sep'),
      i18n.t('Oct'),
      i18n.t('Nov'),
      i18n.t('Dec'),
    ],
    weekdays: [
      i18n.t('Sunday'),
      i18n.t('Monday'),
      i18n.t('Tuesday'),
      i18n.t('Wednesday'),
      i18n.t('Thursday'),
      i18n.t('Friday'),
      i18n.t('Saturday'),
    ],
  },
});

export default chartOptions;
