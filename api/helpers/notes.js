const db = require('../dbConfig');

const GET_ALL = (req, res) => {
  db('notes')
    .then(notes => res.status(200).json(notes.reverse()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong while fetching the notes.',
        message: err.message
      });
    });
};

const GET_ONE = (req, res) => {
  const { id } = req.params;
  db('notes').where({ id }).first()
    .then(note => {
      if (!note) res.status(404).json({
        message: 'The requested note wasn\'t found.'
      });
      else res.status(200).json(note);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong while fetching the note.',
        message: err.message
      });
    });
};

const POST = (req, res) => {
  const { title, text } = req.body;
  db('notes').insert({ title, text })
    .then(ids => res.status(201).json(ids[0]))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong while creating the note.',
        message: err.message
      });
    })
};

const PUT = (req, res) => {
  const { id } = req.params;
  db('notes').where({ id }).update(req.body)
    .then(count => res.status(200).json(count))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong while updating the note.',
        message: err.message
      });
    });
};

const DELETE = (req, res) => {
  const { id } = req.params;
  db('notes').where({ id }).del()
    .then(count => res.status(200).json(count))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong while deleting the note.',
        message: err.message
      });
    });
};

const SWITCH = async (req, res) => {
  const { id, id2 } = req.params;
  try {
    const note1 = await db('notes').where({ id }).first();
    const { title, text, created_at } = note1;
    
    const note2 = await db('notes').where({ id: id2 }).first();
    const { title2: title, text2: text, ca2: created_at } = note2;

    const updateCount = (
      await db('notes').where({ id: id2 }).update({
        title, text, created_at
      })
      + await db('notes').where({ id }).update({
        title: title2, text: text2, created_at: ca2
      })
    );

    updateCount.then(count => res.status(200).json({ count }));
  } catch(err) {
    console.error(err);
    res.status(500)
      .json({
        message: err.message
      });
  }
};

module.exports = {
  GET_ALL,
  GET_ONE,
  POST,
  PUT,
  DELETE,
  SWITCH
};