const db = require('../dbConfig');

const handleServErr = (res, action) => err => {
  console.error(err);
  res.status(500).json({
    error: `Something went wrong while ${action}.`,
    message: err.message
  });
};

const GET_ALL = (_, res) => {
  db('notes')
    .then(notes => res.status(200).json(notes.reverse()))
    .catch(handleServErr(res, 'fetching notes'));
};

const GET_ONE = async (req, res) => {
  const { id } = req.params;
  const note = await db('notes').where({ id }).first();
  try {
    if (!note) res.status(404).json({
      message: 'The requested note wasn\'t found.'
    });
    else res.status(200).json(note);
  } catch (err) {
    handleServErr(res, 'fetching note')(err);
  }
};

const POST = (req, res) => {
  const { title, text } = req.body;
  db('notes').insert({ title, text })
    .then(([ id ]) => res.status(201).json(id))
    .catch(handleServErr(res, 'creating note'));
};

const PUT = (req, res) => {
  const { id } = req.params;
  db('notes').where({ id }).update(req.body)
    .then(count => res.status(200).json(count))
    .catch(handleServErr(res, 'updating note'));
};

const DELETE = (req, res) => {
  const { id } = req.params;
  db('notes').where({ id }).del()
    .then(count => res.status(200).json(count))
    .catch(handleServErr(res, 'deleting note'));
};

const SWITCH = async (req, res) => {
  const { id, id2 } = req.params;
  try {
    const note1 = await db('notes').where({ id }).first();
    const { title, text, created_at } = note1;
    
    const note2 = await db('notes').where({ id: id2 }).first();
    const { title: title2, text: text2, created_at: ca2 } = note2;

    const updateCount = (
      await db('notes').where({ id: id2 }).update({
        title, text, created_at
      })
      + await db('notes').where({ id }).update({
        title: title2, text: text2, created_at: ca2
      })
    );

    res.status(200).json(updateCount);
  } catch(err) {
    handleServErr(res, 'switching notes')(err);
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
