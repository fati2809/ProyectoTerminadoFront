export interface Usuario {
  username: string;
  password: string;
}

export interface RespuestaAutenticacion {
  intData?: {
    token: string;
  };

}
