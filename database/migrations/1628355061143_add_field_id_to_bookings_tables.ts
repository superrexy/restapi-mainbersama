import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bookings extends BaseSchema {
  protected tableName = 'bookings'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('field_id').after('user_id').unsigned().references('fields.id').onDelete('CASCADE');
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('field_id')
    })
  }
}
