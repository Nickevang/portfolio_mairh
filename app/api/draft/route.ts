import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)

  if (searchParams.get('disable') === '1') {
    const draft = await draftMode()
    draft.disable()
    redirect('/')
  }

  const secret = searchParams.get('secret')
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', {status: 401})
  }

  const draft = await draftMode()
  draft.enable()

  const redirectTo = searchParams.get('redirect') ?? '/'
  redirect(redirectTo)
}
