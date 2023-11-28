import * as cheerio from 'cheerio';

export const addClassesToParsedHtml = (html: string) => {
  const $ = cheerio.load(html);
  $('h1').addClass('text-4xl font-bold mb-3');
  $('h2').addClass('text-3xl font-bold mb-3');
  $('h3').addClass('text-2xl font-bold mb-3');
  $('h4').addClass('text-xl font-bold mb-3');
  $('h5').addClass('text-lg font-bold mb-3');

  $('p').addClass('mb-3');
  $('ul').addClass('list-disc ml-3 list-inside mb-3');
  $('ol').addClass('list-decimal ml-3 list-inside mb-3');
  $('li').addClass('mb-1');
  $('a').addClass('text-blue-500 hover:underline hover:text-blue-600');
  $('table').addClass('border-collapse border-gray-300 my-3');
  $('th').addClass('border border-gray-300 px-3 py-2');
  $('td').addClass('border border-gray-300 px-3 py-2');
  $('img').addClass('mx-auto my-3');
  $('blockquote').addClass('border-l-4 border-gray-300 pl-3 my-3');
  $('hr').addClass('border-gray-300 my-3');

  return $.html();
};
