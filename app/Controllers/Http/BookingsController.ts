import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateBookingValidator from "App/Validators/CreateBookingValidator";
import Field from "App/Models/Field";
import Booking from "App/Models/Booking";
import User from "App/Models/User";

export default class BookingsController {
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

  public async join({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    const idBooking = request.param('id');
    const getBooking = await Booking.findOrFail(idBooking);

    await user?.related('bookings').attach([getBooking.id])

    return response.ok({ message: 'success' })
  }

  public async unjoin({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    const idBooking = request.param('id');
    const getBooking = await Booking.findOrFail(idBooking);

    await user?.related('bookings').detach([getBooking.id])

    return response.ok({ message: 'success' })
  }

}
