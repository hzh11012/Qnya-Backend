import request from '@/lib/request';
import type { ApiBody, ApiData, ApiPath, ApiQuery } from '@/types/helpers';

type WatchRoomListParams = ApiQuery<'/api/admin/watch-room/'>;
type WatchRoomListRes = ApiData<'/api/admin/watch-room/'>;
type WatchRoomListItem = WatchRoomListRes['items'][number];
type UpdateWatchRoomPath = ApiPath<'/api/admin/watch-room/{roomId}', 'patch'>;
type UpdateWatchRoomBody = ApiBody<'/api/admin/watch-room/{roomId}', 'patch'> &
  UpdateWatchRoomPath;
type DeleteWatchRoomParams = ApiPath<
  '/api/admin/watch-room/{roomId}',
  'delete'
>;

type RoomMembersRes = ApiData<'/api/admin/watch-room/{roomId}/members'>;
type RoomMember = RoomMembersRes['items'][number];
type RoomBansRes = ApiData<'/api/admin/watch-room/{roomId}/bans'>;
type RoomBan = RoomBansRes['items'][number];
type RoomMessagesRes = ApiData<'/api/admin/watch-room/{roomId}/messages'>;
type RoomMessage = RoomMessagesRes['items'][number];
type RoomMessagesParams = ApiQuery<'/api/admin/watch-room/{roomId}/messages'>;
type LiftBanParams = ApiPath<
  '/api/admin/watch-room/{roomId}/bans/{userId}',
  'delete'
>;

const fetchWatchRooms = (params: WatchRoomListParams) => {
  return request.get<WatchRoomListRes>('/api/admin/watch-room', {
    params,
    showErrorToast: true
  });
};

const updateWatchRoom = (body: UpdateWatchRoomBody) => {
  const { roomId, ...rest } = body;
  return request.patch(`/api/admin/watch-room/${roomId}`, rest, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

const deleteWatchRoom = (params: DeleteWatchRoomParams) => {
  const { roomId } = params;
  return request.delete(`/api/admin/watch-room/${roomId}`, {
    showErrorToast: true,
    showSuccessToast: true
  });
};

const fetchWatchRoomMembers = ({ roomId }: { roomId: string }) => {
  return request.get<RoomMembersRes>(
    `/api/admin/watch-room/${roomId}/members`,
    { showErrorToast: true }
  );
};

const fetchWatchRoomBans = ({ roomId }: { roomId: string }) => {
  return request.get<RoomBansRes>(`/api/admin/watch-room/${roomId}/bans`, {
    showErrorToast: true
  });
};

const fetchWatchRoomMessages = ({
  roomId,
  ...params
}: { roomId: string } & RoomMessagesParams) => {
  return request.get<RoomMessagesRes>(
    `/api/admin/watch-room/${roomId}/messages`,
    { params, showErrorToast: true }
  );
};

/** 解除拉黑（后端幂等：不在黑名单中同样返回成功） */
const liftWatchRoomBan = ({ roomId, userId }: LiftBanParams) => {
  return request.delete(`/api/admin/watch-room/${roomId}/bans/${userId}`, {
    showSuccessToast: true,
    showErrorToast: true
  });
};

export {
  type WatchRoomListParams,
  type WatchRoomListRes,
  type WatchRoomListItem,
  type UpdateWatchRoomBody,
  type RoomMember,
  type RoomBan,
  type RoomMessage,
  type RoomMessagesParams,
  fetchWatchRooms,
  updateWatchRoom,
  deleteWatchRoom,
  fetchWatchRoomMembers,
  fetchWatchRoomBans,
  fetchWatchRoomMessages,
  liftWatchRoomBan
};
