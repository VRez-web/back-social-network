export const config = [
  {
    url: 'https://t.me/s/anrbc',
    type: 'tg',
    selectorsToPars: ['.tgme_widget_message_bubble .tgme_widget_message_text '],
    idEl: '.tgme_widget_message data-post',
    idGroup: 1,
    postToIgnore: ['Как вам:', '#тест_autonews', 'Читайте интересные материалы за неделю в каналах наших коллег:']
  },
];
