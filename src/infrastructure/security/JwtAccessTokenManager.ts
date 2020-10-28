import jwt from 'jsonwebtoken';
import AccessTokenManager from '../../application/security/AccessTokenManager';
import environment from '../config/environment';

class JwtAccessTokenManager extends AccessTokenManager {
  async decode(accessToken: string): Promise<Record<string, unknown>> {
    return await jwt.decode(accessToken) as Record<string, unknown>;
  }
  async sign(json: Record<string, unknown>): Promise<string> {
    return await jwt.sign(json, environment.security.jwtSecret);
  }
  async verify(accessToken: string): Promise<Record<string, unknown>> {
    return await jwt.verify(accessToken, environment.security.jwtSecret) as Record<string, unknown>;
  }
}

export default JwtAccessTokenManager;