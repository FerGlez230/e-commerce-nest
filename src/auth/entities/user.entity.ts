import { IsArray, IsBoolean, IsEmail, IsString, isString } from "class-validator";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false,
        unique: true
    })
    email: string;

    @Column('text', {
        nullable: false,
        select: false
    })
    password: string;

    @Column('text')
    fullname: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]

    @OneToMany(
        () => Product,
        product => product.user
    )
    product: Product;

    @BeforeInsert()
    @BeforeUpdate()
    checkFieldsBeforeTransaction() {
        this.email = this.email.trim().toLocaleLowerCase();
    }
}
