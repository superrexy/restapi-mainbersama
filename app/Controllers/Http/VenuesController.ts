import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Venue from 'App/Models/Venue'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'

export default class VenuesController {
  /**
   * @swagger
   * paths:
   *  /api/v1/venues:
   *    get:
   *      security:
   *         - bearerAuth: []
   *      tags:
   *        - Venues
   *      summary: Get All Venues Data
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
  public async index ({ response }: HttpContextContract) {
    const getVenues = await Venue.query().select('id', 'name', 'address', 'phone', 'user_id').preload('fields')
    return response.ok({message: 'success', data: getVenues})
  }

  /**
   * @swagger
   * paths:
   *  /api/v1/venues:
   *    post:
   *      security:
   *         - bearerAuth: []
   *      tags:
   *        - Venues
   *      summary: Create New Venue
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      $ref: '#definitions/Venue'
   *              application/json:
   *                  schema:
   *                      $ref: '#definitions/Venue'
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

  public async store ({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    const validate = await request.validate(CreateVenueValidator);
    await user?.related('venues').create(validate);
    return response.ok({ message: 'created new venue' });
  }

    /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}:
   *    get:
   *      security:
   *         - bearerAuth: []
   *      tags:
   *        - Venues
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          schema:
   *            type: number
   *            minimum: 1
   *          description: Venue ID
   *
   *      summary: Show Venue By Id
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

  public async show ({ request, response }: HttpContextContract) {
    const id = request.param('id');
    const getVenue = await Venue.query().select('id', 'name', 'address', 'phone', 'user_id').preload('fields').where('id', id).first();
    if(getVenue){
      return response.ok({ message: 'success', data: getVenue })
    } else {
      return response.badRequest({ message: 'venue not found' })
    }
  }

    /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}:
   *    put:
   *      security:
   *         - bearerAuth: []
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
   *      summary: Update Venue By Id
   *      requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      $ref: '#definitions/Venue'
   *              application/json:
   *                  schema:
   *                      $ref: '#definitions/Venue'
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

    /**
   * @swagger
   * paths:
   *  /api/v1/venues/{id}:
   *    delete:
   *      security:
   *         - bearerAuth: []
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
   *      summary: Delete Venue By Id
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
