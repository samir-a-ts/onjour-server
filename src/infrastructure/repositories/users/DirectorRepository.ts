import { Socket } from 'socket.io';
import AppError from '../../../application/errors/error';
import Director from '../../../domain/users/Director';
import UserRepository from '../../../domain/repositories/UserRepository';
import DirectorSchema from '../../orm/schemas/users/director_schema';
import Fold from '../../../application/fold';
import constants from '../../config/constants';

const { logger } = constants;

class DirectorRepositoryImpl extends UserRepository<Director> {
  async register(user: Director): Promise<string | AppError> {
    const res = await DirectorSchema.findOne({ email: user.email });

    if (res === null) {
      const schema = user.toSchema();

      await schema.save();
  
      return user.uid;
    } else {
      return new AppError({
        code: 'EmailAlreadyRegistered',
        message: 'This email already registered.'
      });
    }
  }

  async signIn(email: string, password: string): Promise<string | AppError> {
   const result = await DirectorSchema.findOne({ email });

   if (result !== null) {
      const director = Director.fromJSON(result.toJSON());

      if (director.password === password) {
        return director.uid;
      }
      else {
        return new AppError({
          code: 'IncorrectPassword',
          message: 'Password isn\'t correct.'
        });
      }
   }
   else {
     return new AppError({
       code: 'UserNotFound',
       message: 'User with this email didn\'t exist.'
     });
   }
  }

  async updateOne(uid: string, newData: Record<string, unknown>): Promise<void | AppError> {
    const result = await DirectorSchema.findOne({ uid });

    if (result !== null) {
      const user = Director.fromJSON(result.toJSON());

      user.copyWith(newData);

      await result.updateOne(user.toJSON()); 
    }
    else {
      return new AppError({
        message: 'User didn\'t found.',
        code: 'UserNotFound',
      });
    }
  }

  private async _get(uid: string): Promise<Director | AppError> {
    const schema = await DirectorSchema.findOne({ uid });

    if (schema !== null) {
      return Director.fromJSON(schema.toJSON());
    }
    else {
      return new AppError({
        code: 'UserNotFound',
        message: 'User not found.'
      });
    }
  }
  
  async getOne(uid: string, app: Socket): Promise<void> {
    const changeStream = DirectorSchema.watch([ 
      { $match: { uid } },
     ]);

     const res = await this._get(uid);

     Fold.execute<Director>(
       res,
       director => {
         app.emit('res-data', {
           'errors': [],
           'result': director.toJSON(),
         });
       },
       err => {
         app.emit('res-err', {
           'errors': [ err.toJSON() ]
         });
       },
     );

     changeStream.on('change', async doc => {

      logger.info(doc);

      const res = await this._get(uid);

      Fold.execute<Director>(
        res,
        director => {
          app.emit('res-data', {
            'errors': [],
            'result': director.toJSON(),
          });
        },
        err => {
          app.emit('res-err', {
            'errors': [ err.toJSON() ]
          });
        },
      );

     });

      app.on('disconnect', () => {
        logger.info('Disconnect!');

        changeStream.close();
      });
  }

}

export default DirectorRepositoryImpl;

