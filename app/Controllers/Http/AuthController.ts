import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Mail from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User';
import OtpUser from 'App/Models/OtpUser';


export default class AuthController {
  public async register({ request, response }: HttpContextContract){
    const schemaRegister = schema.create({
      name: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.required(), rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.required(), rules.minLength(6)]),
    })

    const validate = await request.validate({ schema: schemaRegister });

    const storeUser = await User.create(validate);

    const otp = string.generateRandom(6);

    await OtpUser.create({ userId: storeUser.id, otp })

    await Mail.send((message) => {
      message
      .from('adonis.demo@sanberdev.com')
      .to(validate.email)
      .subject('Verify User Register')
      .htmlView('emails/otp', { otp })
    })



    return response.created({message: 'register success, please verify your otp code'});
  }

  public async login({ request, response, auth }: HttpContextContract){
    const schemaLogin = schema.create({
      email: schema.string({}, [rules.required(), rules.email()]),
      password: schema.string({}, [rules.required(), rules.minLength(6)]),
    })

    const validate = await request.validate({ schema: schemaLogin });

    try {
      const token = await auth.use('api').attempt(validate.email, validate.password);
      return response.ok({ status: true, token });
    } catch (error) {
      return response.unauthorized({ status: false, message: 'Invalid Email or Password' })
    }
  }

  public async logout({ response, auth }: HttpContextContract){
    await auth.use('api').revoke()
    return response.ok({ revoke: true })
  }

  public async otpConfirmation({ request, response }: HttpContextContract){
    const schemaotp = schema.create({
      email: schema.string({}, [rules.required(), rules.email()]),
      otp_code: schema.string({}, [rules.required(), rules.maxLength(6)]),
    })

    const validate = await request.validate({ schema: schemaotp })
    const user = await User.findBy('email', validate.email)
    if(user){
      const otp = await OtpUser.findBy('otp', validate.otp_code)
      if(otp){
        await user.merge({ isVerifed: true }).save()
        return response.ok({ message: 'Berhasil Konfirmasi OTP' });
      } else {
        return response.badRequest({ message: 'Kode OTP Salah'});
      }
    } else {
      return response.badRequest({ message: 'Email Tidak Ditemukan' });
    }

  }
}
