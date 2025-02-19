import type { FastifyReply, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface } from "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		requestStartTime: bigint;
		language: string;
		apiToken?: {
			id: number;
			userId: number;
			tier: "basic" | "pro" | "unlimited";
			permissions: string[];
		};
	}
}

export interface RoutePermissions extends RouteGenericInterface {
	permissions?: string[];
}

export type ReplyPayload<Payload extends RouteGenericInterface> = FastifyReply<
	RouteGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	Payload
>;
