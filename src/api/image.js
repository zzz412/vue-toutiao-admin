import request from '@/utils/request'

/**
 * 上传文件
 * @param {FormData} data
 * @returns Promise
 */
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}

/**
 * 素材列表
 * @param {Object} params
 * @returns Promise
 */
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

/**
 * 收藏
 * @param {String}} imageId
 * @param {Boolean} collect
 * @returns Promise
 */
export const collectImage = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}

/**
 * 删除
 * @param {imageId} imageId
 * @returns Promise
 */
export const deleteImage = imageId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
