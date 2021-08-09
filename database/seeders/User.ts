import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.create({
      email: 'admin@mainbersama.com',
      password: '12345678',
      role: 'admin',
      isVerifed: true
    })
  }
}
