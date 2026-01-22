import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const glacialIndifferenceRegular = localFont({
  src: '../../public/fonts/GlacialIndifference-Regular.otf',
  variable: '--font-glacial-regular',
  weight: '400',
});
const glacialIndifferenceBold = localFont({
  src: '../../public/fonts/GlacialIndifference-Regular.otf',
  variable: '--font-glacial-bold',
  weight: '900',
});

export const metadata: Metadata = {
  title: 'ActiLearn',
  description: 'Educational platform created for the GfG hackathon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${glacialIndifferenceRegular.className} ${glacialIndifferenceBold.className} bg-background text-foreground antialiased`}
      >
        <Providers>{children}</Providers>{' '}
      </body>
    </html>
  );
}
