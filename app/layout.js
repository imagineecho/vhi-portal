export const metadata = {
  title: 'VHI ImagineDiagnostics Portal',
  description: 'Vascular Intelligence Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
      </head>
      <body style={{margin:0,padding:0,fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'}}>
        {children}
      </body>
    </html>
  )
}
