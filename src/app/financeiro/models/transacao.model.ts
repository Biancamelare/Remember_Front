export interface TransacaoModel {
    id?: number,
	id_usuario?: number,
	descricao?: string,
	preco?: number,
    categoria ?: string,
    vencimento_em?: Date,
    tipo ?: string
}
