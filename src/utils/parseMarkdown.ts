import { marked } from './marked/marked';

export const parseMarkdown = (markdown: string) => {
  return marked.parse(markdown);
};
