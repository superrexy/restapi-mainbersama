import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Venue from './Venue'
import Booking from './Booking'

export default class User extends BaseModel {
  /**
   * @swagger
   * definitions:
   *    User:
   *      type: object
   *      properties:
   *          name:
   *            type: string
   *          email:
   *            type: string
   *            format: email
   *          password:
   *            type: string
   *          role:
   *            type: string
   *            enum: ['owner', 'admin', 'user']
   *      required:
   *        - name
   *        - email
   *        - password
   *        - role
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public role: string

  @column({ columnName: 'isVerifed' })
  public isVerifed: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Venue)
  public venues: HasMany<typeof Venue>

  @hasMany(() => Booking)
  public booking: HasMany<typeof Booking>

  @manyToMany(() => Booking, {
    pivotTable: 'users_has_bookings'
  })
  public bookings: ManyToMany<typeof Booking>
}
