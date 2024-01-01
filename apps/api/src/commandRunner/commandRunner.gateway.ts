// websocket.gateway.ts
import { Logger } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class CommandRunnerGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private logger: Logger = new Logger('CommandRunnerGateway');

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, payload: string) {
		const roomId = payload;
		client.join(roomId);
		this.logger.log(`Client joined room ${roomId}`);
	}

	broadcastToRoom(roomId: string, event: string, data: any) {
		this.server.to(roomId).emit(event, data);
		this.logger.log(`Broadcasted ${event} to room ${roomId}. Data: ${data}`);
	}
}
