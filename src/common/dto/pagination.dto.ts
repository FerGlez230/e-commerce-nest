import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    //TODO: Transform
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        default: 10,
        type: Number,
        required: false,
        description: 'How many products do you need?'
    })
    limit?: number;
   
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        default: 0,
        type: Number,
        required: false,
        description: 'How many products do want to skip?'
    })
    offset?: number;
}