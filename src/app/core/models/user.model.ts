export interface Usuario {
  username: string;
  password: string;
}

export interface RespuestaAutenticacion {
  statusCode: number;
  intData: {
    message: string;
    token?: string;
    data?: {
      qr_code?: string;
      secret?: string;
    };
  };
}
