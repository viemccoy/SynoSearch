import { useRouter } from 'next/router'
import Script from 'next/script'

export default function Results() {
  const router = useRouter()
  const { query } = router.query

  return (
    <div>
      <h1>Results for {query}</h1>
      <script async src="https://cse.google.com/cse.js?cx=b784b1ad1184941ab">
      </script>
      <div class="gcse-searchresults-only"></div>
    </div>
  )
}