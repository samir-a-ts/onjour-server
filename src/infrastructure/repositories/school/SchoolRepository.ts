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

    async streamOne(schoolUid: string, app: Socket): Promise<void> {

        logger.info('data');

        const changeStream = SchoolSchema.watch();

        const result = await this._findOne(schoolUid);

        Fold.execute<School>(result, res => {
            app.emit('res-data', {errors: [], result: res.toJSON()});
        }, err => {
            app.emit('res-data', {errors: [err.toJSON()]});
        });

        changeStream.on('change', async doc => {
            logger.info(doc);

            const schema = await SchoolSchema.findOne({ uid: schoolUid });

            if (schema != null || schema != undefined) {
                const res = schema.toObject();

                const school = School.fromJSON(res);

                if (school.confirmed) {
                    app.emit('res-data', school.toJSON());
                } else {
                    app.emit(
                        'res-data',
                        new AppError({ 
                            code: 'SchoolDidNotConfirmed',
                            message: 'That school doesnt confirmed by admininstration yet.'
                        }).toJSON()
                    );
                }
            }
            else {
                app.emit(
                    'res-data',
                    {
                        errors: [
                            new AppError({
                                code: 'SchoolDoesntExist',
                                message: 'This school doesn\'t exist.'
                            }).toJSON(),
                        ],
                    }
                );
            }
        });
    }

    async streamAll(app: Socket): Promise<void> {
        try {
            SchoolSchema
                .find({})
                .then(arr => {
                    const schoolArr = arr.map(v => { 
                        const newV = v.toObject();

                        const school = School.fromJSON(newV);

                        const json = school.toJSON();

                        return json;
                    });

                    app.emit('res-data', {
                        'errors': [],
                        'result': schoolArr,
                    });
                });
        } catch (error) {
            app.emit(
                'res-data',
                {
                    'errors': new AppError({
                        code: 'GetSchoolsError',
                        message: 'Unpredictable error.' 
                    }).toJSON(),
                }
            );
        } 
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