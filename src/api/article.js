import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Object} params
 * @returns Promise
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}
/**
 * 获取频道
 * @returns Promise
 */
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
/**
 * 删除文章
 * @param {String}} articleId
 * @returns Promise
 */
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
/**
 * 发表文章
 * @param {Object} data
 * @param {Boolean} draft
 * @returns Promise
 */
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data
  })
}

/**
 * 获取指定文章
 * @param {String} articleId
 * @returns Promise
 */
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 编辑文章
 * @param {String} articleId
 * @param {Object} data
 * @param {Boolean} draft
 * @returns Promise
 */
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}

/**
 * 修改文章评论状态
 * @param {String} articleId
 * @param {Boolean} allowComment
 * @returns Promise
 */
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
