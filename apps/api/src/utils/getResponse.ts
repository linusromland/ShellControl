import {
	BadRequestException as NestBadRequestException,
	NotFoundException as NestNotFoundException,
	InternalServerErrorException as NestInternalServerErrorException
} from '@nestjs/common';
import { Response } from '@local/shared/types';

function getResponse(message: string): Response {
	return {
		success: false,
		message,
		data: null
	};
}

export class BadRequestException extends NestBadRequestException {
	constructor(message: string) {
		super(getResponse(message));
	}
}

export class NotFoundException extends NestNotFoundException {
	constructor(message: string) {
		super(getResponse(message));
	}
}

export class InternalServerErrorException extends NestInternalServerErrorException {
	constructor(message: string) {
		super(getResponse(message));
	}
}

export function isHttpException(error: any): boolean {
	return (
		error instanceof BadRequestException ||
		error instanceof NotFoundException ||
		error instanceof InternalServerErrorException
	);
}

export function getValidResponse<T = null>(message: string, data?: T): Response<T> {
	return {
		success: true,
		message,
		data
	};
}
