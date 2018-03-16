const cheerio = require('cheerio');
const s = require('string');

function trimPublishDate(str) {
  return s(s(str.text()).splitLeft('(')[1]).chompRight(')').s;
}

function trimEdition(str) {
  return s(s(str.text()).chompLeft('Publisher: ').splitLeft(';')[1]).splitLeft('edition')[0].trim();
}

function trimPublisher(str) {
  return s(str.text()).chompLeft('Publisher: ').splitLeft(';')[0];
}

function trimPages(str) {
  return s(str.text()).chompLeft('Paperback: ').chompRight(' pages').toInt();
}

function item(context) {
  const $ = cheerio.load(cheerio(context).html());
  const secondChild = $('.entry.clearfix > ul > li:nth-child(2)');
  return {
    title: $('[rel="bookmark"]').attr('title'),
    date: $('div.post-info > span.date').text(),
    img: $('.entry.clearfix > h3 > img').attr('src'),
    details: {
      pages: trimPages($('.entry.clearfix > ul > li:nth-child(1)')),
      publisher: trimPublisher(secondChild),
      edition: trimEdition(secondChild),
      datePublish: trimPublishDate(secondChild),
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
