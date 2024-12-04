import { ObjectId } from "mongodb";

export abstract class BaseEntity {
    public id: ObjectId | string;
    public createdAt: Date;

    constructor(id: ObjectId | string = new ObjectId(), createdAt: Date = new Date()) {
        this.id = id;
        this.createdAt = createdAt;
    }
}
