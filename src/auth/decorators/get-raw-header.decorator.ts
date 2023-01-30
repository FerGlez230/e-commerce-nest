import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator((data: any, ctxExec: ExecutionContext) => {
    return ctxExec.switchToHttp().getRequest().rawHeaders;
});