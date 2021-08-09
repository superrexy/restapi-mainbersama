import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Field from './Field'
import User from './User'

export default class Booking extends BaseModel {
    /**
   * @swagger
   * definitions:
   *    Booking:
   *      type: object
   *      properties:
   *        field_id:
   *          type: number
   *        play_date_start:
   *          type: datetime
   *        play_date_end:
   *          type: datetime
   *      required:
   *        - field_id
   *        - play_date_start
   *        - play_date_end
   */

  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public playDateStart: DateTime

  @column.dateTime()
  public playDateEnd: DateTime

  @column()
  public userId: number

  @column()
  public fieldId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Field)
  public fields: BelongsTo<typeof Field>

  @belongsTo(() => User)
  public user_booking: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'users_has_bookings'
  })
  public players: ManyToMany<typeof User>
}
