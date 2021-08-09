import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Mail from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User';
import OtpUser from 'App/Models/OtpUser';


export default class AuthController {
  /**
   * @swagger
   * paths:
   *  /api/v1/register:
   *    post:
   *      tags:
   *        - Authentication
   *      description: Register New User and Send OTP to Email
   *      summary: Register New User
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      $ref: '#/definitions/User'
   *              application/json:
   *                  schema:
   *                      $ref: '#/definitions/User'
   *      responses:
   *          201:
   *              description: 'register success, please verify your otp code'
   *          422:
   *              description: 'validation failed'
   *
   */

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

  /**
   * @swagger
   * paths:
   *  /api/v1/login:
   *    post:
   *      tags:
   *        - Authentication
   *      description: Returning Bearer Token and Validate OTP
   *      summary: Login User Account
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                     type: object
   *                     properties:
   *                         email:
   *                           type: string
   *                         password:
   *                           type: string
   *                     required:
   *                        - email
   *                        - password
   *              application/json:
   *                  schema:
   *                     type: object
   *                     properties:
   *                         email:
   *                           type: string
   *                         password:
   *                           type: string
   *                     required:
   *                        - email
   *                        - password
   *      responses:
   *          200:
   *              description: 'login success'
   *          400:
   *              description: 'email account not found'
   *
   */

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

  /**
   * @swagger
   * paths:
   *  /api/v1/logout:
   *    post:
   *      security:
   *         - bearerAuth: []
   *      tags:
   *        - Authentication
   *      description: Revoke Bearer Token
   *      summary: Logout User Account
   *      responses:
   *          200:
   *              description: 'Revoke Token Success'
   *          401:
   *              description: 'Unauthorized access'
   *
   */

  public async logout({ response, auth }: HttpContextContract){
    await auth.use('api').revoke()
    return response.ok({ revoke: true })
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/otp-confirmation:
   *    post:
   *      tags:
   *        - Authentication
   *      description: Set at Users Table isVerified to True
   *      summary: Verification OTP For New Users
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                     type: object
   *                     properties:
   *                         email:
   *                           type: string
   *                         otp_code:
   *                           type: string
   *                     required:
   *                        - email
   *                        - otp_code
   *              application/json:
   *                  schema:
   *                     type: object
   *                     properties:
   *                         email:
   *                           type: string
   *                         otp_code:
   *                           type: string
   *                     required:
   *                        - email
   *                        - otp_code
   *      responses:
   *          200:
   *              description: 'OTP success confirmed'
   *          400:
   *              description: 'Email Tidak Ditemukan / OTP Salah Tidak Ditemukan'
   *
   */

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
