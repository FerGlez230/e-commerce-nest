import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    title:string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?:string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsArray()
    @IsString({each: true})
    sizes:string[];

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    tags: string[]

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    images: string[]

    @IsString()
    @IsNotEmpty()
    @IsIn(['man', 'woman', 'kid', 'unisex'])
    gender: string;
}
