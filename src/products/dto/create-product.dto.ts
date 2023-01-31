import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @ApiProperty({
        type: String,
        required: true,
        minLength: 1,
    })
    title:string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,
        minimum: 0,
    })
    price?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        default: null
    })
    description?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
    })
    slug?:string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        type: Number,
        required: false,
        minimum: 0,
    })
    stock?: number;

    @IsArray()
    @IsString({each: true})
    @ApiProperty({
        type: [String],
    })
    sizes:string[];

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    @ApiProperty({
        type: [String],
        required:false
    })
    tags: string[]

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    @ApiProperty({
        type: [String],
        required:false
    })
    images: string[]

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        enum: ['man', 'woman', 'kid', 'unisex'],
        type: String,
        required:false
    })
    @IsIn(['man', 'woman', 'kid', 'unisex'])
    gender: string;
}
