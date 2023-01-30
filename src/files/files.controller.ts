import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  private hostname;
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService) {
      this.hostname = configService.get<string>('hostname');
    }
  @Get('product/:imageName')
  finOne(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
    /* res.status(403).json({
      status: false, 
      path: path
    }) */
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }),
  }))
  uploadProductFile(@UploadedFile() file: Express.Multer.File){
    if( !file ){
      throw new BadRequestException('File is required and should be an image');
    }
    const secureUrl = `${this.configService}/files/product/${file.filename}`;
    return {secureUrl};
  }
}
