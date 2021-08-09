import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Venue from 'App/Models/Venue'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'

export default class VenuesController {
  public async index ({ response }: HttpContextContract) {
    const getVenues = await Venue.query().select('id', 'name', 'address', 'phone', 'user_id').preload('fields')
    return response.ok({message: 'success', data: getVenues})
  }

  public async store ({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    const validate = await request.validate(CreateVenueValidator);
    await user?.related('venues').create(validate);
    return response.ok({ message: 'created new venue' });
  }

  public async show ({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const getVenue = await Venue.query().select('id', 'name', 'address', 'phone', 'user_id').preload('fields').where('id', id).first();
    if(getVenue){
      return response.ok({ message: 'success', data: getVenue })
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }

  public async update ({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const validate = await request.validate(CreateVenueValidator);
    const getVenue = await Venue.findBy('id', id);
    if(getVenue){
      await getVenue.merge(validate).save();
      return response.ok({ message: 'success update venue' })
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const getVenue = await Venue.findBy('id', id);
    if(getVenue){
      await getVenue.delete();
      return response.ok({ message: 'success delete venue' })
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }
}
