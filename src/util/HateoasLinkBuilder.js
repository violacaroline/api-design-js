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
   * @param {*} slug - The slug of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getResourceBySlugLink (req, slug) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${slug}`)
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
   * @param {*} independentResource - The independent resource.
   * @param {*} independentResourceId - The ID of the independent resource.
   * @returns {object} - An object containing the link.
   */
  static getIndependentResourceInNestedResourceLink (req, independentResource, independentResourceId) {
    const baseUrl = 'froot-boot/api/v1/'
    const url = new URL(`${req.protocol}://${req.get('host')}/${baseUrl}${independentResource}/${independentResourceId}`)
    return {
      href: url,
      method: 'GET',
      title: 'Get resource'
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
   * @param {*} slug - The slug of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceBySlugLink (req, slug, nestedResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${slug}/${nestedResource}`)
    return {
      href: url,
      method: 'GET',
      title: 'Get nested resource',
      description: 'Gets ALL instances of the last nested resource in the url'
    }
  }

  /**
   * Constructs a link to delete a specific resource's nested resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceCreateLink (req, resourceId, nestedResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}`)
    return {
      href: url,
      method: 'POST',
      title: 'Create a new resource'
    }
  }

  /**
   * Constructs a link to update a specific resource's nested resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource ID.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceUpdateLink (req, resourceId, nestedResource, nestedResourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}`)
    return {
      href: url,
      method: 'UPDATE',
      title: 'Update nested resource'
    }
  }

  /**
   * Constructs a link to delete a specific resource's nested resource in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource Id.
   * @returns {object} - An object containing the link.
   */
  static getNestedResourceDeleteLink (req, resourceId, nestedResource, nestedResourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}`)
    return {
      href: url,
      method: 'DELETE',
      title: 'Delete nested resource'
    }
  }

  /**
   * Constructs a link to get a specific resource's nested resource's nested resource (hahahaha) in the hierarchy.
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource Id.
   * @param {*} doubleNestedResource - The (hopefully) last nested resource.
   * @returns {object} - An object containing the link.
   */
  static getDoubleNestedResourceLink (req, resourceId, nestedResource, nestedResourceId, doubleNestedResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}/${doubleNestedResource}`)
    return {
      href: url,
      method: 'GET',
      title: 'Gets the (hopefully) last nested resource'
    }
  }

  /**
   * Constructs a link to create a specific resource's nested resource's nested resource (hahahaha).
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource Id.
   * @param {*} doubleNestedResource - The (hopefully) last nested resource.
   * @returns {object} - An object containing the link.
   */
  static getDoubleNestedResourceCreateLink (req, resourceId, nestedResource, nestedResourceId, doubleNestedResource) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}/${doubleNestedResource}`)
    return {
      href: url,
      method: 'POST',
      title: 'Creates a new resource'
    }
  }

  /**
   * Constructs a link to update a specific resource's nested resource's nested resource (hahahaha).
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource Id.
   * @param {*} doubleNestedResource - The (hopefully) last nested resource.
   * @param {*} doubleNestedResourceId - The (hopefully) last nested resource's ID.
   * @returns {object} - An object containing the link.
   */
  static getDoubleNestedResourceByIdLink (req, resourceId, nestedResource, nestedResourceId, doubleNestedResource, doubleNestedResourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}/${doubleNestedResource}/${doubleNestedResourceId}`)
    return {
      href: url,
      method: 'GET',
      title: 'Gets a specific resource'
    }
  }

  /**
   * Constructs a link to update a specific resource's nested resource's nested resource (hahahaha).
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource Id.
   * @param {*} doubleNestedResource - The (hopefully) last nested resource.
   * @param {*} doubleNestedResourceId - The (hopefully) last nested resource's ID.
   * @returns {object} - An object containing the link.
   */
  static getDoubleNestedResourceUpdateLink (req, resourceId, nestedResource, nestedResourceId, doubleNestedResource, doubleNestedResourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}/${doubleNestedResource}/${doubleNestedResourceId}`)
    return {
      href: url,
      method: 'PUT',
      title: 'Updates a resource'
    }
  }

  /**
   * Constructs a link to update a specific resource's nested resource's nested resource (hahahaha).
   *
   * @param {*} req - Express request object.
   * @param {*} resourceId - The ID of the specific resource.
   * @param {*} nestedResource - The specific resource's nested resource.
   * @param {*} nestedResourceId - The specific resource's nested resource Id.
   * @param {*} doubleNestedResource - The (hopefully) last nested resource.
   * @param {*} doubleNestedResourceId - The (hopefully) last nested resource's ID.
   * @returns {object} - An object containing the link.
   */
  static getDoubleNestedResourceDeleteLink (req, resourceId, nestedResource, nestedResourceId, doubleNestedResource, doubleNestedResourceId) {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}/${resourceId}/${nestedResource}/${nestedResourceId}/${doubleNestedResource}/${doubleNestedResourceId}`)
    return {
      href: url,
      method: 'DELETE',
      title: 'Deletes a resource'
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
    const queryString = `page=${page}&per-page=${perPage}`
    return `${baseUrl}?${queryString}`
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
   * Constructs link for updating a specific resource by slug.
   *
   * @param {*} req - Express request object.
   * @param {*} slug - The slug of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getUpdateLinkBySlug (req, slug) {
    const url = new URL(
      `${req.protocol}://${req.get('host')}${req.baseUrl}/${slug}`
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
   * Constructs link for deleting a specific resource by slug.
   *
   * @param {*} req - Express request object.
   * @param {*} slug - The slug of the specific resource.
   * @returns {object} - An object containing the link.
   */
  static getDeleteLinkBySlug (req, slug) {
    const url = new URL(
      `${req.protocol}://${req.get('host')}${req.baseUrl}/${slug}`
    )
    return {
      href: url,
      method: 'DELETE',
      title: 'Delete the resource'
    }
  }
}
