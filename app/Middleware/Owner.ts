import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Owner {
  public async handle ({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user
    if(user?.role == "owner" || user?.role == "admin"){
      await next()
    } else {
      return response.badRequest({ message: 'Hanya Bisa Diakses Owner' })
    }
  }
}
