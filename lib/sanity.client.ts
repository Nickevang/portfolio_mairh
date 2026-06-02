import {createClient, type ClientConfig} from 'next-sanity'
import {draftMode} from 'next/headers'

export const sanityProjectId: string | undefined = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const sanityDataset: string | undefined = process.env.NEXT_PUBLIC_SANITY_DATASET

export const sanityConfig: ClientConfig = {
  projectId: sanityProjectId || 'missing',
  dataset: sanityDataset || 'production',
  apiVersion: '2025-02-19',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
}

let _client: ReturnType<typeof createClient> | null = null

export function getSanityClient() {
  if (!sanityProjectId || !sanityDataset) return null
  if (_client) return _client
  _client = createClient(sanityConfig)
  return _client
}

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  const client = getSanityClient()
  if (!client) return [] as T

  let isDraft = false
  try {
    const dm = await draftMode()
    isDraft = dm.isEnabled
  } catch {
    // draftMode() throws at build time (generateStaticParams has no request context)
  }

  if (isDraft) {
    return client
      .withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
        perspective: 'previewDrafts',
        useCdn: false,
        stega: {enabled: true, studioUrl: '/studio'},
      })
      .fetch<T>(query, params)
  }

  return client.fetch<T>(query, params, {next: {revalidate: 60}})
}

