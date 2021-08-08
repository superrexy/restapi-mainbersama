import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class OtpVerification {
  public async handle ({ response, request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const email = request.input('email');
    const user = await User.findBy('email', email);

    if(!user){
      return response.badRequest({ message: 'Email Not Found' })
    }

    if(user?.isVerifed){
      await next()
    } else {
      return response.unauthorized({ message: 'OTP Belum Dikonfirmasi, Silahkan Konfirmasi OTP Anda ' });
    }
  }
}
