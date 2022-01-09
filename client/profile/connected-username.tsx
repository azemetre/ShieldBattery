import React from 'react'
import styled from 'styled-components'
import { SbUserId } from '../../common/users/sb-user'
import { useAppSelector } from '../redux-hooks'
import { colorDividers } from '../styles/colors'
import { ConnectedUserContextMenu } from './user-context-menu'
import { useUserOverlays } from './user-overlays'
import { ConnectedUserProfileOverlay } from './user-profile-overlay'

const Username = styled.span`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const LoadingName = styled.span`
  margin-right: 0.25em;
  background-color: ${colorDividers};
  border-radius: 2px;
`

/**
 * A component which displays a clickable username, displaying the user's profile overlay or
 * context menu when clicked.
 */
export function ConnectedUsername({
  className,
  userId,
  prefix = '',
}: {
  className?: string
  userId: SbUserId
  prefix?: string
}) {
  const { clickableElemRef, profileOverlayProps, contextMenuProps, onClick, onContextMenu } =
    useUserOverlays<HTMLSpanElement>({
      userId,
      profileAnchorX: 'right',
      profileAnchorY: 'top',
      profileOriginX: 'left',
      profileOriginY: 'top',
      profileOffsetX: 4,
    })

  const user = useAppSelector(s => s.users.byId.get(userId))
  const username = user?.name ?? (
    <LoadingName aria-label={'Username loading…'}>
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </LoadingName>
  )

  return (
    <>
      <ConnectedUserProfileOverlay {...profileOverlayProps} />
      <ConnectedUserContextMenu {...contextMenuProps} />

      <Username
        ref={clickableElemRef}
        className={className}
        onClick={onClick}
        onContextMenu={onContextMenu}>
        {prefix}
        {username}
      </Username>
    </>
  )
}
