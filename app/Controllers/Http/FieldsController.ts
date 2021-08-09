import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Field from 'App/Models/Field'
import Venue from 'App/Models/Venue';
import CreateFieldValidator from 'App/Validators/CreateFieldValidator';

export default class FieldsController {
  public async index ({ request, response }: HttpContextContract) {
    const idVenue = request.param('venue_id');
    const getFields = await Field.findBy('venue_id', idVenue);
    if(getFields){
      return response.ok({ message: 'success', data: getFields});
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }

  public async store ({ request, response }: HttpContextContract) {
    const idVenue = request.param('venue_id');
    const validate = await request.validate(CreateFieldValidator);
    const getVenue = await Venue.findBy('id', idVenue);
    if(getVenue){
      await getVenue.related('fields').create(validate);
      return response.created({ message: 'created new field' });
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }

  public async update ({ request, response }: HttpContextContract) {
    const idField = request.param('id');
    const validate = await request.validate(CreateFieldValidator);
    const getField = await Field.findBy('id', idField);
    if(getField){
      await getField.merge(validate).save();
      return response.ok({ message: 'updated field' });
    } else {
      return response.badRequest({ message: 'field not found' })
    }
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const idField = request.param('id');
    const getField = await Field.findBy('id', idField);
    if(getField){
      await getField.delete()
      return response.ok({ message: 'deleted field' });
    } else {
      return response.badRequest({ message: 'field not found' })
    }
  }
}
