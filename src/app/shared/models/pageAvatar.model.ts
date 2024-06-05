import { AvatarModel } from "./avatar.model";

export interface PageAvatarModel {
    total: number,
	page: number,
	search: string,
	limit: number,
	pages: number,
	data?: AvatarModel[]
}
