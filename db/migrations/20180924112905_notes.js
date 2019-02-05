exports.up = knex => (
  knex.schema.createTable('notes', tbl => {
    tbl.increments();
    tbl.string('title').notNullable();
    tbl.string('text');
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

exports.down = knex => (
  knex.schema.dropTable('notes')
);
