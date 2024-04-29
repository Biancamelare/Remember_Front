import { ListaTarefa } from "./listaTarefa.model";

export interface TarefaModel {
    id: number,
	id_usuario: number,
	id_categoria: number,
	id_status: number,
	id_prioridade: number,
	nome: string,
	descricao: string,
	anotacao?: string,
	data_criacao: Date,
	data_vencimento: Date,
	criado_em: Date,
	editado_em:Date,
	excluido_em:Date,
	lista_tarefa?: ListaTarefa[]
}
