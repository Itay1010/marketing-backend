const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { page: 1 }) {
    try {
        const pageSkip = filterBy.page - 1 === 0 ? 0 : (+filterBy.page - 1) * 4
        const collection = await dbService.getCollection('form')
        var forms = await collection.find(criteria).skip(pageSkip).limit(4).toArray()
        return forms
    } catch (err) {
        logger.error('cannot find forms', err)
        throw err
    }
}

async function getById(formId) {
    try {
        const collection = await dbService.getCollection('form')
        const form = collection.findOne({ _id: ObjectId(formId) })
        return form
    } catch (err) {
        logger.error(`while finding form ${formId}`, err)
        throw err
    }
}

async function remove(formId) {
    try {
        const collection = await dbService.getCollection('form')
        await collection.deleteOne({ _id: ObjectId(formId) })
        return formId
    } catch (err) {
        logger.error(`cannot remove form ${formId}`, err)
        throw err
    }
}

async function add(form) {
    try {
        const collection = await dbService.getCollection('form')
        const addedForm = await collection.insertOne(form)
        return addedForm
    } catch (err) {
        logger.error('cannot insert form', err)
        throw err
    }
}
async function update(form) {
    try {
        var id = ObjectId(form._id)
        delete form._id
        const collection = await dbService.getCollection('form')
        await collection.updateOne({ _id: id }, { $set: { ...form } })
        return form
    } catch (err) {
        logger.error(`cannot update form ${formId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}