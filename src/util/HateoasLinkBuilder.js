/**
 * Encapsulates builder methods of HATEOAS links
 */
export class HateoasLinkBuilder {
  /**
   * Constructs link for self.
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
   * Constructs link for specific resource.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} resource - The specific resource.
   * @returns {object} - An object containing the link.
   */
  static getResourceLink (req, resourceId, resource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}`)
    return {
      href: url,
      method: 'GET',
      title: 'Get resource by ID',
      description: `The requested resource ${resource}`
    }
  }

  /**
   * Constructs link for specific resource's next resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} resource - The specific resource.
   * @param {*} nextResource - The specific resource's next resource.
   * @returns {object} - An object containing the link.
   */
  static getNextResourceLink (req, resourceId, resource, nextResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}`)
    return {
      href: url + nextResource,
      method: 'GET',
      title: 'Get next resource',
      description: `Get the next resource in the hierarchy of the requested resource ${resource}`
    }
  }

  /**
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
}
