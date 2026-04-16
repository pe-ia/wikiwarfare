export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/home/" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("/home/");`,
        }}
      />
    </>
  );
}
