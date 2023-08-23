import { access_level, permissions } from "./permissions.constants";

const adminPermissions = {
  [access_level.SUPER]: [
    permissions.APPROVE_PLACE_REGISTER_REQ,
    permissions.CREATE_ADMIN,
    permissions.CREATE_CELEBRITY,
    permissions.CREATE_PLAY,
    permissions.DENY_PLACE_REGISTER_REQ,
    permissions.GET_ALL_CELEBRITIES,
    permissions.GET_UNPUBLISHED_PLAY_REVIEW,
    permissions.PUBLISH_PLAY_REVIEW,
    permissions.REMOVE_CELEBRITY,
    permissions.REMOVE_CELEBRITY_PICS,
    permissions.REMOVE_NORMAL_ADMIN,
    permissions.REMOVE_PLAY,
    permissions.REMOVE_PLAY_PICS,
    permissions.REMOVE_PLAY_REVIEW,
    permissions.REMOVE_PLAY_REVIEW_PICS,
    permissions.REMOVE_PLAY_TRAILER,
    permissions.REMOVE_USER_PROFILE_PIC,
    permissions.SET_DEFAULT_USER_FULL_NAME,
    permissions.UPDATE_CELEBRITY,
    permissions.UPDATE_NORMAL_AMDIN,
    permissions.UPDATE_PLAY,
    permissions.UPDATE_PLAY_REVIEW,
    permissions.UPLOAD_CELEBRITY_PICS,
    permissions.UPLOAD_PLAY_PICS,
    permissions.UPLOAD_PLAY_REVIEW_PICS,
    permissions.UPLOAD_PLAY_TRAILER,
    permissions.WRITE_PLAY_REVIEW,
  ],

  [access_level.PLAY]: [
    permissions.CREATE_CELEBRITY,
    permissions.CREATE_PLAY,
    permissions.GET_ALL_CELEBRITIES,
    permissions.GET_UNPUBLISHED_PLAY_REVIEW,
    permissions.PUBLISH_PLAY_REVIEW,
    permissions.REMOVE_CELEBRITY,
    permissions.REMOVE_CELEBRITY_PICS,
    permissions.REMOVE_PLAY,
    permissions.REMOVE_PLAY_PICS,
    permissions.REMOVE_PLAY_TRAILER,
    permissions.UPDATE_CELEBRITY,
    permissions.UPDATE_PLAY,
    permissions.UPLOAD_CELEBRITY_PICS,
    permissions.UPLOAD_PLAY_PICS,
    permissions.UPLOAD_PLAY_TRAILER
  ],

  [access_level.REVIEW]: [
    permissions.REMOVE_PLAY_REVIEW,
    permissions.REMOVE_PLAY_REVIEW_PICS,
    permissions.WRITE_PLAY_REVIEW,
    permissions.UPDATE_PLAY_REVIEW,
    permissions.UPLOAD_PLAY_REVIEW_PICS,
    permissions.GET_UNPUBLISHED_PLAY_REVIEW
  ],

  [access_level.CREDIT_CARD]: [
    permissions.GET_CREDIT_CARD_REQS,
    permissions.DENY_CREDIT_CARD_REQS,
    permissions.APPROVE_CREDIT_CARD_REQ,
  ]
}

export { adminPermissions }
