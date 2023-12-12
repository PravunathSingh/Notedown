import { twi } from 'tw-to-css';

export const convertTailwindClassesToCss = (html: string) => {
  //  replace all the class having tailwind classes with style attribute
  const htmlWithCss = html.replace(
    /class=".*?"/g,
    (match) => `style="${twi(match.slice(7, -1))}"`
  );

  console.log(htmlWithCss);
  return htmlWithCss;
};
