import { marked as baseMarked } from 'marked';
import { markedEmoji } from 'marked-emoji';
import { Octokit } from '@octokit/rest';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const octokit = new Octokit();

// get all emojis from GitHub
const res = await octokit.rest.emojis.get();
const emojis = res.data;

// add emoji and highlight support to marked
const marked = baseMarked.use(
  {
    gfm: true,
    breaks: true,
  },
  markedEmoji({
    emojis,
    unicode: false,
  }),
  markedHighlight({
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      console.log(language);
      return hljs.highlight(code, { language }).value;
    },
  })
);

export { marked };
