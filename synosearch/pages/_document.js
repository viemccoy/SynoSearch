import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const isDarkMode = ctx.req?.cookies?.isDarkMode ?? 'false';
    return { ...initialProps, isDarkMode };
  }

  render() {
    const theme = this.props.isDarkMode === 'true' ? 'dark' : 'light';
    return (
      <Html className={theme}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;