import { twi } from 'tw-to-css';

export const convertTailwindClassesToCss = (html: string) => {
  const tailwindClasses = [
    'text-4xl font-bold mb-3',
    'text-3xl font-bold mb-3',
    'text-2xl font-bold mb-3',
    'text-xl font-bold mb-3',
    'text-lg font-bold mb-3',
    'mb-3',
    'list-disc ml-3 list-inside mb-3',
    'list-decimal ml-3 list-inside mb-3',
    'mb-1',
    'text-blue-500 hover:underline hover:text-blue-600',
    'border-collapse border-gray-300 my-3',
    'border border-gray-300 px-3 py-2',
    'border border-gray-300 px-3 py-2',
    'mx-auto my-3',
    'border-l-4 border-gray-300 pl-3 my-3',
    'border-gray-300 my-3',
  ];

  const elements = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'p',
    'ul',
    'ol',
    'li',
    'a',
    'table',
    'th',
    'td',
    'img',
    'blockquote',
    'hr',
  ];

  const htmlWithStyles = elements.reduce(
    (acc, element, index) => {
      const elementWithClass = `<${element} style="${twi(
        tailwindClasses[index]
      )}">`;
      const elementWithClassRegex = new RegExp(`<${element}>`, 'g');
      const newHtml = acc?.replace(elementWithClassRegex, elementWithClass);
      return newHtml;
    },

    html
  );

  // add doctype head html and body tags
  const htmlWithDoctype = `<!DOCTYPE html><html><head></head><body>${htmlWithStyles}</body></html>`;

  return htmlWithDoctype;
};
