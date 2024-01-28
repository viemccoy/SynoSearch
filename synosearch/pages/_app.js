import { GoogleAdSense } from "nextjs-google-adsense";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <GoogleAdSense publisherId="ca-pub-2666453314779407" />
      <Component {...pageProps} />
    </>
  );
};

export default App;