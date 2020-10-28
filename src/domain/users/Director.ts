import { Document } from 'mongoose';
import User, { UserParams } from './User';

class Director extends User {

    constructor(
        params:
        UserParams) {
        const newParams = params;

        newParams.title = 'director';

        super(params);
    }

    toSchema(): Document {
        throw new Error("Method not implemented.");
    }
    toJSON(): Record<string, unknown> {
        throw new Error("Method not implemented.");
    }
}

export default Director;