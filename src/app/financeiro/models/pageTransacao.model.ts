import { TransacaoModel } from "./transacao.model";

export interface PageTransacaoModel {
    total: number,
	page: number,
	search: string,
	limit: number,
	pages: number,
	data?: TransacaoModel[]
}
