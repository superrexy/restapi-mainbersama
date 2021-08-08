/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.group(() => {
    Route.post('login', 'AuthController.login').as('Auth.Login').middleware('otp')
    Route.post('register', 'AuthController.register').as('Auth.Register')
    Route.post('otp-confirmation', 'AuthController.otpConfirmation').as('Auth.OtpConfirmation')
    Route.post('logout', 'AuthController.logout').as('Auth.Logout').middleware('auth')
  })

  Route.group(() => {
    Route.resource('venues', 'VenuesController').apiOnly().middleware({store: ['owner'], update: ['owner'], destroy: ['owner']});
    Route.resource('venues.fields', 'FieldsController').apiOnly().only(['index', 'store', 'update', 'destroy']).middleware({store: ['owner'], update: ['owner'], destroy: ['owner']});
    Route.resource('venues.bookings', 'BookingsController').apiOnly().only(['store']);

    Route.get('bookings', 'BookingsController.index').as('Bookings.Index')
    Route.get('bookings/:id', 'BookingsController.show').as('Bookings.Show')
    Route.get('schedules', 'BookingsController.schedules').as('Bookings.Schedules')
    Route.put('bookings/:id/join', 'BookingsController.join').as('Bookings.Join')
    Route.put('bookings/:id/unjoin', 'BookingsController.unjoin').as('Bookings.Unjoin')

  }).middleware('auth')

}).prefix('api/v1');
