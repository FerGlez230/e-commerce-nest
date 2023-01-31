import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
@Entity({
    name: 'products'
})
export class Product {
    @ApiProperty({
        example: '487209a3-a9c5-4ad6-890d-6ad2fb2187e0',
        uniqueItems: true,
        description: 'Product id from generated uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    @ApiProperty({
        example: 'Green t-shirt',
        uniqueItems: true,
        description: 'Product title'})
    title:string

    @Column('float', {
        default: 0
    })
    @ApiProperty({
        example: '100.99',
        default: 0,
        type: Number,
        description: 'Product price'})
    price: number;

    @Column('text', {
        nullable: true
    })
    @ApiProperty({
        example: 'Exercitation ex ullamco minim reprehenderit ea qui anim ipsum non est laboris magna laborum et.',
        default: null,
        description: 'Product description'})
    description: string

    @Column('text', {
        unique: true
    })
    @ApiProperty({
        example: 'green_t_shirt',
        uniqueItems: true,
        description: 'Product slug for SEO'})
    slug: string;

    @Column('int', {
        default: 0
    })
    @ApiProperty({
        example: 10,
        default: 0,
        type: Number,
        description: 'Product current stock'})
    stock: number;

    @Column('text', {
        array: true,
        default: []
    })
    @ApiProperty({
        example: ['sprint', 'shirt'],
        default: [],
        type: [String],
        description: 'Product tags'})
    tags:string[]

    @Column('text', {
        array: true
    })
    @ApiProperty({
        example: ['S', 'M', 'L'],
        type: [String],
        description: 'Product sizes'})
    sizes:string[]

    @Column('text')
    @ApiProperty({
        example: ['man', 'unisex'],
        type: [String],
        description: 'Product gender'})
    gender: string


    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    @ApiProperty({
        example: ['https://url_one.com', 'https://url_two.com'],
        type: [String],
        description: `Product's images`})
    images: ProductImage[];
    
    @ManyToOne(
        () => User,
        (user) => user.product,
        {
            eager: true
        }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if( !this.slug ) {
            this.slug = this.title;
        }

        this.validateSlug();
    }
    @BeforeUpdate()
    checkSlugUpdate() {
        this.validateSlug();
    }
    validateSlug() {
        this.slug = this.slug
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/'/g, '');
    }
}
