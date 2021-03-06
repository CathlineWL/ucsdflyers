
export function LoginUserAction (userData) {
  return {
    type: 'LOGIN_USER',
    userData
  }
}

export function LogoutUserAction(userData){
  return {
    type: 'LOGOUT_USER',
    userData
  }
}

export function LoginStudentAction(userData){
  return {
    type: 'LOGIN_STUDENT',
    userData 
  }
}

export function LoginOrgAction(userData){
  return {
    type: 'LOGIN_ORG',
    userData
  }
}

export function GetOrgsAction(data){
  return {
    type: 'GET_ORGS',
    data
  }
}

export function GetEventsAction(data){
  return {
    type: 'GET_EVENTS',
    data
  }
}

export function GetRecruitmentsAction(data){
  return {
    type: 'GET_RECRUITMENTS',
    data
  }
}

export function UserDataUpdateAction(userData){
  return {
    type: 'USER_DATA_UPDATE',
    userData
  }
}

export function CreateFlyerAction(flyer, user, imagesFiles){
  return {
    type: 'CREATE_FLYER',
    data: { flyer, user, imagesFiles }
  }
}

export function CreateRecruitmentAction(note, user){
  return {
    type: 'CREATE_RECRUITMENT',
    data: { note, user }
  }
}

export function LikeFlyerAction(flyer){
  return {
    type: 'LIKE_FLYER',
    flyer
  }
}

export function SaveRecruitmentAction(recruitment){
  return {
    type: 'SAVE_RECRUITMENT',
    recruitment
  }
}

export function FollowOrgAction(org){
  return {
    type: 'FOLLOW_ORG',
    org
  }
}