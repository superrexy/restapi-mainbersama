import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateBookingValidator from "App/Validators/CreateBookingValidator";
import Field from "App/Models/Field";
import Booking from "App/Models/Booking";
import User from "App/Models/User";

export default class BookingsController {
  /**
   * @swagger
   * paths:
   *  /api/v1/bookings:
   *    get:
   *      security:
   *         - bearerAuth: []
   *      tags:
   *        - Bookings
   *      summary: Get All Bookings Data
   *
   *      responses:
   *          200:
   *              description: 'Success'
   *          400:
   *              description: 'Failed'
   *          401:
   *              description: 'Unauthorized'
   *          500:
   *              description: 'Internal Server Error'
   *
   *
   */

  public async index({ response }: HttpContextContract) {
    const getBooking = await Booking.query()
      .select("id", "field_id", "play_date_start", "play_date_end", "user_id")
      .preload("fields", (query) => {
        query.select("id", "name", "type");
      })
      .preload("user_booking", (query) => {
        query.select("id", "name");
      })
      .preload("players", (query) => {
        query.select('id','name', 'email')
      });
    return response.ok({
      message: "success",
      status: "true",
      data: getBooking,
    });
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}/bookings:
   *    post:
   *      security:
   *         - bearerAuth: []
   *
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Venue ID
   *
   *      tags:
   *        - Venues
   *
   *      summary: Create New Booking Venue Fields
   *
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      $ref: '#definitions/Booking'
   *              application/json:
   *                  schema:
   *                      $ref: '#definitions/Booking'
   *
   *      responses:
   *          200:
   *              description: 'Success'
   *          400:
   *              description: 'Failed'
   *          401:
   *              description: 'Unauthorized'
   *          500:
   *              description: 'Internal Server Error'
   *
   *
   */

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user;
    const validate = await request.validate(CreateBookingValidator);
    const getField = await Field.findBy("id", validate.field_id);
    if (getField) {
      const data = await getField
        ?.related("booking_field")
        .create({
          playDateStart: validate.play_date_start,
          playDateEnd: validate.play_date_end,
          userId: user?.id,
        });
      await user?.related("bookings").attach([data.id]);
      return response.created({
        message: "successfully booking",
        status: true,
        data,
      });
    } else {
      return response.badRequest({ message: "field not found" });
    }
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/schedules:
   *    get:
   *      security:
   *         - bearerAuth: []
   *      tags:
   *        - Bookings
   *      summary: Get All Schedules User
   *
   *      responses:
   *          200:
   *              description: 'Success'
   *          400:
   *              description: 'Failed'
   *          401:
   *              description: 'Unauthorized'
   *          500:
   *              description: 'Internal Server Error'
   *
   *
   */

  public async schedules({ response, auth }: HttpContextContract) {
    const user = auth.user;
    if(user){
      let booking = await User.query().preload('bookings').where('id', user.id)
      if(booking){
        return response.ok({ message: 'success', data: booking })
      } else {
        return response.badRequest({ message: 'schedule not found' })
      }
    }
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/bookings/{id}:
   *    get:
   *      security:
   *         - bearerAuth: []
   *
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Booking ID
   *
   *      tags:
   *        - Bookings
   *
   *      summary: Show Booking By Id
   *
   *      responses:
   *          200:
   *              description: 'Success'
   *          400:
   *              description: 'Failed'
   *          401:
   *              description: 'Unauthorized'
   *          500:
   *              description: 'Internal Server Error'
   *
   *
   */

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const getBooking = await Booking.query()
    .select("id", "field_id", "play_date_start", "play_date_end", "user_id")
    .preload("fields", (query) => {
      query.select("id", "name", "type");
    })
    .preload("user_booking", (query) => {
      query.select("id", "name");
    })
    .preload("players", (query) => {
      query.select('id','name', 'email')
    }).where('id', id);
    if(getBooking.length != 0){
      return response.ok({ message: 'success', data: getBooking })
    } else {
      return response.badRequest({ message: 'booking not found' })
    }
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/bookings/{id}/join:
   *    put:
   *      security:
   *         - bearerAuth: []
   *
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Booking ID
   *
   *      tags:
   *        - Bookings
   *
   *      summary: Join Booking
   *
   *      responses:
   *          200:
   *              description: 'Success'
   *          400:
   *              description: 'Failed'
   *          401:
   *              description: 'Unauthorized'
   *          500:
   *              description: 'Internal Server Error'
   *
   *
   */


  public async join({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    const idBooking = request.param('id');
    const getBooking = await Booking.findOrFail(idBooking);

    await user?.related('bookings').attach([getBooking.id])

    return response.ok({ message: 'success' })
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/bookings/{id}/unjoin:
   *    put:
   *      security:
   *         - bearerAuth: []
   *
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Booking ID
   *
   *      tags:
   *        - Bookings
   *
   *      summary: Unjoin Booking
   *
   *      responses:
   *          200:
   *              description: 'Success'
   *          400:
   *              description: 'Failed'
   *          401:
   *              description: 'Unauthorized'
   *          500:
   *              description: 'Internal Server Error'
   *
   *
   */

  public async unjoin({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    const idBooking = request.param('id');
    const getBooking = await Booking.findOrFail(idBooking);

    await user?.related('bookings').detach([getBooking.id])

    return response.ok({ message: 'success' })
  }

}
