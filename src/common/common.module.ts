import { Module } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { ErrorHandler } from './handler/error.handler';

@Module({
    providers: [PaginationDto, ErrorHandler],
    exports: [PaginationDto, ErrorHandler]
})
export class CommonModule {
}
