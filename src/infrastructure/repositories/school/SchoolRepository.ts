import { Socket } from 'socket.io';
import AppError from '../../../application/errors/error';
import School from '../../../domain/school/School';
import SchoolRepository from '../../../domain/repositories/SchoolRepository';
import SchoolSchema from '../../orm/schemas/school/school_schema';
import constants from '../../config/constants';
import Fold from '../../../application/fold';

const { logger } = constants;

export default class SchoolRepositoryImpl extends SchoolRepository {

    private async _findOne(uid: string): Promise<School | AppError> {
        const schema = await SchoolSchema.findOne({ uid: uid });

            if (schema != null || schema != undefined) {
                const res = schema.toObject();

                const school = School.fromJSON(res);

                if (school.confirmed) {
                    return school;
                } else {
                    return new AppError({ 
                        code: 'SchoolDidNotConfirmed',
                        message: 'That school doesnt confirmed by admininstration yet.'
                    });
                }
            }
            else {
                return new AppError({
                    code: 'SchoolDoesntExist',
                    message: 'This school doesn\'t exist.'
                });
            }
    }

    private async _findAll(): Promise<School[] | AppError> {
        const schema = await SchoolSchema.find({});

        const schoolArr = schema.map(v => {
            const obj = v.toObject();

            const school = School.fromJSON(obj);

            return school;
        });

        return schoolArr;
    }

    async streamOne(schoolUid: string, app: Socket): Promise<void> {

        const changeStream = SchoolSchema.watch([ 
            { $match: { uid: schoolUid } },
         ]);

        const result = await this._findOne(schoolUid);

        Fold.execute<School>(result, res => {
            app.emit('res-data', {errors: [], result: res.toJSON()});
        }, err => {
            app.emit('res-err', {errors: [err.toJSON()]});
        });

        changeStream.on('change', async doc => {
            logger.info(doc);

            const res = await this._findOne(schoolUid);

            Fold.execute<School>(res, r => {
                app.emit('res-data', {errors: [], result: r.toJSON()});
            }, err => {
                app.emit('res-err', {errors: [err.toJSON()]});
            });   
        });
    }

    async streamAll(app: Socket): Promise<void> {
        const changeStream = SchoolSchema.watch();

        const result = await this._findAll();

        Fold.execute<School[]>(
            result,
            res => {
                app.emit('res-data', { errors: [], result: res.map(v => v.toJSON()) });
            },
            err => {
                app.emit('res-err', {errors: [ err.toJSON() ]});
            },
        );

        changeStream.on('change', async doc => {
            logger.info(doc);

            const arr = await this._findAll();

            Fold.execute<School[]>(
                arr,
                schools => app.emit('res-data', {
                    'errors': [],
                    'result': schools.map(s => s.toJSON()),
                }),
                err => app.emit('res-err', {
                    'errors': [ err.toJSON(), ],
                }),
            );
        });

        app.on('disconnect', () => {
            logger.info('Disconnected!');

            changeStream.close();
        });
    }
    
    async save(school: School): Promise<void | AppError> {
        const schema = school.toSchema();

        const result = await SchoolSchema.findOne({ name: school.name });

        if (result === null) {
            await schema.save();
        } else {
            return new AppError({
                code: 'SchoolAlreadyExist',
                message: `This school are alredy registered. ${result.toObject().confirmed ? 'And even confirmed!' : ''}`,
            });
        }
    }

    async confirm(schoolUid: string): Promise<void | AppError> {
        const result = await SchoolSchema.findOne({ uid: schoolUid });

        if (result !== null) {
            const newResult = result.toObject();

            if (newResult.confirmed)
                return new AppError({ code: 'SchoolAlreadyConfirmed', message: 'This school already confirmed.' });

            newResult.confirmed = true;

            await result.updateOne(newResult);
        }
        else {
            return new AppError({code: 'SchoolDoesntExist', message: 'That school doesnt exist. Please register school first.'});
        }
    }

}