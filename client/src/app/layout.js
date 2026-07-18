export const metadata = {
  title: 'Social Network',
  description: 'Profile Feed App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
