import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log(payload);
    // console.log('Connected user:', client.id);

    // Example of joining to a specific room.
    // client.join('room-1')
    // client.join(client.email) // Join to a room with the client email
    // this.wss.to('room-1').emit('message-from-server', {...})

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    // console.log('Disconnected user:', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Send only to the client that sent the message
    // client.emit('message-from-server', {
    //   fullName: 'Me from server',
    //   message: payload.message || 'no message!!',
    // });
    //! Send to everyone, except the client.
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Me from server',
    //   message: payload.message || 'no message!!',
    // });

    // this.wss.to(client.id).emit('message-from-server', {...});

    //! Send to everyone, including the client.
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message!!',
    });
  }
}
