import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly messagesWsService: MessagesWsService) {

  }
  handleDisconnect(client: Socket) {

    this.messagesWsService.removeClient(client);
    // console.log('cientes connectados', this.messagesWsService.getConnectedClients());
  }
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    // console.log('cient connected', client.id);
    // console.log('cientes connectados', this.messagesWsService.getConnectedClients());
    
  }
}
