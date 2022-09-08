import React from 'react'
import styled from 'styled-components'
import { SbChannelId } from '../../common/chat'
import { useAppSelector } from '../redux-hooks'
import { colorDividers } from '../styles/colors'

const LoadingName = styled.span`
  margin-right: 0.25em;
  background-color: ${colorDividers};
  border-radius: 2px;
`

export interface ConnectedChannelNameProps {
  className?: string
  /** The channel to show the corresponding name for. */
  channelId: SbChannelId
}

/**
 * A component which, given a channel ID, displays a channel name. Pretty barebones at the moment,
 * but will be extended with further functionality soon.
 */
export function ConnectedChannelName({ className, channelId }: ConnectedChannelNameProps) {
  const channelInfo = useAppSelector(s => s.chat.idToInfo.get(channelId))
  const channelName = channelInfo?.name ?? (
    <LoadingName aria-label={'Channel loading…'}>
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </LoadingName>
  )

  return <span className={className}>#{channelName}</span>
}