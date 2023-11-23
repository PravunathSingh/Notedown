import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
} from '@mantine/core';
import type { AppProps } from 'next/app';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

const myColor: MantineColorsTuple = [
  '#ffebff',
  '#f5d5fc',
  '#e6a9f3',
  '#d779eb',
  '#cb51e4',
  '#c437e0',
  '#c029df',
  '#a91cc6',
  '#9715b1',
  '#840a9c',
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications position='bottom-right' />
        <Component {...pageProps} />
      </ModalsProvider>
    </MantineProvider>
  );
}
