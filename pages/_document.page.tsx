import Document, {
  Html,
  Main,
  NextScript,
  Head,
  DocumentContext,
} from "next/document"
import Script from "next/script"

import NewRelicSnippet from "components/data/NewRelicSnippet"

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
          {/* <!-- Start affirm Script --> */}
           <script dangerouslySetInnerHTML={{ __html: `
            var _affirm_config = {
            public_api_key: "6QYJT9XJBQ8E1QU8",
            script: "https://cdn1-sandbox.affirm.com/js/v2/affirm.js",
            locale: "en_US",
            country_code: "USA",
            };

            (function(m,g,n,d,a,e,h,c){var b=m[n]||{},k=document.createElement(e),p=document.getElementsByTagName(e)[0],l=function(a,b,c){return function(){a[b]._.push([c,arguments])}};b[d]=l(b,d,"set");var f=b[d];b[a]={};b[a]._=[];f._=[];b._=[];b[a][h]=l(b,a,h);b[c]=function(){b._.push([h,arguments])};a=0;for(c="set add save post open empty reset on off trigger ready setProduct".split(" ");a<c.length;a++)f[c[a]]=l(b,d,c[a]);a=0;for(c=["get","token","url","items"];a<c.length;a++)f[c[a]]=function(){};k.async=
            !0;k.src=g[e];p.parentNode.insertBefore(k,p);delete g[e];f(g);m[n]=b})(window,_affirm_config,"affirm","checkout","ui","script","ready","jsReady");
          ` }} />
          {/* <!-- End affirm Script --> */}
          {process.env[
            `NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_${process.env.NEXT_PUBLIC_STAGE}`
          ] !== null && (
            <Script id="new-relic" strategy="afterInteractive">
              {NewRelicSnippet}
            </Script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
