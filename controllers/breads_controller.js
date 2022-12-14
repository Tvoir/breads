const express = require('express')
const breads = express.Router()
const Bread = require('../models/bread.js')
const Baker = require('../models/baker.js')

// INDEX
breads.get('/', async (req, res) => {
  const foundBakers = await Baker.find().lean()
  const foundBreads = await Bread.find().limit(2).lean()
    // .then(foundBakers =>{
    //   .then(foundBreads => {
        res.render('index',
          {
            breads: foundBreads,
            bakers: foundBakers,
            title: 'Index Page'
          })
      })

module.exports = breads

// NEW
breads.get('/new', (req, res) => {
  Baker.find()
    .then(foundBakers => {
      res.render('new',{
        bakers: foundBakers
      })
    })
})

breads.get('/:id', (req, res) => {
  Bread.findById(req.params.id)
      .populate('baker')
      .then(foundBread => {
        const bakedBy = foundBread.getBakedBy()
        console.log(bakedBy)
          res.render('show', {
              bread: foundBread
          })
      })
})

// EDIT
breads.get('/:indexArray/edit', (req, res) => {
  Baker.find()
    .then(foundBakers =>{
    Bread.findById(req.params.indexArray)
    .then(foundBread => {
      res.render('edit', {
        bread: foundBread,
        bakers: foundBakers
        })
      })
    // bread: Bread[req.params.indexArray],
    // index: req.params.indexArray
  })
})


// SHOW
breads.get('/:arrayIndex', (req, res) => {
  if (Bread[req.params.arrayIndex]) {
    res.render('Show', {
      bread:Bread[req.params.arrayIndex],
      index: req.params.arrayIndex,
    })
  } else {
    res.render('404')
  }
})


// UPDATE
breads.put('/:arrayIndex', (req, res) => {
  if(req.body.hasGluten === 'on'){
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.findByIdAndUpdate (req.params.arrayIndex, req.body, { new: true})
    .then(updatedBread => {
      console.log(updatedBread)
        res.redirect(`/breads/${req.params.arrayIndex}`)
    })
})



// CREATE
breads.post('/', (req, res) => {
  if (!req.body.image) {
    req.body.image = undefined
  }
  if(req.body.hasGluten === 'on') {
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.create(req.body)
  res.redirect('/breads')
})

// DELETE
breads.delete('/:indexArray', (req, res) => {
  Bread.findByIdAndDelete (req.params.indexArray)
    .then(deletedBread => {
      res.status(303).redirect('/breads')
    })
})




  