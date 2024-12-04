import { ObjectId } from "mongodb";

export abstract class BaseEntity {
    constructor(
        public id: string = new ObjectId().toString(),
        public createdAt: Date = new Date()
    ) {}
}
