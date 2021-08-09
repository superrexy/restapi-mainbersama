import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Field from 'App/Models/Field'
import Venue from 'App/Models/Venue';
import CreateFieldValidator from 'App/Validators/CreateFieldValidator';

export default class FieldsController {
    /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}/fields:
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
   *          description: Venue ID
   *
   *      tags:
   *        - Fields
   *
   *      summary: Get All Fields at Venue Data
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

  public async index ({ request, response }: HttpContextContract) {
    const idVenue = request.param('venue_id');
    const getFields = await Field.findBy('venue_id', idVenue);
    if(getFields){
      return response.ok({ message: 'success', data: getFields});
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}/fields:
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
   *        - Fields
   *
   *      summary: Create New Field
   *
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      $ref: '#/definitions/Field'
   *              application/json:
   *                  schema:
   *                      $ref: '#/definitions/Field'
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

  /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}/fields/{id_field}:
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
   *          description: Venue ID
   *
   *        - in: path
   *          name: id_field
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Field ID
   *
   *      tags:
   *        - Fields
   *
   *      summary: Update Field By Id
   *
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      $ref: '#/definitions/Field'
   *              application/json:
   *                  schema:
   *                      $ref: '#/definitions/Field'
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

    /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}/fields/{id_field}:
   *    delete:
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
   *        - in: path
   *          name: id_field
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Field ID
   *
   *      tags:
   *        - Fields
   *
   *      summary: Delete Field By Id
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
