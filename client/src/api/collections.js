export default {

  show(id) {
    return {
      endpoint: `/api/v1/collections/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  collectionResource(cid, crid) {
    return {
      endpoint: `/api/v1/collections/${cid}/relationships/collection_resources/${crid}`,
      method: 'GET',
      options: {
      }
    };
  },

  collectionResources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/collections/${id}/relationships/collection_resources`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  }

};