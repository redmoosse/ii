import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ModelService } from './model.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ModelGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly modelService: ModelService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('question')
  async handleQuestion(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<any>> {
    try {
      const result = await this.modelService.sendRequestToModel({ text: data });
      return { event: 'answer', data: result };
    } catch (err) {
      console.error('Error in handleQuestion:', err);
      client.emit('error', 'Internal server error');
      return { event: 'error', data: 'Something went wrong' };
    }
  }
}