import WebSocket from 'ws';
import AppError from '../../../application/errors/error';
import School from '../../../domain/school/School';
import SchoolRepository from '../../../domain/repositories/SchoolRepository';
import SchoolSchema from '../../orm/schemas/school/school_schema';

export default class SchoolRepositoryImpl extends SchoolRepository {

    async getOneStream(schoolUid: string, clients: WebSocket[]): Promise<void> {
        const schema = await SchoolSchema.findOne({ uid: schoolUid });

        if (schema != null) {
            const res = schema.toObject();

            const school = School.fromJSON(res);

            if (school.confirmed) {
                 schema.on('change', data => {
                    clients.forEach(
                        client => 
                        client.send(data),
                    );
                });
            } else {
                clients.forEach(client => client.send(
                        new AppError({ 
                            code: 'SchoolDidNotConfirmed',
                            message: 'That school doesnt confirmed by admininstration yet.'
                        })
                    )
                );
            }
        }
        else {
            clients.forEach(client => client.send(
                    new AppError({ code: 'SchoolDoesntExist', message: 'This school doesn\'t exist.' }).toJSON(),
                )
            );
        }
    }

    async getAllStream(clients: WebSocket[]): Promise<void> {
        try {
            SchoolSchema
            .watch([ {} ])
            .on('change', doc => {
                clients.forEach(
                    client => 
                    client.send(doc)
                );
            });
        } catch (error) {
            clients.forEach( client => client.send(
                    new AppError({
                        code: 'GetSchoolsError',
                        message: 'Unpredictable error.' 
                    }),
                )
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