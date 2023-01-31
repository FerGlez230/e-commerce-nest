import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty({
        type: String,
        required: true,
        description: `User's email`
    })
    email: string;

    @Column('text', {
        nullable: false,
        select: false
    })
    @ApiProperty({
        type: String, 
        required: true,
        description:`User's password (Must have a Uppercase, lowercase letter and a number)`,
        minLength: 6,
        maxLength: 50
    })
    password: string;

    @Column('text')
    @ApiProperty({
        type: String, 
        required: true,
        description:`User's fullname`
    })
    fullname: string;

    @Column('bool', {
        default: true
    })
    @ApiProperty({
        type: String, 
        required: false,
        default: true,
        description:`User's status`
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    @ApiProperty({
        type: [String], 
        required: false,
        default: ['user'],
        description:`User's roles`
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
