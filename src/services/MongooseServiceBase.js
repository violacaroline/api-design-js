import { MongooseRepositoryBase } from '../repositories/MongooseRepositoryBase.js'

/**
 * Encapsulates a Mongoose service base.
 */
export class MongooseServiceBase {
  /**
   * The repository.
   *
   * @type {MongooseRepositoryBase}
   */
  _repository // protected!!!

  /**
   * Initializes a new instance.
   *
   * @param {MongooseRepositoryBase} repository - A repository instantiated from a class inherited from MongooseRepositoryBase.
   */
  constructor (repository) {
    this._repository = repository
  }

  /**
   * Gets all documents.
   *
   * @returns {Promise<object>} Promise resolved with all documents as plain JavaScript objects.
   */
  async get () {
    return this._repository.get()
  }

  /**
   * Gets all documents with a certain ID - i.e parent.
   *
   * @param {object} nestedResourceId - ...
   * @returns {Promise<object>} Promise resolved with all documents as plain JavaScript objects.
   */
  async getNestedResourceById (nestedResourceId) {
    return this._repository.get(nestedResourceId)
  }

  /**
   * Gets a document by ID.
   *
   * @param {string} id - The value of the id for the document to get.
   * @returns {Promise<object>} Promise resolved with the found document as a plain JavaScript object.
   */
  async getById (id) {
    return this._repository.getById(id)
  }

  /**
   * Inserts a new document.
   *
   * @param {object} data - ...
   * @returns {Promise<object>} Promise resolved with the created document as a plain JavaScript object.
   */
  async insert (data) {
    return this._repository.insert(data)
  }

  /**
   * MIGHT NOT NEED???
   *
   * Updates a document.
   *
   * @param {number} id - The value of the id for the document to update.
   * @param {object} newData - ...
   * @returns {Promise<object>} Promise resolved with the updated document as a plain JavaScript object.
   */
  async update (id, newData) {
    return this._repository.update(id, newData)
  }

  /**
   * Replaces a document.
   *
   * @param {string} id - The value of the id for the document to update.
   * @param {object} replaceData - The new data to replace the existing document with.
   * @returns {Promise<object>} Promise resolved with the updated document.
   */
  async replace (id, replaceData) {
    return this._repository.replace(id, replaceData)
  }

  /**
   * Deletes a document.
   *
   * @param {number} id - The value of the id for the document to delete.
   * @returns {Promise<object>} Promise resolved with the removed document as a plain JavaScript object.
   */
  async delete (id) {
    return this._repository.delete(id)
  }
}
