import { useRouter } from 'next/router'
import Script from 'next/script'

export default function Results() {
  const router = useRouter()
  const { q } = router.query

  return (
    <div>
      <h1>Results for {q}</h1>
      <Script id="gcse-settings" strategy="beforeInteractive">
        {`
          window.__gcse = {
            linkTarget: '_blank'
          };
        `}
      </Script>
      <Script src={`https://cse.google.com/cse.js?cx=b784b1ad1184941ab`} strategy="afterInteractive" />
      <div className="gcse-searchresults-only"></div>
    </div>
  )
}