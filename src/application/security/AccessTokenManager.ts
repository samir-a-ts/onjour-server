abstract class AccessTokenManager {
  abstract sign(json: Record<string, unknown>): Promise<string>;

  abstract decode(accessToken: string): Promise<Record<string, unknown>>;

  abstract verify(accessToken: string): Promise<Record<string, unknown>>;
}

export default AccessTokenManager;