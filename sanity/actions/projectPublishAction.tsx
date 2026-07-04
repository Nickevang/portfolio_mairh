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

  const hasChanges = publishOp.disabled === false

  return {
    label: hasChanges ? 'Publish' : 'Published',
    disabled: !hasChanges,
    tone: (hasChanges ? 'primary' : 'default') as 'primary' | 'default',
    onHandle: () => {
      if (hasChanges) publishOp.execute()
    },
  }
}
