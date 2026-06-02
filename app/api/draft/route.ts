import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  if (searchParams.get('disable') === '1') {
    const draft = await draftMode()
    draft.disable()
    redirect('/')
  }

  // Sanity Presentation tool sends 'sanity-preview-secret'; fall back to 'secret' for manual use
  const secret = searchParams.get('sanity-preview-secret') ?? searchParams.get('secret')
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', {status: 401})
  }

  const draft = await draftMode()
  draft.enable()

  // Sanity sends 'sanity-preview-pathname'; fall back to 'redirect'
  const redirectTo =
    searchParams.get('sanity-preview-pathname') ?? searchParams.get('redirect') ?? '/'
  redirect(redirectTo)
}
