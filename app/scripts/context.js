chrome.contextMenus.create({
  type: 'normal',
  id: 'savePinboard',
  title: 'Save to Pinboard',
  contexts: ['link', 'page'],
  onclick: function (info, tab) {
    // console.log('info', info);
    // console.log('tab', tab);

    var url = info.linkUrl || info.pageUrl;
    var fallbackTitle = info.selectionText || tab.title;

    $.ajax({
      url: url,
      type: 'GET',
    }).done(
      function (data) {
        var html = $.parseHTML(data);
        var title = '';
        var desc = '';
        $.each(html, function (i, el) {
          if (el.nodeName === 'META') {
            var meta = $(el).attr('property');
            var content = $(el).attr('content');
            if (meta === 'og:title') {
              title = content;
            } else if (meta === 'og:description' || meta === 'description' || meta === 'twitter:description') {
              desc = content;
            }
          }
          if (title === '' && el.nodeName === 'TITLE') {
            title = el.innertHTML;
          }
        });
        openPinboardPopup(url, title || fallbackTitle, desc);
      }
    ).fail(
      function (data) {
        openPinboardPopup(url, fallbackTitle, '');
      }
    );

  },
});

function openPinboardPopup(url, title, desc) {
  if (!title || title.length === 0) {
    title = '';
  }
  if (!desc || desc.length === 0) {
    desc = '';
  }
  open('https://pinboard.in/add?url=' + encodeURIComponent(url) +
    '&description=' + encodeURIComponent(desc) +
    '&title=' + encodeURIComponent(title),
    'Pinboard',
    'toolbar=no,width=700,height=350');
}
