import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy  extends PassportStrategy( Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly repositoryUser: Repository<User>,
        private readonly configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }
    async validate( jwt: JwtPayload): Promise<User> {
        const { id } = jwt;
        const user = await this.repositoryUser.findOneBy({id});
        if(!user) throw new UnauthorizedException('Token is not valid');
        if( !user.isActive ) throw new UnauthorizedException('User is not active');
        return user;
    }
}