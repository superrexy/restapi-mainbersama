import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class OtpUser extends BaseModel {
  public static table = 'otp_users';

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public otp: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
