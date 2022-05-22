const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const pageSkip = filterBy.page - 1 === 0 ? 0 : (+filterBy.page - 1) * 4
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).skip(pageSkip).limit(4).toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        const addedCar = await collection.insertOne(toy)
        return addedCar
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}
async function update(toy) {
    try {
        var id = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: id }, { $set: { ...toy } })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

function _buildCriteria({ txt, inStock, label, page }) {
    const criteria = {}
    const pageSkip = 4
    const reg = { $regex: txt, $options: 'i' }
    if (txt) criteria.name = reg
    if (inStock !== '') criteria.inStock = JSON.parse(inStock)
    // if (+page) criteria.skip = +page - 1 === 0 ? 0 : (+page - 1) * 4
    logger.debug('_buildCriteria - criteria', criteria)
    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}