import { TarefaModel } from "./tarefa.model";

export interface PageTarefaModel {
    total: number,
	page: number,
	search: string,
	limit: number,
	pages: number,
	data?: TarefaModel[]
}
