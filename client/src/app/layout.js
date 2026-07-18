// Define the global page metadata for the app shell.
export const metadata = {
  title: 'Social Network',
  description: 'Profile Feed App',
};

// Render the shared HTML shell for the Next.js app.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
