import { UsuarioModel } from "./usuario.model";

export interface loginResponseModel {
    accesToken?: string,
    refreshToken?:string,
    expiresIn?: Date,
    usuario?: UsuarioModel
}