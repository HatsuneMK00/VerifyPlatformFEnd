import request from '@/utils/request'
export function verification(verifyId) {
  return request({
    url: '/verify/verification',
    method: 'get',
    params: { verifyId: verifyId }
  })
}
