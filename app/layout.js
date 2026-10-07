import './globals.css';

export const metadata = {
  title: 'WiftyUp',
  description: 'WiftyUp Web Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
