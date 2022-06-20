import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { validate } from 'src/helpers/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
      
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const accessToken = req.headers['authorization'];
        const JWT = await this.verifyAccessToken(accessToken);
        return true;
    }

    async verifyAccessToken(accessToken: string) {
        const payload = await validate(accessToken, 'superSecretKey');
    
        const user = await this.authService.verifyUser(payload);
    
        if (!user) {
            throw new UnauthorizedException('No authentication');
        }
    
        return payload;
    }
} 
