/**
 * Encapsulates builder methods of HATEOAS links
 */
export class HateoasLinkBuilder {
  /**
   * Constructs a link for ALL resources.
   *
   * @param {*} req - Express request object.
   * @returns {object} - An object containing the link.
   */
  static getBaseUrlLink (req) {
    const url = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}`
    )
    return {
      href: url,
      method: 'GET',
      title: 'Get ALL resources'
    }
  }

  /**
   * Constructs link for specific resource.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getPlainResourceLink (req, resourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}`)
    return {
      href: url
    }
  }

  /**
   * Constructs link for specific resource with title and description.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} resource - The specific resource.
   * @returns {object} - An object containing the link.
   */
  static getResourceByIdLink (req, resourceId, resource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}`)
    return {
      href: url,
      method: 'GET',
      title: 'Get resource by ID',
      description: `The requested resource ${resource}`
    }
  }

  /**
   * Constructs link for specific resource with title and description.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceUrlName - The url name of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getResourceByNameLink (req, resourceUrlName) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceUrlName}`)
    return {
      href: url,
      method: 'GET',
      title: 'Gets a specific resource'
    }
  }

  /**
   * Constructs link for specific resource's nested resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceLink (req, resourceId, nestedResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}`)
    return {
      href: url,
      method: 'GET',
      title: 'Get nested resource',
      description: 'Gets ALL instances of the last nested resource in the url'
    }
  }

  /**
   * Constructs link for specific resource's nested resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resource - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource ID.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceByIdLink (req, resource, nestedResource, nestedResourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resource}/${nestedResource}/${nestedResourceId}`)
    return {
      href: url,
      method: 'GET',
      title: 'An instance of the nested resource',
      description: 'Gets an instance of the last nested resource in the url, by its ID'
    }
  }

  /**
   * Constructs link for specific resource's nested resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceName - The name of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceByNameLink (req, resourceName, nestedResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceName}/${nestedResource}`)
    return {
      href: url,
      method: 'GET',
      title: 'Get nested resource',
      description: 'Gets ALL instances of the last nested resource in the url'
    }
  }

  /**
   * Constructs a link for a specific page (ONLY available in getMembers).
   *
   * @param {*} req - Express request object.
   * @param {number} page - Requested page.
   * @param {number} perPage - Amount of ducuments per page.
   * @returns {string} - The link.
   */
  static getPageLink (req, page, perPage) {
    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0]
    const queryString = `page=${page}&perPage=${perPage}`
    return `${baseUrl}?${queryString}`
  }

  /**
   * THIS PROBABLY NEEDS BE BUILT LIKE UPDATE/DELETE IF CHANGING POST ROUTES
   *
   * Constructs link for creating new resource.
   *
   * @param {*} req - Express request object.
   * @returns {object} - An object containing the link.
   */
  static getCreateLink (req) {
    const url = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}`
    )
    return {
      href: url,
      method: 'POST',
      title: 'Create a new resource'
    }
  }

  /**
   * Constructs link for updating a specific resource.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} resource - The specific resource.
   * @returns {object} - An object containing the link.
   */
  static getUpdateLink (req, resourceId, resource) {
    const url = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}`
    )
    return {
      href: url,
      method: 'PUT',
      title: `Update the resource ${resource}`,
      description: `Update the resource ${resource} with ID ${resourceId}`
    }
  }

  /**
   * Constructs link for updating a specific resource by name.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceUrlName - The url name of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getUpdateLinkByName (req, resourceUrlName) {
    const url = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceUrlName}`
    )
    return {
      href: url,
      method: 'PUT',
      title: 'Update the resource'
    }
  }

  /**
   * Constructs link for deleting a specific resource.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} resource - The specific resource.
   * @returns {object} - An object containing the link.
   */
  static getDeleteLink (req, resourceId, resource) {
    const url = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}`
    )
    return {
      href: url,
      method: 'DELETE',
      title: `Delete the resource ${resource}`,
      description: `Delete the resource ${resource} with ID ${resourceId}`
    }
  }

  /**
   * Constructs link for deleting a specific resource by name.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceUrlName - The url name of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getDeleteLinkByName (req, resourceUrlName) {
    const url = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceUrlName}`
    )
    return {
      href: url,
      method: 'DELETE',
      title: 'Delete the resource'
    }
  }
}
