import {
    Entity,
    Column,
    Unique,
    ObjectIdColumn, ObjectID,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"])
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    @Length(3, 20)
    @IsNotEmpty()
    username: string;

    @Column()
    @Length(6, 100)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    @Length(2, 30)
    @IsNotEmpty()
    firstName: string;

    @Column()
    @Length(1, 100)
    @IsNotEmpty()
    lastName: string;

    @Column()
    birthday: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8); // TODO: add salt
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
