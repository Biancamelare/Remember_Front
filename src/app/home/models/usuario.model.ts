export interface UsuarioModel {
   id?: number,
   nome: string,
   email : string,
   data_nasc: Date,
   telefone : string,
   senha : string,
   xp ?: number,
   id_tema ?: number,
   criado_em ?: Date,
   editado_em ?: Date,
   excluido_em ?: Date
}