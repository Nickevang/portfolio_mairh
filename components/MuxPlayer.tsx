'use client'

import MuxPlayerLib from '@mux/mux-player-react'

export function MuxPlayer({playbackId}: {playbackId: string}) {
  return (
    <MuxPlayerLib
      playbackId={playbackId}
      streamType="on-demand"
      className="w-full aspect-video"
      accentColor="#ffffff"
    />
  )
}
