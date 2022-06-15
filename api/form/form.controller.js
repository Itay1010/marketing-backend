const formService = require('./form.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getForms(req, res) {
  try {
    logger.debug('Getting Forms')
    var queryParams = req.query
    const forms = await formService.query(queryParams)
    res.json(forms);
  } catch (err) {
    logger.error('Failed to get forms', err)
    res.status(500).send({ err: 'Failed to get forms' })
  }
}

// GET BY ID 
async function getFormById(req, res) {
  try {
    const formId = req.params.id;
    const form = await formService.getById(formId)
    res.json(form)
  } catch (err) {
    logger.error('Failed to get form', err)
    res.status(500).send({ err: 'Failed to get form' })
  }
}

// POST (add form)
async function addForm(req, res) {
  try {
    const form = req.body
    const reg = new RegExp('[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+', 'g')
    const forms = await formService.query({ email: form.email })
    if (!reg.test(form.email)) throw new Error('invalid email address')
    else if(forms?.length) throw new Error('user already exists')

    const addedForm = await formService.add(form)
    res.json(addedForm)
  } catch (error) {
    logger.error('Failed to add form', error)
    if (error.code === 'noEmail') res.status(400).send({ error: 'Failed to add form' })
    else if (error.code === 'userExists') res.status(405).send({ error: 'Failed to add form' })
    else res.status(500).send({ error: 'Failed to add form' })
  }
}

// PUT (Update form)
async function updateForm(req, res) {
  try {
    const form = req.body;
    const updatedForm = await formService.update(form)
    res.json(updatedForm)
  } catch (err) {
    logger.error('Failed to update form', err)
    res.status(500).send({ err: 'Failed to update form' })

  }
}

// DELETE (Remove form)
async function removeForm(req, res) {
  try {
    const formId = req.params.id;
    const removedId = await formService.remove(formId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove form', err)
    res.status(500).send({ err: 'Failed to remove form' })
  }
}

module.exports = {
  getForms,
  getFormById,
  addForm,
  updateForm,
  removeForm
}
