import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'
import {createClient} from 'next-sanity'
import {validatePreviewUrl} from '@sanity/preview-url-secret'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  if (searchParams.get('disable') === '1') {
    const draft = await draftMode()
    draft.disable()
    redirect('/')
  }

  const {isValid, redirectTo = '/'} = await validatePreviewUrl(client, request.url)

  if (!isValid) {
    return new Response('Invalid secret', {status: 401})
  }

  const draft = await draftMode()
  draft.enable()
  redirect(redirectTo)
}
