import { Document } from 'mongoose';
import SchoolSchema from '../../infrastructure/orm/schemas/school/school_schema';
import Location from './Location';
import { v4 as generateUid } from 'uuid';

export type SchoolParams = {
    uid: string,
    name: string,
    location: Location,
    directorUid: string,
    confirmed: boolean,
    assistantUids: string[],
    teacherUids: string[],
    parentUids: string[],
    studentUids: string[],
    classes: [], // TODO!: IMPLEMENT
    chats: [], // TODO: IMPLEMENT TOO
};

class School {
    uid: string;
    location: Location;
    directorUid: string;
    confirmed: boolean;
    assistantsUids: string[];
    chats: [];
    classes: [];
    parentUids: string[];
    studentUids: string[];
    teacherUids: string[];
    name: string;


    constructor({ uid, location, directorUid, confirmed, assistantUids, chats, classes, parentUids, studentUids, teacherUids, name }: SchoolParams) {
        this.uid = uid ?? generateUid();
        this.location = location;
        this.directorUid = directorUid;
        this.confirmed = confirmed ?? false;
        this.assistantsUids = assistantUids ?? [];
        this.chats = chats ?? [];
        this.classes = classes ?? [];
        this.parentUids = parentUids ?? [];
        this.studentUids = studentUids ?? [];
        this.teacherUids = teacherUids ?? [];
        this.name = name;
    }

    toSchema(): Document {
        return new SchoolSchema(this.toJSON());
    }

    static fromJSON(json: Record<string, unknown>): School {
        return new School({
            location: Location.fromJSON(json.location as Record<string, unknown>),
            directorUid: json.directorUid as string,
            name: json.name as string,
            parentUids: json.parentUids as string[],
            teacherUids: json.teacherUids as string[],
            studentUids: json.studentUids as string[],
            assistantUids: json.assistantUids as string[],
            uid: json.uid as string,
            chats: json.chats as [],
            classes: json.classes as [],
            confirmed: json.confirmed as boolean,
        });
    }
    
    toJSON(): Record<string, unknown> {
        return {
            confirmed: this.confirmed,
            directorUid: this.directorUid,
            location: this.location.toJSON(),
            uid: this.uid,
            name: this.name,
            assistantsUids: this.assistantsUids,
            teacherUids: this.teacherUids,
            parentUids: this.parentUids,
            studentUids: this.studentUids,
            // chats: this.chats.map(v => v.toJSON()),
            // classes: this.classes.map(v => v.toJSON()),
        };
    }
}

export default School;