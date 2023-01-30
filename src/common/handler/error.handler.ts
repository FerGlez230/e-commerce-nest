import { BadRequestException, Logger } from "@nestjs/common";

export class ErrorHandler {
    private readonly logger = new Logger('');
    public handleDBExceptions(error: any, context: string) {
        if( error.code == '23505' ){
          throw new BadRequestException(error.detail)
        }
        this.logger.error(error, undefined, context);
        
        throw new Error('Check logs');
      }
};
