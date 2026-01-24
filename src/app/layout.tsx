import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const glacialIndifferenceRegular = localFont({
  src: [
    {
      path: '../../public/fonts/GlacialIndifference-Regular.otf',
      style: 'regular',
      weight: '400',
    },
    {
      path: '../../public/fonts/GlacialIndifference-Bold.otf',
      style: 'bold',
      weight: '700',
    },
  ],
  variable: '--font-glacial-regular',
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
        className={`${glacialIndifferenceRegular.className} bg-background text-foreground antialiased`}
      >
        <Providers>{children}</Providers>{' '}
      </body>
    </html>
  );
}
