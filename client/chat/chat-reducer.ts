import cuid from 'cuid'
import { Immutable } from 'immer'
import { ChannelPermissions, ChatMessage, ClientChatMessageType } from '../../common/chat'
import { SbUserId } from '../../common/users/user-info'
import { NETWORK_SITE_CONNECTED } from '../actions'
import { immerKeyedReducer } from '../reducers/keyed-reducer'

// How many messages should be kept for inactive channels
const INACTIVE_CHANNEL_MAX_HISTORY = 150

export interface UsersState {
  active: Set<SbUserId>
  idle: Set<SbUserId>
  offline: Set<SbUserId>
}

export interface ChannelState {
  name: string
  messages: ChatMessage[]
  users: UsersState
  selfPermissions: ChannelPermissions

  loadingHistory: boolean
  hasHistory: boolean

  hasLoadedUserList: boolean
  loadingUserList: boolean

  activated: boolean
  hasUnread: boolean
}

export interface ChatState {
  channels: Set<string>
  // Note that the keys for this map are always lower-case
  byName: Map<string, ChannelState>
}

const DEFAULT_CHAT_STATE: Immutable<ChatState> = {
  channels: new Set(),
  byName: new Map(),
}

/**
 * Update the messages field for a channel, keeping the `hasUnread` flag in proper sync.
 *
 * @param state The complete chat state which holds all of the channels.
 * @param channelName The name of the channel in which to update the messages.
 * @param makesUnread A boolean flag indicating whether to mark a channel as having unread messages.
 * @param updateFn A function which should perform the update operation on the messages field. Note
 *   that this function should return a new array, instead of performing the update in-place.
 */
function updateMessages(
  state: ChatState,
  channelName: string,
  makesUnread: boolean,
  updateFn: (messages: ChatMessage[]) => ChatMessage[],
) {
  const channel = state.byName.get(channelName)
  if (!channel) {
    return
  }

  channel.messages = updateFn(channel.messages)

  let sliced = false
  if (!channel.activated && channel.messages.length > INACTIVE_CHANNEL_MAX_HISTORY) {
    channel.messages = channel.messages.slice(-INACTIVE_CHANNEL_MAX_HISTORY)
    sliced = true
  }

  channel.hasUnread = makesUnread ? channel.hasUnread || !channel.activated : channel.hasUnread
  channel.hasHistory = channel.hasHistory || sliced
}

export default immerKeyedReducer(DEFAULT_CHAT_STATE, {
  ['@chat/initChannel'](state, action) {
    const { activeUserIds, selfPermissions } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channelUsers: UsersState = {
      active: new Set(activeUserIds),
      idle: new Set(),
      offline: new Set(),
    }
    const channelState: ChannelState = {
      name: channelName,
      messages: [],
      users: channelUsers,
      selfPermissions,
      loadingHistory: false,
      hasHistory: true,
      hasLoadedUserList: false,
      loadingUserList: false,
      activated: false,
      hasUnread: false,
    }
    state.channels.add(channelName)
    state.byName.set(lowerCaseChannelName, channelState)

    updateMessages(state, lowerCaseChannelName, false, m =>
      m.concat({
        id: cuid(),
        type: ClientChatMessageType.SelfJoinChannel,
        channel: lowerCaseChannelName,
        time: Date.now(),
      }),
    )
  },

  ['@chat/updateJoin'](state, action) {
    const { user, message } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.users.active.add(user.id)

    // TODO(2Pac): make this configurable
    updateMessages(state, lowerCaseChannelName, true, m => m.concat(message))
  },

  ['@chat/updateLeave'](state, action) {
    const { userId, newOwnerId } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.users.active.delete(userId)
    channel.users.idle.delete(userId)

    // TODO(2Pac): make this configurable
    updateMessages(state, lowerCaseChannelName, true, m =>
      m.concat({
        id: cuid(),
        type: ClientChatMessageType.LeaveChannel,
        channel: lowerCaseChannelName,
        time: Date.now(),
        userId,
      }),
    )

    if (newOwnerId) {
      updateMessages(state, lowerCaseChannelName, true, m =>
        m.concat({
          id: cuid(),
          type: ClientChatMessageType.NewChannelOwner,
          channel: lowerCaseChannelName,
          time: Date.now(),
          newOwnerId,
        }),
      )
    }
  },

  ['@chat/updateLeaveSelf'](state, action) {
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    state.channels.delete(channelName)
    state.byName.delete(lowerCaseChannelName)
  },

  ['@chat/updateMessage'](state, action) {
    const { message: newMessage } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    updateMessages(state, lowerCaseChannelName, true, m => m.concat(newMessage))
  },

  ['@chat/updateUserActive'](state, action) {
    const { userId } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.users.active.add(userId)
    channel.users.idle.delete(userId)
    channel.users.offline.delete(userId)
  },

  ['@chat/updateUserIdle'](state, action) {
    const { userId } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.users.idle.add(userId)
    channel.users.active.delete(userId)
    channel.users.offline.delete(userId)
  },

  ['@chat/updateUserOffline'](state, action) {
    const { userId } = action.payload
    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.users.offline.add(userId)
    channel.users.active.delete(userId)
    channel.users.idle.delete(userId)
  },

  ['@chat/loadMessageHistoryBegin'](state, action) {
    const { channel: channelName } = action.payload
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.loadingHistory = true
  },

  ['@chat/loadMessageHistory'](state, action) {
    if (action.error) {
      // TODO(2Pac): Handle errors
      return
    }

    const { channel: channelName, limit } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    // Even though the payload here is `ServerChatMessage`, we expand its type so it can be
    // concatenated with the existing messages which could also contain client chat messages.
    const newMessages = action.payload.messages as ChatMessage[]

    channel.loadingHistory = false
    if (newMessages.length < limit) {
      channel.hasHistory = false
    }

    updateMessages(state, lowerCaseChannelName, false, messages => newMessages.concat(messages))
  },

  ['@chat/retrieveUserListBegin'](state, action) {
    const { channel: channelName } = action.payload
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.hasLoadedUserList = true
    channel.loadingUserList = true
  },

  ['@chat/retrieveUserList'](state, action) {
    if (action.error) {
      // TODO(2Pac): Handle errors
      return
    }

    const { channel: channelName } = action.meta
    const lowerCaseChannelName = channelName.toLowerCase()
    const userList = action.payload

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    const { users } = channel
    const offlineArray = userList.filter(u => !users.active.has(u.id) && !users.idle.has(u.id))

    channel.loadingUserList = false
    channel.users.offline = new Set(offlineArray.map(u => u.id))
  },

  ['@chat/activateChannel'](state, action) {
    const { channel: channelName } = action.payload
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    channel.hasUnread = false
    channel.activated = true
  },

  ['@chat/deactivateChannel'](state, action) {
    const { channel: channelName } = action.payload
    const lowerCaseChannelName = channelName.toLowerCase()

    const channel = state.byName.get(lowerCaseChannelName)
    if (!channel) {
      return
    }

    const hasHistory =
      state.byName.get(lowerCaseChannelName)!.messages.length > INACTIVE_CHANNEL_MAX_HISTORY

    channel.messages = channel.messages.slice(-INACTIVE_CHANNEL_MAX_HISTORY)
    channel.hasHistory = channel.hasHistory || hasHistory
    channel.activated = false
  },

  [NETWORK_SITE_CONNECTED as any]() {
    return DEFAULT_CHAT_STATE
  },
})
