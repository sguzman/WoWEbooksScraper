const cheerio = require('cheerio');
const s = require('string');

const trim = {
  publishDate(str) {
    return s(s(str.text()).splitLeft('(')[1]).chompRight(')').s;
  },

  edition(str) {
    const refined = s(str.text()).chompLeft('Publisher: ').splitLeft(';')[1];
    if (refined === undefined) {
      return '';
    }

    return s(refined).splitLeft('edition')[0].trim();
  },

  publisher(str) {
    return s(str.text()).chompLeft('Publisher: ').splitLeft(';')[0];
  },

  pages(str) {
    return s(str.text()).chompLeft('Paperback: ').chompRight(' pages').toInt();
  },
};

function item(context) {
  const $ = cheerio.load(cheerio(context).html());
  const secondChild = $('.entry.clearfix > ul > li:nth-child(2)');
  return {
    title: $('[rel="bookmark"]').attr('title'),
    date: $('div.post-info > span.date').text(),
    img: $('.entry.clearfix > h3 > img').attr('src'),
    details: {
      pages: trim.pages($('.entry.clearfix > ul > li:nth-child(1)')),
      publisher: trim.publisher(secondChild),
      edition: trim.edition(secondChild),
      datePublish: trim.publishDate(secondChild),
      language: s($('.entry.clearfix > ul > li:nth-child(3)').text()).chompLeft('Language: ').s,
      isbn10: s($('.entry.clearfix > ul > li:nth-child(4)').text()).chompLeft('ISBN-10: ').s,
      isbn13: s($('.entry.clearfix > ul > li:nth-child(5)').text()).chompLeft('ISBN-13: ').s,
    },
    description: $('.entry.clearfix > h3:nth-child(5)').text()
  };
}

function page(body) {
  const $ = cheerio.load(body);
  return $('.post-content').map(function() {
    return item(this);
  });
}

module.exports = page;
