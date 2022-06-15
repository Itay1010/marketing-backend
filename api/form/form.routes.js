const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getForms, getFormById, addForm, updateForm, removeForm, addReview } = require('./form.controller')
const router = express.Router()

// middleware for authenticating all routs here
// router.use(requireAuth)

router.get('/', log, getForms)
router.get('/:id', getFormById)

// authenticated routs
// router.post('/', requireAuth, requireAdmin, addForm)
// router.put('/:id', requireAuth, requireAdmin, updateForm)
// router.delete('/:id', requireAuth, requireAdmin, removeForm)

// debug routes
router.post('/', addForm)
router.put('/:id', updateForm)
router.delete('/:id', removeForm)

module.exports = router