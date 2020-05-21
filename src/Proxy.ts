import { IncomingPacket, OutgoingPacket, InboxDto, MessageDto } from '../chat';
import { EventProducer } from './EventProducer';

interface ProxyEventMap {
    "login": () => void;
    "message": ( channelId: string, message: MessageDto ) => void;
    "conversation": ( channelId: string ) => void;
    }

class Proxy extends EventProducer<ProxyEventMap>
{
    private ws: WebSocket;
    inbox: InboxDto | null = null;
    constructor()
    {
        super();
        this.ws = new WebSocket( "wss://raja.aut.bme.hu/chat/" );
        
        this.ws.addEventListener( "message", e =>
        {
            let p = <IncomingPacket>JSON.parse( e.data ); 
            switch ( p.type )
            {
                case "error":
                    alert( p.message );
                    break;
                case "login":
                    this.inbox = p.inbox;
                    this.dispatch( "login" );
                    break;
                case "message":
                    let cid = p.channelId;
                    this.dispatch( "message", cid, p.message );
                    this.inbox!.conversations.find( x => x.channelId === cid )?.lastMessages.push( p.message );
                    break;
                case "conversationAdded":
                    this.inbox!.conversations.push( p.conversation );
                    this.dispatch( "conversation", p.conversation.channelId );
                    break;
            }
        } );
    }
    public sendPacket( packet: OutgoingPacket )
    {
        this.ws.send( JSON.stringify( packet ) );
    }
    public register(email: string, password: string, displayName: string, staySignedIn: boolean)
    {        
        var registrationData = { type: "register", email, password, displayName, staySignedIn} as OutgoingPacket;
        this.sendPacket(registrationData); 
    }

}


export var proxy = new Proxy();