import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    try {
      // Verify token with Python backend
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const response = await axios.get('https://elimu-global-api.onrender.com/api/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        return {
          id: response.data.user_id || payload.sub,
          email: response.data.email || payload.email,
          role: response.data.role || payload.role
        };
      }

      throw new UnauthorizedException('Invalid token');
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
