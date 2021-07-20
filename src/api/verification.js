import request from '@/utils/request'
export function verification(verifyID) {
  return request({
    url: '/verify/verification',
    method: 'get',
    params: { verifyID: verifyID }
  })
}
