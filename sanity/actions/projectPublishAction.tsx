import {useDocumentOperation} from 'sanity'

interface Props {
  id: string
  type: string
  draft: Record<string, unknown> | null
  published: Record<string, unknown> | null
}

export function ProjectPublishAction({id, type}: Props) {
  const ops = useDocumentOperation(id, type)
  const publishOp = ops.publish as unknown as {execute: () => void; disabled: false | string}

  return {
    label: 'Publish',
    disabled: false,
    tone: 'primary' as const,
    onHandle: () => {
      publishOp.execute()
    },
  }
}
